export interface Project {
  id: string;               // URL slug，如 "my-project"
  name: string;
  description: string;      // 列表页简短描述，≤120 字
  tags: string[];           // 技术标签
  thumbnail?: string;       // 列表页缩略图路径
  techStack: string[];      // 详情页技术栈列表
  fullDescription?: string; // 详情页完整描述
  demoUrl?: string;         // 演示链接
  screenshots?: string[];   // 截图路径列表
}

export interface Skill {
  id: string;
  name: string;
  category: string;         // 如 "Frontend"、"Backend"、"DevOps"
  proficiency?: number;     // 0–100
  icon?: string;            // 图标路径或 emoji
}

export interface NavItem {
  label: string;
  sectionId: string;        // 对应 section 的 DOM id
}

export interface Particle {
  x: number;
  y: number;
  vx: number;               // x 方向速度
  vy: number;               // y 方向速度
  radius: number;
  opacity: number;
  color: string;
}
