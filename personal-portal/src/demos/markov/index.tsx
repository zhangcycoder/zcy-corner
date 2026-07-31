import { useMemo, useState } from 'react'

/** @name 句末标点 / 换行,用于判定句子边界与自然停止 */
const SENTENCE_END = /[。！？\n]/

/** @name 生成长度上限(字) */
const MAX_LEN = 96
/** @name 命中句末标点后至少累计多少字才允许停止,避免刚开头就结束 */
const MIN_LEN = 28

type CorpusKey = 'frontend' | 'genai'

interface Corpus {
  label: string
  text: string
}

/**
 * @name 内置语料
 * @description 两段本人手写的中文短文(无版权顾虑),分别关于前端交互与生成式模型。
 *   字符级马尔可夫链直接在这些文本上统计,不做任何分词。
 */
const CORPORA: Record<CorpusKey, Corpus> = {
  frontend: {
    label: '前端 · 交互',
    text:
      '好的界面不是被设计出来的,而是被反复打磨出来的。每一次交互都是一次对话,用户按下按钮,界面必须立刻回应,哪怕只是一个细微的高亮,也在告诉用户:我收到了。响应速度决定了信任,延迟一旦超过一百毫秒,手感就开始变得迟钝。动画不是装饰,而是解释,它让状态的变化变得可以理解,让元素从哪里来、到哪里去都有迹可循。真正好的动效是克制的,快进快出,不打断用户的节奏。布局要留白,留白不是浪费空间,而是让重点自己浮现出来。颜色要有层次,让视线自然地落在最重要的地方。可访问性不是额外的负担,而是设计的底线,每一个按钮都应该可以被键盘聚焦,每一张图片都应该有替代文本。前端的手艺,就藏在这些看不见的细节里。',
  },
  genai: {
    label: '生成式 · AI',
    text:
      '生成式模型并不理解语言,它只是在庞大的语料里学会了统计规律。它记住的是,某个字后面最可能出现哪个字,某个词旁边常常站着哪个词。它没有意图,没有记忆,也没有对世界的认识,它拥有的只是概率。当你给它一个开头,它就沿着概率最高的路径,一个字一个字地往下走,像在迷雾里凭着惯性前行。温度决定了它的胆量,温度越低,它越保守,越贴近语料里最常见的说法;温度越高,它越大胆,越容易说出意想不到的句子,也越容易语无伦次。它能写出局部通顺的文字,却常常在整体上不知所云,因为它看到的永远只是眼前的几个字,而不是完整的意义。它是一面镜子,照出的是语料,而不是思想。',
  },
}

/**
 * @name 字符级马尔可夫模型
 * @description transitions 把每个「前 order 个字」的前缀映射到「下一个字 → 出现次数」的频次表;
 *   starts 是可作为生成起点的前缀(开头,或紧跟句末标点之后);corpusLength 为语料字数。
 */
interface MarkovModel {
  order: number
  transitions: Map<string, Map<string, number>>
  starts: string[]
  corpusLength: number
}

/**
 * @name 构建 n-gram 模型
 * @description 遍历语料每个位置,取前 order 个字为前缀、下一个字为后继,累加频次;
 *   同时收集句首前缀作为生成起点。纯统计、无随机,可安全在 render 中调用。
 * @param text 语料原文
 * @param order 前缀长度(阶数),即用前几个字预测下一个字
 */
function buildModel(text: string, order: number): MarkovModel {
  const transitions = new Map<string, Map<string, number>>()
  const starts: string[] = []
  const len = text.length

  for (let i = 0; i + order < len; i += 1) {
    const prefix = text.slice(i, i + order)
    const next = text[i + order]
    let dist = transitions.get(prefix)
    if (!dist) {
      dist = new Map()
      transitions.set(prefix, dist)
    }
    dist.set(next, (dist.get(next) ?? 0) + 1)
    // 语料开头或句末标点之后的前缀,读起来更像一句话的开头
    if (i === 0 || SENTENCE_END.test(text[i - 1])) {
      if (!SENTENCE_END.test(prefix[0])) starts.push(prefix)
    }
  }

  // 语料过短、句读不足时兜底:任取一个前缀当起点
  if (starts.length === 0) {
    const first = transitions.keys().next().value
    if (first !== undefined) starts.push(first)
  }

  return { order, transitions, starts, corpusLength: len }
}

/** @name 贪心取频次最高的后继(确定性,用于首屏预览) */
function greedyPick(dist: Map<string, number>): string {
  let best = ''
  let bestCount = -Infinity
  for (const [ch, count] of dist) {
    if (count > bestCount) {
      bestCount = count
      best = ch
    }
  }
  return best
}

/**
 * @name 按温度采样后继
 * @description 权重取 count^(1/T):温度越低指数越大,分布越尖锐、越贴近语料;
 *   温度越高越平坦、越接近均匀随机。T=1 时权重即原始频次,等价最大似然采样。
 * @param temperature 采样温度,下限 0.05 避免除零
 */
function randomPick(dist: Map<string, number>, temperature: number): string {
  const t = Math.max(temperature, 0.05)
  const entries = [...dist.entries()]
  const weights = entries.map(([, count]) => Math.pow(count, 1 / t))
  let total = 0
  for (const w of weights) total += w
  let r = Math.random() * total
  for (let i = 0; i < entries.length; i += 1) {
    r -= weights[i]
    if (r <= 0) return entries[i][0]
  }
  return entries[entries.length - 1][0]
}

/**
 * @name 生成一段文本
 * @description 从起点前缀出发,反复采样下一个字并滑动窗口,直到长度上限或落入
 *   死胡同(前缀无后继)或抵达句末标点的自然停止。useRandom=false 时走确定性贪心路径,
 *   不触碰 Math.random,可在 render 中调用;=true 时按温度随机采样,只在事件回调里用。
 * @param useRandom 是否随机采样(含随机起点)
 */
function generate(model: MarkovModel, temperature: number, useRandom: boolean): string {
  const { transitions, starts, order } = model
  if (starts.length === 0) return ''

  let prefix = useRandom ? starts[Math.floor(Math.random() * starts.length)] : starts[0]
  let out = prefix

  while (out.length < MAX_LEN) {
    const dist = transitions.get(prefix)
    if (!dist || dist.size === 0) break // 死胡同:自然停止
    const next = useRandom ? randomPick(dist, temperature) : greedyPick(dist)
    out += next
    if (SENTENCE_END.test(next) && out.length >= MIN_LEN) break // 句末:自然停止
    prefix = out.slice(out.length - order)
  }

  return out
}

/**
 * @name 马尔可夫文本生成器 demo
 * @description 运行时在选中的中文语料上构建字符级 n-gram 马尔可夫链,按可调阶数与温度
 *   采样生成文本。首屏用确定性贪心走一遍(纯计算,满足 react-hooks/purity);「生成」及
 *   调参时在事件回调里按温度随机采样,每次结果不同。模型全部本地手写,不联网、不加载任何库。
 */
export default function MarkovDemo() {
  const [corpusKey, setCorpusKey] = useState<CorpusKey>('genai')
  const [order, setOrder] = useState(3)
  const [temperature, setTemperature] = useState(0.9)
  // null 时展示确定性预览;非 null 时展示用户触发的随机采样结果
  const [sample, setSample] = useState<string | null>(null)

  const model = useMemo(() => buildModel(CORPORA[corpusKey].text, order), [corpusKey, order])
  const preview = useMemo(() => generate(model, temperature, false), [model, temperature])
  const shown = sample ?? preview

  const regenerate = () => setSample(generate(model, temperature, true))

  const onOrderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextOrder = Number(event.target.value)
    setOrder(nextOrder)
    // 阶数变了模型也变,直接用新模型随机掷一段(随机采样在事件回调里,合规)
    setSample(generate(buildModel(CORPORA[corpusKey].text, nextOrder), temperature, true))
  }

  const onCorpusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextKey = event.target.value === 'frontend' ? 'frontend' : 'genai'
    setCorpusKey(nextKey)
    setSample(generate(buildModel(CORPORA[nextKey].text, order), temperature, true))
  }

  const onTemperatureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextTemp = Number(event.target.value)
    setTemperature(nextTemp)
    // 已有随机结果时用新温度重掷一次,便于直接对比;仍在预览态则等用户按「生成」
    if (sample !== null) setSample(generate(model, nextTemp, true))
  }

  return (
    <div className="markov-demo">
      <div className="markov-demo__bar">
        <button type="button" className="markov-demo__btn" onClick={regenerate}>
          生成
        </button>

        <label className="markov-demo__field" htmlFor="markov-corpus">
          语料
          <select
            id="markov-corpus"
            className="markov-demo__select"
            value={corpusKey}
            onChange={onCorpusChange}
          >
            {(Object.keys(CORPORA) as CorpusKey[]).map((key) => (
              <option key={key} value={key}>{CORPORA[key].label}</option>
            ))}
          </select>
        </label>

        <label className="markov-demo__field" htmlFor="markov-order">
          阶数 n = {order}
          <input
            id="markov-order"
            className="markov-demo__range"
            type="range"
            min={1}
            max={4}
            step={1}
            value={order}
            onChange={onOrderChange}
          />
        </label>

        <label className="markov-demo__field" htmlFor="markov-temp">
          温度 = {temperature.toFixed(1)}
          <input
            id="markov-temp"
            className="markov-demo__range"
            type="range"
            min={0.2}
            max={1.6}
            step={0.1}
            value={temperature}
            onChange={onTemperatureChange}
          />
        </label>
      </div>

      <div className="markov-demo__output" role="status" aria-live="polite" aria-label="生成结果">
        {shown}
      </div>

      <p className="markov-demo__stat">
        阶数 {order} · 语料 {model.corpusLength} 字 · {model.transitions.size} 个状态
      </p>

      <p className="markov-demo__note">
        运行时在选中语料上现算的字符级马尔可夫链:统计「前 {order} 个字 → 下一个字」的频次再按温度采样。
        低温更贴近原文、更确定,高温更发散、更随机。它只有局部统计、没有理解,所以读起来常常局部通顺、整体离谱。
        全程本地手写,不联网、不加载任何库。
      </p>
    </div>
  )
}
