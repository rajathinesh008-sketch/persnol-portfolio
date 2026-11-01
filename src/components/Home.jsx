import {
  FiArrowDown,
  FiBookOpen,
  FiCode,
  FiCpu,
  FiDownload,
  FiGithub,
  FiGlobe,
  FiLinkedin,
  FiMail,
  FiMapPin,
  FiTarget,
} from 'react-icons/fi'
import { usePortfolio } from '../context/PortfolioContext'
import { useToast } from '../context/ToastContext'
import { useTypewriter } from '../hooks/useTypewriter'
import { useResumeStatus } from '../hooks/useResumeStatus'
import { safeLink } from '../utils/helpers'
import ProfileImage from './ui/ProfileImage'
import Reveal from './ui/Reveal'

export default function Home() {
  const { profile, projects } = usePortfolio()
  const { addToast } = useToast()
  const typed = useTypewriter(profile.roles)
  const resumeUrl = profile.resumeUrl || '/resume.pdf'
  const resumeStatus = useResumeStatus(resumeUrl)

  const socials = [
    { label: 'GitHub', href: safeLink(profile.github), icon: FiGithub },
    { label: 'LinkedIn', href: safeLink(profile.linkedin), icon: FiLinkedin },
    { label: profile.email ? `Email ${profile.email}` : 'Email', href: safeLink(profile.email ? `mailto:${profile.email}` : ''), icon: FiMail },
  ].filter((item) => item.href)

  function handleResumeDownload(event) {
    if (resumeStatus === 'available') return
    event.preventDefault()
    addToast(
      resumeStatus === 'available'
        ? 'Opening your resume…'
        : 'Resume not uploaded yet. Add your PDF as public/resume.pdf, then refresh.',
      'warning',
      6000,
    )
  }

  return (
    <section className="hero" id="home">
      <div className="container hero-grid">
        <Reveal className="hero-copy">
          <span className="eyebrow">
            <span className="pulse-dot" aria-hidden="true" />
            Hello, I&apos;m
          </span>

          <h1 className="hero-title">
            Dineshraja <span className="gradient-text">V.</span>
          </h1>

          <p className="hero-role">
            <span className="sr-only">Roles: {profile.roles.join(', ')}</span>
            <span className="typed-text" aria-hidden="true">
              {typed}
            </span>
            <span className="cursor" aria-hidden="true" />
          </p>

          <p className="hero-desc">{profile.intro}</p>

          <div className="hero-actions">
            <a
              className="btn btn--primary"
              href={resumeUrl}
              download="Dineshraja-V-Resume.pdf"
              onClick={handleResumeDownload}
            >
              <FiDownload aria-hidden="true" />
              Download Resume
            </a>
            <a className="btn btn--ghost" href="#contact">
              <FiMail aria-hidden="true" />
              Contact Me
            </a>
          </div>

          <ul className="hero-meta">
            <li className="meta-item">
              <FiMapPin aria-hidden="true" />
              {profile.location}
            </li>
            <li className="meta-item">
              <FiBookOpen aria-hidden="true" />
              {profile.degree}
            </li>
          </ul>

          {socials.length ? (
            <div className="hero-socials" aria-label="Social profiles">
              <span className="socials-label">Find me</span>
              {socials.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  className="social-link"
                  href={href}
                  target={href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={href.startsWith('mailto:') ? undefined : 'noreferrer noopener'}
                  aria-label={label}
                  title={label}
                >
                  <Icon aria-hidden="true" />
                </a>
              ))}
            </div>
          ) : null}
        </Reveal>

        <Reveal className="hero-visual" delay={140}>
          <div className="portrait-stage">
            <span className="portrait-glow" aria-hidden="true" />
            <span className="portrait-ring ring-one" aria-hidden="true" />
            <span className="portrait-ring ring-two" aria-hidden="true" />

            <div className="portrait-card">
              <ProfileImage
                src={profile.photo}
                alt={`Portrait of ${profile.name}`}
                initials={profile.initials}
                className="portrait-img"
                loading="eager"
              />
              <div className="portrait-caption">
                <span className="status-dot" aria-hidden="true" />
                <span>{profile.availability}</span>
              </div>
            </div>

            <span className="floating-chip chip-one">
              <FiCode aria-hidden="true" /> Web Developer
            </span>
            <span className="floating-chip chip-two">
              <FiCpu aria-hidden="true" /> AI Enthusiast
            </span>
            <span className="floating-chip chip-three">
              <FiTarget aria-hidden="true" /> Problem Solver
            </span>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <strong>1st</strong>
              <span>Year B.E. CSE</span>
            </div>
            <div className="stat">
              <strong>03</strong>
              <span>Programming languages</span>
            </div>
            <div className="stat">
              <strong>{String(projects.length).padStart(2, '0')}</strong>
              <span>Projects published</span>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="scroll-hint">
        <a href="#about" aria-label="Scroll to the About section">
          <FiArrowDown aria-hidden="true" />
          <span>Scroll to explore</span>
        </a>
      </div>

      <span className="hero-orbit orbit-one" aria-hidden="true" />
      <span className="hero-orbit orbit-two" aria-hidden="true" />
      <span className="hero-code-icon" aria-hidden="true">
        <FiGlobe />
      </span>
    </section>
  )
}
