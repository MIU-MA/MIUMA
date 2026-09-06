export interface WorkText {
  zh: string
  en: string
}

interface WorkPoint {
  id: string
  position: readonly [number, number, number]
}

export type WorkNode = WorkPoint & (
  | {
    status: 'published'
    title: WorkText
    summary: WorkText
    category: string
    stack: readonly string[]
    href?: string
    source?: string
  }
  | { status: 'placeholder' }
)

export const workNodes: readonly WorkNode[] = [
  {
    id: 'miuma-blog',
    status: 'published',
    position: [-4.2, 0.8, 3],
    title: { zh: '依旧碎碎念', en: 'MIUMA Blog' },
    summary: {
      zh: '记录技术笔记、日常和折腾过程的个人博客。用 Nuxt 搭了一个属于自己的小角落，还在慢慢完善中。',
      en: 'A personal space for technical notes, everyday thoughts, and experiments. Built with Nuxt and still growing.',
    },
    category: 'WEBSITE',
    stack: ['Nuxt 4', 'Vue', 'TypeScript'],
    href: '/',
    source: 'https://github.com/MIU-MA/MIUMA',
  },
  { id: 'reserved-02', status: 'placeholder', position: [-6, 3, -1.6] },
  { id: 'reserved-03', status: 'placeholder', position: [-1.6, 3.9, 2.5] },
  {
    id: 'jxufe-tech-web',
    status: 'published',
    position: [3.7, 2.7, -3.4],
    title: { zh: '数智技术协会', en: 'JXUFE Tech' },
    summary: {
      zh: '江西财经大学数智技术协会网站，面向新生展示协会与相关内容。采用 Vue 3 前端与 NestJS 无头 CMS 后端，提供内容管理和 API。',
      en: 'The website of JXUFE’s Digital Intelligence Technology Association, introducing the association to new students. A Vue 3 frontend is paired with a NestJS headless CMS for content management and APIs.',
    },
    category: 'WEBSITE',
    stack: ['Vue 3', 'Vite', 'NestJS', 'TypeScript'],
    href: 'https://www.jxufe-tech.top',
    source: 'https://github.com/jxufe-tech/jxufe-tech-web',
  },
  { id: 'reserved-05', status: 'placeholder', position: [6.2, 0.4, 1.5] },
  { id: 'reserved-06', status: 'placeholder', position: [2.4, -0.8, 4.5] },
  { id: 'reserved-07', status: 'placeholder', position: [-2.6, -3.5, -2] },
  {
    id: 'resume-grill',
    status: 'published',
    position: [1.8, -4.1, 1],
    title: { zh: 'Resume Grill', en: 'Resume Grill' },
    summary: {
      zh: '把简历里的项目、技能和成果转化为多轮追问，检查能力边界、发现知识漏洞，并生成报告与简历表达建议。支持本地导入和解析简历。',
      en: 'Turn projects, skills, and achievements on a resume into follow-up questions that reveal knowledge gaps and test understanding. Includes local resume parsing, assessment reports, and suggestions for clearer resume wording.',
    },
    category: 'TOOL',
    stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    source: 'https://github.com/MIU-MA/resume-grill',
  },
  { id: 'reserved-09', status: 'placeholder', position: [3.7, -2.7, -4.2] },
  { id: 'reserved-10', status: 'placeholder', position: [-5.6, -2.4, 1.2] },
  { id: 'reserved-11', status: 'placeholder', position: [-3.2, 0.2, -5.4] },
  { id: 'reserved-12', status: 'placeholder', position: [0.3, 4.8, -1.8] },
  { id: 'reserved-13', status: 'placeholder', position: [0.2, 1.5, 5.3] },
  { id: 'reserved-14', status: 'placeholder', position: [5.1, -3.2, 2.3] },
  { id: 'reserved-15', status: 'placeholder', position: [-0.8, -4.8, 3.6] },
]
