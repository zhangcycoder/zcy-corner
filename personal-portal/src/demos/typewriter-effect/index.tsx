import Typewriter from '../../components/Typewriter'

const TYPEWRITER_PHRASES = [
  'Full Stack Developer',
  'React Enthusiast',
  'Open Source Contributor',
]

/**
 * @name 循环打字机 Demo
 * @description 在局部预览舞台中复用旧打字机实现，不附加全屏视觉效果。
 */
export default function TypewriterEffectDemo() {
  return (
    <div className="typewriter-effect-demo">
      <span className="typewriter-effect-demo__index">TEXT LOOP / 03</span>
      <Typewriter
        className="typewriter-effect-demo__text"
        texts={TYPEWRITER_PHRASES}
        charInterval={80}
        pauseDuration={2000}
      />
    </div>
  )
}
