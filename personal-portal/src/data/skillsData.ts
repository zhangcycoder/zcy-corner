import type { Skill } from '../types';

export const skillsData: Skill[] = [
  // Frontend
  {
    id: 'react',
    name: 'React',
    category: 'Frontend',
    proficiency: 92,
    icon: '⚛️',
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'Frontend',
    proficiency: 88,
    icon: '🔷',
  },
  {
    id: 'css-animations',
    name: 'CSS / Animations',
    category: 'Frontend',
    proficiency: 85,
    icon: '🎨',
  },
  {
    id: 'canvas-api',
    name: 'Canvas API',
    category: 'Frontend',
    proficiency: 75,
    icon: '🖼️',
  },
  // Backend
  {
    id: 'nodejs',
    name: 'Node.js',
    category: 'Backend',
    proficiency: 82,
    icon: '🟢',
  },
  {
    id: 'python',
    name: 'Python',
    category: 'Backend',
    proficiency: 80,
    icon: '🐍',
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    category: 'Backend',
    proficiency: 70,
    icon: '🐘',
  },
  // DevOps
  {
    id: 'docker',
    name: 'Docker',
    category: 'DevOps',
    proficiency: 78,
    icon: '🐳',
  },
  {
    id: 'github-actions',
    name: 'GitHub Actions',
    category: 'DevOps',
    proficiency: 72,
    icon: '⚙️',
  },
  {
    id: 'linux',
    name: 'Linux',
    category: 'DevOps',
    icon: '🐧',
  },
];
