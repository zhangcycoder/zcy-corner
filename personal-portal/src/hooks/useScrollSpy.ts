import { useState, useEffect } from 'react';

interface ScrollSpyResult {
  activeSectionId: string | null;
  isScrolled: boolean;
}

export function useScrollSpy(sectionIds: string[]): ScrollSpyResult {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 80);

      // Find the active section by checking which one is currently in view
      let currentId: string | null = null;
      for (const id of sectionIds) {
        const element = document.getElementById(id);
        if (!element) continue;
        const rect = element.getBoundingClientRect();
        // Section is considered active when its top is at or above the middle of the viewport
        if (rect.top <= window.innerHeight / 2) {
          currentId = id;
        }
      }

      setActiveSectionId(currentId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on mount to set initial state
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sectionIds]);

  return { activeSectionId, isScrolled };
}
