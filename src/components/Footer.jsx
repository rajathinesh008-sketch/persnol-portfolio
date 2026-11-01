import { FiArrowUp, FiGithub, FiLinkedin, FiMail, FiSettings } from 'react-icons/fi'
import { usePortfolio } from '../context/PortfolioContext'
import { safeLink } from '../utils/helpers'

const EXPLORE_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#education', label: 'Education' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#resume', label: 'Resume' },
  { href: '#contact', label: 'Contact' },
]

export default function Footer() {
  const { profile } = usePortfolio()
  const year = new Date().getFullYear()

  const socials = [
    { label: 'GitHub', href: safeLink(profile.github), icon: FiGithub },
    { label: 'LinkedIn', href: safeLink(profile.linkedin), icon: FiLinkedin },
  ].filter((item) => item.href)

  const emailLink = profile.email ? `mailto:${profile.email}` : ''

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a className="brand" href="#home" aria-label="Back to home">
              <span className="brand-mark" aria-hidden="true">
                {profile.initials || 'DV'}
              </span>
              <span className="brand-text">
                <span className="brand-name">{profile.name}</span>
                <span className="brand-role">Aspiring Software Developer</span>
              </span>
            </a>
            <p>
              Learning computer science, building for the web and exploring artificial intelligence
              — from Pudukkottai, Tamil Nadu.
            </p>
            <div className="footer-socials">
              {emailLink ? (
                <a href={emailLink} className="social-link" aria-label="Email" title="Email">
                  <FiMail aria-hidden="true" />
                </a>
              ) : null}
              {socials.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  className="social-link"
                  aria-label={label}
                  title={label}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <Icon aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <h4>Explore</h4>
            <ul>
              {EXPLORE_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4>Built with</h4>
            <div className="footer-tags">
              <span>React.js</span>
              <span>Vite</span>
              <span>JavaScript</span>
              <span>CSS3</span>
              <span>LocalStorage</span>
            </div>
            <a className="footer-admin" href="#/admin">
              <FiSettings aria-hidden="true" /> Admin dashboard
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {year} {profile.name} · Built with care in Pudukkottai, Tamil Nadu.
          </p>
          <a className="footer-top" href="#home">
            Back to top <FiArrowUp aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  )
}
