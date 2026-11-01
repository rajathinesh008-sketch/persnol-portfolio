import { SiC, SiPython, SiHtml5, SiCss, SiJavascript, SiReact, SiGit } from 'react-icons/si'

/**
 * Self-assessed skill levels.
 * These are intentionally honest: nothing here is marked as "expert".
 * 0–59  = Learning
 * 60–79 = Comfortable
 * 80+   = Confident
 */
export const SKILLS = [
  {
    id: 'c',
    name: 'C Programming',
    category: 'Programming',
    level: 55,
    label: 'Learning',
    description: 'College coursework, basic syntax, loops, functions and problem solving.',
    icon: SiC,
    color: '#7aa2f7',
  },
  {
    id: 'python',
    name: 'Python',
    category: 'Programming',
    level: 52,
    label: 'Learning',
    description: 'Fundamentals, small scripts and practising logic with beginner exercises.',
    icon: SiPython,
    color: '#ffd43b',
  },
  {
    id: 'html',
    name: 'HTML',
    category: 'Frontend',
    level: 75,
    label: 'Comfortable',
    description: 'Semantic structure, accessible forms and clean page layouts.',
    icon: SiHtml5,
    color: '#e34f26',
  },
  {
    id: 'css',
    name: 'CSS',
    category: 'Frontend',
    level: 68,
    label: 'Comfortable',
    description: 'Responsive layouts with Flexbox, Grid, transitions and modern styling.',
    icon: SiCss,
    color: '#1572b6',
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    category: 'Frontend',
    level: 55,
    label: 'Learning',
    description: 'ES6 basics, DOM events, array methods and small interactive features.',
    icon: SiJavascript,
    color: '#f7df1e',
  },
  {
    id: 'react',
    name: 'React.js',
    category: 'Frontend',
    level: 45,
    label: 'Learning',
    description: 'Components, props, state, hooks and building small React interfaces.',
    icon: SiReact,
    color: '#61dafb',
  },
  {
    id: 'git',
    name: 'Git & GitHub',
    category: 'Tools',
    level: 50,
    label: 'Learning',
    description: 'Commits, branches, remotes and publishing projects to GitHub.',
    icon: SiGit,
    color: '#f05032',
  },
]

export const SKILL_NOTE =
  'These levels are my honest self-assessment, not certifications or professional ratings. I am actively learning and improving every week.'
