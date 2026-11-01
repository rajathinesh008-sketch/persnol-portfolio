import {
  FiAlertTriangle,
  FiCheckCircle,
  FiDownload,
  FiEye,
  FiFileText,
  FiLoader,
} from 'react-icons/fi'
import { usePortfolio } from '../context/PortfolioContext'
import { useToast } from '../context/ToastContext'
import { useResumeStatus } from '../hooks/useResumeStatus'
import Reveal from './ui/Reveal'
import SectionHeader from './ui/SectionHeader'

export default function Resume() {
  const { profile, projects, certificates } = usePortfolio()
  const { addToast } = useToast()
  const resumeUrl = profile.resumeUrl || '/resume.pdf'
  const status = useResumeStatus(resumeUrl)

  function openResume() {
    if (status === 'available') {
      window.open(resumeUrl, '_blank', 'noopener,noreferrer')
      return
    }
    addToast(
      status === 'checking'
        ? 'Still checking for your resume file. Please try again in a moment.'
        : 'Resume is missing. Put your PDF at public/resume.pdf, then refresh the page.',
      'warning',
      6000,
    )
  }

  function downloadResume(event) {
    if (status === 'available') return
    event.preventDefault()
    addToast(
      status === 'checking'
        ? 'Still checking for your resume file. Please try again in a moment.'
        : 'Resume is missing. Put your PDF at public/resume.pdf, then refresh the page.',
      'warning',
      6000,
    )
  }

  const skillList = ['C', 'Python', 'HTML', 'CSS', 'JavaScript', 'React.js', 'Git & GitHub']
  const statusCopy = {
    checking: {
      icon: FiLoader,
      title: 'Checking for resume.pdf…',
      text: 'Looking for the file in the public folder.',
    },
    available: {
      icon: FiCheckCircle,
      title: 'Resume is ready',
      text: 'The file is available at /resume.pdf and linked below.',
    },
    missing: {
      icon: FiAlertTriangle,
      title: 'Resume not uploaded yet',
      text: 'Add your PDF to the public folder to activate the buttons.',
    },
  }[status]
  const StatusIcon = statusCopy.icon

  return (
    <section className="section" id="resume">
      <div className="container">
        <Reveal>
          <SectionHeader
            eyebrow="Resume"
            title="My resume, in one PDF."
            description="View it in the browser or download a copy for your records."
            action={
              <span className={`resume-pill resume-pill--${status}`}>
                <span className="status-dot" aria-hidden="true" />
                {status === 'available' ? 'Available' : status === 'checking' ? 'Checking…' : 'Not uploaded'}
              </span>
            }
          />
        </Reveal>

        <div className="resume-grid">
          <Reveal className="resume-preview" delay={60}>
            <div className="resume-paper" aria-label="Resume document preview">
              <div className="paper-top">
                <span className="paper-badge">
                  <FiFileText aria-hidden="true" /> PDF
                </span>
                <span className="paper-file">resume.pdf</span>
              </div>

              <h3 className="paper-name">{profile.name}</h3>
              <p className="paper-role">{profile.headline}</p>
              <p className="paper-contact">
                {[profile.location, profile.email].filter(Boolean).join(' · ') ||
                  'Contact details are available in the Contact section.'}
              </p>

              <div className="paper-rule" />

              <div className="paper-section">
                <h4>Profile</h4>
                <p>
                  First-year Computer Science and Engineering student at {profile.college}, focused
                  on programming, web development and problem solving.
                </p>
              </div>

              <div className="paper-section">
                <h4>Education</h4>
                <p>
                  <strong>{profile.degree}</strong> — {profile.college} ({profile.year})
                </p>
                <p>{profile.school}</p>
              </div>

              <div className="paper-section">
                <h4>Technical skills</h4>
                <div className="paper-skills">
                  {skillList.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </div>

              <div className="paper-section">
                <h4>Projects & certifications</h4>
                <p>
                  {projects.length
                    ? `${projects.length} project${projects.length === 1 ? '' : 's'} published in the Projects section.`
                    : 'Projects will be listed here as they are completed.'}{' '}
                  {certificates.length
                    ? `${certificates.length} certificate${certificates.length === 1 ? '' : 's'} listed.`
                    : ''}
                </p>
              </div>

              <div className="paper-fade" aria-hidden="true" />
            </div>
          </Reveal>

          <Reveal className="resume-panel" delay={130}>
            <span className="section-eyebrow">
              <span className="eyebrow-dot" aria-hidden="true" />
              Latest version
            </span>
            <h3>A clear summary of what I know and what I&apos;m learning.</h3>
            <p>
              My resume is a single PDF file kept in the project&apos;s public folder. It is always
              linked directly from this page — no placeholder documents.
            </p>

            <div className={`resume-status resume-status--${status}`} role="status">
              <StatusIcon
                className={`resume-status-icon ${status === 'checking' ? 'is-spinning' : ''}`}
                aria-hidden="true"
              />
              <div>
                <strong>{statusCopy.title}</strong>
                <p>{statusCopy.text}</p>
              </div>
            </div>

            {status === 'missing' ? (
              <div className="resume-help">
                <h4>How to add your resume</h4>
                <ol className="resume-steps">
                  <li>
                    Export your resume as a PDF and name the file exactly{' '}
                    <code>resume.pdf</code>.
                  </li>
                  <li>
                    Place it inside the <code>public</code> folder:{' '}
                    <code>public/resume.pdf</code>.
                  </li>
                  <li>Refresh this page (or run <code>npm run dev</code> again).</li>
                </ol>
                <p className="resume-help-note">
                  The folder path is case-sensitive on some hosts — keep the filename lowercase.
                </p>
              </div>
            ) : null}

            <div className="resume-actions">
              <button type="button" className="btn btn--primary" onClick={openResume}>
                <FiEye aria-hidden="true" /> View Resume
              </button>
              <a
                className="btn btn--ghost"
                href={resumeUrl}
                download="Dineshraja-V-Resume.pdf"
                onClick={downloadResume}
              >
                <FiDownload aria-hidden="true" /> Download Resume
              </a>
            </div>

            <p className="resume-footnote">
              File location: <code>{resumeUrl}</code>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
