import { useState } from 'react'

interface Moment {
  id: number
  text: string
  synced: boolean
}

const SEED: Moment[] = [
  { id: 1, text: '一起看了日落', synced: true },
  { id: 2, text: '煮了咖啡', synced: true },
]

/**
 * @name Together Trace 离线优先 demo
 * @description 全假数据、自包含:离线时本地先写入并入队,切回在线后 flush 同步。
 *   仅演示"离线优先"工程概念,不触网、不涉真实数据、不引导登录。
 */
export default function TogetherTraceOfflineDemo() {
  const [online, setOnline] = useState(false)
  const [draft, setDraft] = useState('')
  const [moments, setMoments] = useState<Moment[]>(SEED)
  const [nextId, setNextId] = useState(3)

  const pending = moments.filter((moment) => !moment.synced).length

  const addMoment = () => {
    const text = draft.trim()
    if (!text) return
    // 离线优先:无论在线与否都先本地写入并立即可见;在线则视为已同步
    setMoments((list) => [...list, { id: nextId, text, synced: online }])
    setNextId((value) => value + 1)
    setDraft('')
  }

  const toggleOnline = () => {
    const next = !online
    setOnline(next)
    // 回到在线 → flush 同步队列
    if (next) setMoments((list) => list.map((moment) => ({ ...moment, synced: true })))
  }

  return (
    <div className="tt-offline">
      <div className="tt-offline__bar">
        <span className={'tt-offline__status' + (online ? ' is-online' : '')}>
          {online ? '● 在线' : '○ 离线'}
        </span>
        {pending > 0 && <span className="tt-offline__pending">待同步 {pending}</span>}
        <button type="button" className="tt-offline__toggle" onClick={toggleOnline}>
          {online ? '🔌 切到离线' : '🔌 回到在线'}
        </button>
      </div>

      <div className="tt-offline__compose">
        <input
          className="tt-offline__input"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => { if (event.key === 'Enter') addMoment() }}
          placeholder="写一条 moment…"
          aria-label="写一条 moment"
        />
        <button type="button" className="tt-offline__add" onClick={addMoment}>添加</button>
      </div>

      <ul className="tt-offline__list">
        {moments.map((moment) => (
          <li key={moment.id} className="tt-offline__item">
            <span>{moment.text}</span>
            <span className={'tt-offline__tag' + (moment.synced ? ' is-synced' : '')}>
              {moment.synced ? 'synced ✓' : 'queued'}
            </span>
          </li>
        ))}
      </ul>

      <p className="tt-offline__note" role="status" aria-live="polite">
        {pending > 0 ? `${pending} 条待同步。` : '已全部同步。'}
        本地先写、界面即时可见;回到在线自动 flush 同步队列。全假数据,仅演示离线优先概念。
      </p>
    </div>
  )
}
