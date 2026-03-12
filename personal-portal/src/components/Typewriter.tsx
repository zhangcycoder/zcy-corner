import { useEffect, useReducer, useRef } from 'react';

export interface TypewriterProps {
  texts: string[];
  charInterval?: number;   // 每字间隔，默认 80ms（≤100ms）
  pauseDuration?: number;  // 完成后暂停，默认 2000ms
  className?: string;
  style?: React.CSSProperties;
}

// ─── 状态机 ───────────────────────────────────────────────────────────────────

export interface TypewriterState {
  currentTextIndex: number;
  displayedText: string;
  isDeleting: boolean;
  isPaused: boolean;
}

export type TypewriterAction =
  | { type: 'ADD_CHAR'; fullText: string }
  | { type: 'REMOVE_CHAR' }
  | { type: 'START_PAUSE' }
  | { type: 'END_PAUSE' }
  | { type: 'NEXT_TEXT'; total: number };

export function typewriterReducer(
  state: TypewriterState,
  action: TypewriterAction
): TypewriterState {
  switch (action.type) {
    case 'ADD_CHAR':
      return {
        ...state,
        displayedText: action.fullText.slice(0, state.displayedText.length + 1),
      };
    case 'REMOVE_CHAR':
      return {
        ...state,
        displayedText: state.displayedText.slice(0, -1),
      };
    case 'START_PAUSE':
      return { ...state, isPaused: true, isDeleting: false };
    case 'END_PAUSE':
      return { ...state, isPaused: false, isDeleting: true };
    case 'NEXT_TEXT':
      return {
        ...state,
        isDeleting: false,
        isPaused: false,
        displayedText: '',
        currentTextIndex: (state.currentTextIndex + 1) % action.total,
      };
    default:
      return state;
  }
}

const INITIAL_STATE: TypewriterState = {
  currentTextIndex: 0,
  displayedText: '',
  isDeleting: false,
  isPaused: false,
};

// ─── 组件 ─────────────────────────────────────────────────────────────────────

export default function Typewriter({
  texts,
  charInterval = 80,
  pauseDuration = 2000,
  className,
  style,
}: TypewriterProps) {
  // 确保 charInterval 不超过 100ms
  const interval = Math.min(charInterval, 100);

  const [state, dispatch] = useReducer(typewriterReducer, INITIAL_STATE);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    if (!texts || texts.length === 0) return;

    let timerId: ReturnType<typeof setTimeout>;

    const tick = () => {
      const { currentTextIndex, displayedText, isDeleting, isPaused } = stateRef.current;
      const fullText = texts[currentTextIndex] ?? '';

      if (isPaused) {
        // 暂停阶段结束 → 开始删除
        dispatch({ type: 'END_PAUSE' });
        timerId = setTimeout(tick, interval / 2);
        return;
      }

      if (isDeleting) {
        if (displayedText.length > 0) {
          // 删除一个字符（删除速度是打字的 2 倍）
          dispatch({ type: 'REMOVE_CHAR' });
          timerId = setTimeout(tick, interval / 2);
        } else {
          // 删除完毕 → 切换到下一段
          dispatch({ type: 'NEXT_TEXT', total: texts.length });
          timerId = setTimeout(tick, interval);
        }
        return;
      }

      // 打字阶段
      if (displayedText.length < fullText.length) {
        dispatch({ type: 'ADD_CHAR', fullText });
        timerId = setTimeout(tick, interval);
      } else {
        // 打字完成 → 进入暂停
        dispatch({ type: 'START_PAUSE' });
        timerId = setTimeout(tick, pauseDuration);
      }
    };

    timerId = setTimeout(tick, interval);
    return () => clearTimeout(timerId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texts, interval, pauseDuration]);

  return (
    <span className={className} style={style} aria-live="polite">
      {state.displayedText}
      <span
        aria-hidden="true"
        style={{
          display: 'inline-block',
          marginLeft: '2px',
          animation: 'typewriter-blink 1s step-end infinite',
        }}
      >
        |
      </span>
      <style>{`
        @keyframes typewriter-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </span>
  );
}
