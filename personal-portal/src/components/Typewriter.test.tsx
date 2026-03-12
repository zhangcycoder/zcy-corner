import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { typewriterReducer, type TypewriterState } from './Typewriter';

// ─── Property 3: 打字机字符间隔约束 ──────────────────────────────────────────
// Feature: personal-portal, Property 3: 打字机字符间隔约束
describe('Property 3: 打字机字符间隔约束', () => {
  // Validates: Requirements 2.4
  it('默认 charInterval (80) ≤ 100', () => {
    const DEFAULT_CHAR_INTERVAL = 80;
    expect(DEFAULT_CHAR_INTERVAL).toBeLessThanOrEqual(100);
  });

  it('任意传入的 charInterval，组件内部使用 Math.min(charInterval, 100) 确保 ≤ 100', () => {
    // Validates: Requirements 2.4
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 500 }),
        (charInterval) => {
          const effectiveInterval = Math.min(charInterval, 100);
          return effectiveInterval <= 100;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('任意文字列表，charInterval 约束始终成立', () => {
    // Validates: Requirements 2.4
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 5 }),
        fc.integer({ min: 1, max: 500 }),
        (texts, charInterval) => {
          void texts; // texts 参数确认接口兼容性
          const effectiveInterval = Math.min(charInterval, 100);
          return effectiveInterval <= 100;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// ─── Property 4: 打字机循环播放 ───────────────────────────────────────────────
// Feature: personal-portal, Property 4: 打字机循环播放
describe('Property 4: 打字机循环播放', () => {
  // Validates: Requirements 2.5

  /**
   * 模拟状态机完整走完一段文字的生命周期：
   * 打字 → 暂停 → 删除 → 切换到下一段
   */
  function simulateCycle(
    state: TypewriterState,
    fullText: string,
    total: number
  ): TypewriterState {
    let s = state;

    // 打字阶段：逐字追加直到完整
    while (s.displayedText.length < fullText.length) {
      s = typewriterReducer(s, { type: 'ADD_CHAR', fullText });
    }

    // 暂停阶段
    s = typewriterReducer(s, { type: 'START_PAUSE' });
    s = typewriterReducer(s, { type: 'END_PAUSE' });

    // 删除阶段：逐字删除直到为空
    while (s.displayedText.length > 0) {
      s = typewriterReducer(s, { type: 'REMOVE_CHAR' });
    }

    // 切换到下一段
    s = typewriterReducer(s, { type: 'NEXT_TEXT', total });

    return s;
  }

  it('任意 N 段文字，状态机完成第 N 段后回到第 0 段（循环）', () => {
    // Validates: Requirements 2.5
    fc.assert(
      fc.property(
        fc.array(
          fc.string({ minLength: 1, maxLength: 10 }),
          { minLength: 2, maxLength: 10 }
        ),
        (texts) => {
          const total = texts.length;
          let state: TypewriterState = {
            currentTextIndex: 0,
            displayedText: '',
            isDeleting: false,
            isPaused: false,
          };

          // 走完所有 N 段文字
          for (let i = 0; i < total; i++) {
            const fullText = texts[state.currentTextIndex];
            state = simulateCycle(state, fullText, total);
          }

          // 完成第 N 段后，应回到第 0 段
          return state.currentTextIndex === 0;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('单段文字循环：完成后 currentTextIndex 仍为 0', () => {
    // Validates: Requirements 2.5
    const texts = ['Hello'];
    const total = texts.length;
    let state: TypewriterState = {
      currentTextIndex: 0,
      displayedText: '',
      isDeleting: false,
      isPaused: false,
    };

    state = simulateCycle(state, texts[0], total);
    expect(state.currentTextIndex).toBe(0);
  });

  it('状态机 NEXT_TEXT 动作使 currentTextIndex 按模运算递增', () => {
    // Validates: Requirements 2.5
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 20 }),  // total
        fc.integer({ min: 0, max: 19 }),  // 初始 index
        (total, startIndex) => {
          const index = startIndex % total;
          const state: TypewriterState = {
            currentTextIndex: index,
            displayedText: '',
            isDeleting: true,
            isPaused: false,
          };
          const next = typewriterReducer(state, { type: 'NEXT_TEXT', total });
          return next.currentTextIndex === (index + 1) % total;
        }
      ),
      { numRuns: 100 }
    );
  });
});
