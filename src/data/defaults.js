/**
 * Default profile content.
 *
 * Only facts provided by Dineshraja are stored here.
 * Contact links are intentionally empty until he adds his real URLs from
 * the Admin Dashboard. Never fill them with placeholder links.
 */
export const DEFAULT_PROFILE = {
  name: 'Dineshraja V.',
  initials: 'DV',
  headline: 'Computer Science Student & Aspiring Software Developer',
  roles: [
    'Computer Science Student',
    'Aspiring Software Developer',
    'AI Enthusiast',
    'Web Developer',
  ],
  intro:
    "I'm a first-year B.E. Computer Science and Engineering student from Pudukkottai, Tamil Nadu. I enjoy turning ideas into clean, useful web experiences and I'm building a strong foundation in programming, AI and software development — one project at a time.",
  bio:
    'I am currently learning the fundamentals of computer science while practising web development with HTML, CSS, JavaScript and React.js. I believe in learning by building, writing clean code and improving a little every day.',
  location: 'Pudukkottai, Tamil Nadu, India',
  degree: 'B.E. Computer Science and Engineering',
  year: '1st Year',
  college: 'P.A. College of Engineering and Technology',
  school: 'Government Boys Higher Secondary School, Pudukkottai',
  careerGoal: 'Software Developer',
  interests: ['Artificial Intelligence', 'Web Development', 'Software Development', 'Problem Solving'],
  shortTermGoal:
    'Strengthen my fundamentals in C, Python and JavaScript, build real projects and earn a good internship where I can learn from experienced developers.',
  longTermGoal:
    'Become a skilled software developer who builds reliable and useful products, with a focus on AI-powered and web-based solutions.',
  availability: 'Open to internships & learning opportunities',
  email: '',
  linkedin: '',
  github: '',
  photo: '/profile.jpg',
  resumeUrl: '/resume.pdf',
}

export const EMPTY_COLLECTIONS = {
  projects: [],
  certificates: [],
  experience: [],
}

export const STORAGE_KEYS = {
  profile: 'dv.portfolio.profile.v1',
  projects: 'dv.portfolio.projects.v1',
  certificates: 'dv.portfolio.certificates.v1',
  experience: 'dv.portfolio.experience.v1',
}

export const EXPERIENCE_TYPES = [
  'Internship',
  'Workshop',
  'Hackathon',
  'Technical Event',
  'Course',
  'Volunteering',
  'Other',
]

export const ADMIN_TABS = [
  'overview',
  'projects',
  'certificates',
  'experience',
  'profile',
  'data',
]
