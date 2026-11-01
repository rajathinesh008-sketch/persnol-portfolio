import { useEffect, useState } from 'react'
import {
  FiMenu,
  FiMoon,
  FiSettings,
  FiSun,
  FiX,
} from 'react-icons/fi'
import { usePortfolio } from '../context/PortfolioContext'
import { useTheme } from '../context/ThemeContext'
import { useLockBodyScroll } from '../hooks/useLockBodyScroll'

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'certifications', label: 'Certificates' },
  { id: 'experience', label: 'Experience' },
  { id: 'resume', label: 'Resume' },
  { id: 'contact', label: 'Contact' },
]

export default function Navbar() {
  const { profile } = usePortfolio()
  const { theme, toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('home')

  useLockBodyScroll(menuOpen)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24)
      const marker = window.innerHeight * 0.32
      let current = 'home'
      NAV_ITEMS.forEach(({ id }) => {
        const node = document.getElementById(id)
        if (node && node.getBoundingClientRect().top <= marker) current = id
      })
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    function onResize() {
      if (window.innerWidth > 1080) setMenuOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="container nav-inner">
          <a className="brand" href="#home" onClick={closeMenu} aria-label="Dineshraja V. — back to home">
            <span className="brand-mark" aria-hidden="true">
              {profile.initials || 'DV'}
            </span>
            <span className="brand-text">
              <span className="brand-name">{profile.name}</span>
              <span className="brand-role">CSE Student</span>
            </span>
          </a>

          <nav className="nav-links" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`nav-link ${active === item.id ? 'is-active' : ''}`}
                aria-current={active === item.id ? 'page' : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="nav-actions">
            <button
              type="button"
              className="icon-btn"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? <FiSun /> : <FiMoon />}
            </button>
            <a className="btn btn--soft btn--sm nav-admin" href="#/admin">
              <FiSettings aria-hidden="true" />
              <span>Dashboard</span>
            </a>
            <button
              type="button"
              className="icon-btn nav-toggle"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
            >
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        <div className={`nav-drawer ${menuOpen ? 'is-open' : ''}`} id="mobile-navigation">
          <nav className="drawer-links" aria-label="Mobile navigation">
            {NAV_ITEMS.map((item, index) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`drawer-link ${active === item.id ? 'is-active' : ''}`}
                onClick={closeMenu}
                style={{ '--item-index': index }}
              >
                <span>{item.label}</span>
                <span className="drawer-index">{String(index + 1).padStart(2, '0')}</span>
              </a>
            ))}
          </nav>
          <div className="drawer-actions">
            <a className="btn btn--ghost" href="#/admin" onClick={closeMenu}>
              <FiSettings aria-hidden="true" /> Open dashboard
            </a>
            <button type="button" className="btn btn--ghost" onClick={toggleTheme}>
              {theme === 'dark' ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
              {theme === 'dark' ? 'Light mode' : 'Dark mode'}
            </button>
          </div>
        </div>
      </header>

      <button
        type="button"
        className={`nav-backdrop ${menuOpen ? 'is-open' : ''}`}
        aria-label="Close navigation menu"
        tabIndex={menuOpen ? 0 : -1}
        onClick={closeMenu}
      />
    </>
  )
}
