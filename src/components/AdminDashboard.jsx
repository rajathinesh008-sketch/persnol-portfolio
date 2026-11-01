import { useMemo, useState } from 'react'
import {
  FiAlertTriangle,
  FiArrowLeft,
  FiAward,
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiDatabase,
  FiDownload,
  FiEdit2,
  FiExternalLink,
  FiFileText,
  FiFolder,
  FiGrid,
  FiInfo,
  FiMail,
  FiMoon,
  FiPlus,
  FiRefreshCw,
  FiSettings,
  FiSun,
  FiTrash2,
  FiUpload,
  FiUser,
} from 'react-icons/fi'
import { usePortfolio } from '../context/PortfolioContext'
import { useTheme } from '../context/ThemeContext'
import { useToast } from '../context/ToastContext'
import {
  downloadJson,
  formatMonth,
  formatRange,
  isSafeLink,
  safeLink,
} from '../utils/helpers'
import CertificateForm from './forms/CertificateForm'
import ExperienceForm from './forms/ExperienceForm'
import ProfileForm from './forms/ProfileForm'
import ProjectForm from './forms/ProjectForm'
import ConfirmDialog from './ui/ConfirmDialog'
import Modal from './ui/Modal'

const TABS = [
  { id: 'overview', label: 'Overview', icon: FiGrid },
  { id: 'projects', label: 'Projects', icon: FiFolder },
  { id: 'certificates', label: 'Certificates', icon: FiAward },
  { id: 'experience', label: 'Experience', icon: FiBriefcase },
  { id: 'profile', label: 'Profile', icon: FiUser },
  { id: 'data', label: 'Data & backup', icon: FiDatabase },
]

const TAB_COPY = {
  overview: {
    eyebrow: 'Admin dashboard',
    title: 'Welcome back, Dineshraja.',
    description: 'Manage the content of your portfolio. Everything here is stored in this browser.',
  },
  projects: {
    eyebrow: 'Manage content',
    title: 'Projects',
    description: 'Add real work, update details and remove projects you no longer want to show.',
  },
  certificates: {
    eyebrow: 'Manage content',
    title: 'Certificates',
    description: 'Only list certificates and achievements you have actually earned.',
  },
  experience: {
    eyebrow: 'Manage content',
    title: 'Experience',
    description: 'Keep a timeline of internships, workshops, hackathons and technical events.',
  },
  profile: {
    eyebrow: 'Manage content',
    title: 'Profile details',
    description: 'Update the information shown across the home, about, resume and contact sections.',
  },
  data: {
    eyebrow: 'Local data',
    title: 'Data & backup',
    description: 'Export a copy of your content or restore it in another browser.',
  },
}

function formatBytes(bytes) {
  if (!bytes) return '0 KB'
  if (bytes < 1024) return `${bytes} B`
  return `${(bytes / 1024).toFixed(1)} KB`
}

function ProjectThumb({ project }) {
  const [failed, setFailed] = useState(false)
  const src = isSafeLink(project.image) ? project.image : ''

  if (src && !failed) {
    return (
      <div className="admin-thumb">
        <img src={src} alt="" onError={() => setFailed(true)} />
      </div>
    )
  }

  return (
    <div className="admin-thumb admin-thumb--empty" aria-hidden="true">
      <FiFolder />
    </div>
  )
}

function EmptyAdmin({ icon: Icon, title, text, action }) {
  return (
    <div className="admin-empty">
      <span className="admin-empty-icon" aria-hidden="true">
        <Icon />
      </span>
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  )
}

export default function AdminDashboard({ tab = 'overview' }) {
  const {
    profile,
    projects,
    certificates,
    experience,
    updateProfile,
    addProject,
    updateProject,
    deleteProject,
    addCertificate,
    updateCertificate,
    deleteCertificate,
    addExperience,
    updateExperience,
    deleteExperience,
    exportData,
    importData,
    resetAll,
  } = usePortfolio()
  const { theme, toggleTheme } = useTheme()
  const { addToast } = useToast()

  const [projectModal, setProjectModal] = useState(null)
  const [certificateModal, setCertificateModal] = useState(null)
  const [experienceModal, setExperienceModal] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [resetOpen, setResetOpen] = useState(false)

  const activeTab = TABS.some((item) => item.id === tab) ? tab : 'overview'
  const copy = TAB_COPY[activeTab]

  const storageSize = useMemo(() => {
    try {
      return new Blob([JSON.stringify(exportData())]).size
    } catch {
      return 0
    }
  }, [exportData])

  const counts = {
    projects: projects.length,
    certificates: certificates.length,
    experience: experience.length,
  }

  function goToTab(nextTab) {
    window.location.hash = nextTab === 'overview' ? '#/admin' : `#/admin/${nextTab}`
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleProjectSubmit(data) {
    if (projectModal?.mode === 'edit' && projectModal.item) {
      updateProject(projectModal.item.id, data)
      addToast('Project updated.', 'success')
    } else {
      addProject(data)
      addToast('Project added. It is now visible on the website.', 'success')
    }
    setProjectModal(null)
  }

  function handleCertificateSubmit(data) {
    if (certificateModal?.mode === 'edit' && certificateModal.item) {
      updateCertificate(certificateModal.item.id, data)
      addToast('Certificate updated.', 'success')
    } else {
      addCertificate(data)
      addToast('Certificate added.', 'success')
    }
    setCertificateModal(null)
  }

  function handleExperienceSubmit(data) {
    if (experienceModal?.mode === 'edit' && experienceModal.item) {
      updateExperience(experienceModal.item.id, data)
      addToast('Experience updated.', 'success')
    } else {
      addExperience(data)
      addToast('Experience added.', 'success')
    }
    setExperienceModal(null)
  }

  function handleConfirmDelete() {
    if (!deleteTarget) return
    const { type, item } = deleteTarget
    if (type === 'project') {
      deleteProject(item.id)
      addToast('Project deleted.', 'success')
    }
    if (type === 'certificate') {
      deleteCertificate(item.id)
      addToast('Certificate deleted.', 'success')
    }
    if (type === 'experience') {
      deleteExperience(item.id)
      addToast('Experience deleted.', 'success')
    }
    setDeleteTarget(null)
  }

  function handleExport() {
    const date = new Date().toISOString().slice(0, 10)
    downloadJson(exportData(), `dineshraja-portfolio-backup-${date}.json`)
    addToast('Backup downloaded.', 'success')
  }

  async function handleImport(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (file.size > 3 * 1024 * 1024) {
      addToast('That backup is too large (limit 3 MB).', 'error')
      return
    }
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      importData(data)
      addToast('Backup restored successfully.', 'success')
    } catch (error) {
      addToast(error?.message || 'Could not import that file. Choose a valid JSON backup.', 'error')
    }
  }

  function handleReset() {
    resetAll()
    setResetOpen(false)
    addToast('All portfolio content has been reset to the defaults.', 'success')
  }

  function handleProfileSave(data) {
    updateProfile(data)
    addToast('Profile updated across the website.', 'success')
  }

  const deleteCopy = deleteTarget
    ? {
        project: {
          title: 'Delete project?',
          message: `“${deleteTarget.item.title}” will be removed from your projects list.`,
        },
        certificate: {
          title: 'Delete certificate?',
          message: `“${deleteTarget.item.title}” will be removed from your certificates.`,
        },
        experience: {
          title: 'Delete experience?',
          message: `“${deleteTarget.item.role}” at ${deleteTarget.item.organization} will be removed from your timeline.`,
        },
      }[deleteTarget.type]
    : null

  return (
    <div className="admin" id="admin">
      <header className="admin-header">
        <div className="container admin-header-inner">
          <a className="brand" href="#home" aria-label="Back to portfolio home">
            <span className="brand-mark" aria-hidden="true">
              {profile.initials || 'DV'}
            </span>
            <span className="brand-text">
              <span className="brand-name">{profile.name}</span>
              <span className="brand-role admin-brand-role">
                <FiSettings aria-hidden="true" /> Admin dashboard
              </span>
            </span>
          </a>

          <div className="admin-actions">
            <button
              type="button"
              className="icon-btn"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? <FiSun /> : <FiMoon />}
            </button>
            <a className="btn btn--soft btn--sm" href="#home">
              <FiArrowLeft aria-hidden="true" /> Back to website
            </a>
          </div>
        </div>
      </header>

      <div className="container admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-label">Manage</div>
          <nav className="admin-nav" aria-label="Dashboard sections">
            {TABS.map(({ id, label, icon: Icon }) => {
              const badge = counts[id]
              return (
                <button
                  type="button"
                  key={id}
                  className={`admin-nav-btn ${activeTab === id ? 'is-active' : ''}`}
                  onClick={() => goToTab(id)}
                  aria-current={activeTab === id ? 'page' : undefined}
                >
                  <Icon aria-hidden="true" />
                  <span>{label}</span>
                  {badge ? <span className="admin-nav-badge">{badge}</span> : null}
                </button>
              )
            })}
          </nav>

          <div className="admin-sidebar-note">
            <FiAlertTriangle aria-hidden="true" />
            <p>
              Local demo only. There is no secure login or backend — edits live in this browser.
            </p>
          </div>

          <a className="btn btn--ghost btn--sm admin-sidebar-site" href="#home">
            <FiExternalLink aria-hidden="true" /> Open public site
          </a>
        </aside>

        <main className="admin-main">
          <div className="admin-page-head">
            <span className="section-eyebrow">
              <span className="eyebrow-dot" aria-hidden="true" />
              {copy.eyebrow}
            </span>
            <h1>{copy.title}</h1>
            <p>{copy.description}</p>
          </div>

          {activeTab === 'overview' ? (
            <>
              <div className="admin-banner">
                <FiAlertTriangle aria-hidden="true" />
                <div>
                  <strong>This dashboard is local-first, not a secure backend.</strong>
                  <p>
                    There is no login or server. Changes are saved in this browser&apos;s
                    LocalStorage only. Visitors on other devices will see the data committed in{' '}
                    <code>src/data/defaults.js</code>. Export a backup before clearing your browser.
                  </p>
                </div>
              </div>

              <div className="admin-stats">
                <button type="button" className="admin-stat glass" onClick={() => goToTab('projects')}>
                  <span className="admin-stat-icon admin-stat-icon--blue" aria-hidden="true">
                    <FiFolder />
                  </span>
                  <strong>{String(counts.projects).padStart(2, '0')}</strong>
                  <span>Projects</span>
                </button>
                <button
                  type="button"
                  className="admin-stat glass"
                  onClick={() => goToTab('certificates')}
                >
                  <span className="admin-stat-icon admin-stat-icon--cyan" aria-hidden="true">
                    <FiAward />
                  </span>
                  <strong>{String(counts.certificates).padStart(2, '0')}</strong>
                  <span>Certificates</span>
                </button>
                <button
                  type="button"
                  className="admin-stat glass"
                  onClick={() => goToTab('experience')}
                >
                  <span className="admin-stat-icon admin-stat-icon--violet" aria-hidden="true">
                    <FiBriefcase />
                  </span>
                  <strong>{String(counts.experience).padStart(2, '0')}</strong>
                  <span>Experience entries</span>
                </button>
                <button type="button" className="admin-stat glass" onClick={() => goToTab('data')}>
                  <span className="admin-stat-icon admin-stat-icon--green" aria-hidden="true">
                    <FiDatabase />
                  </span>
                  <strong>{formatBytes(storageSize)}</strong>
                  <span>Local data</span>
                </button>
              </div>

              <section className="admin-section">
                <div className="admin-section-head">
                  <h2>Quick actions</h2>
                  <span>Common tasks</span>
                </div>
                <div className="quick-grid">
                  <button
                    type="button"
                    className="quick-action"
                    onClick={() => setProjectModal({ mode: 'create', item: null })}
                  >
                    <span className="quick-icon" aria-hidden="true">
                      <FiPlus />
                    </span>
                    <span>
                      <strong>Add a project</strong>
                      <small>Add a project you actually built</small>
                    </span>
                  </button>
                  <button
                    type="button"
                    className="quick-action"
                    onClick={() => setCertificateModal({ mode: 'create', item: null })}
                  >
                    <span className="quick-icon" aria-hidden="true">
                      <FiAward />
                    </span>
                    <span>
                      <strong>Add a certificate</strong>
                      <small>Record a real certification</small>
                    </span>
                  </button>
                  <button
                    type="button"
                    className="quick-action"
                    onClick={() => setExperienceModal({ mode: 'create', item: null })}
                  >
                    <span className="quick-icon" aria-hidden="true">
                      <FiBriefcase />
                    </span>
                    <span>
                      <strong>Add experience</strong>
                      <small>Internship, workshop or event</small>
                    </span>
                  </button>
                  <button type="button" className="quick-action" onClick={() => goToTab('profile')}>
                    <span className="quick-icon" aria-hidden="true">
                      <FiEdit2 />
                    </span>
                    <span>
                      <strong>Update profile</strong>
                      <small>Contact details and introduction</small>
                    </span>
                  </button>
                </div>
              </section>

              <section className="admin-section">
                <div className="admin-section-head">
                  <h2>Content health</h2>
                  <span>Small checklist</span>
                </div>
                <div className="admin-checklist glass">
                  <div className={profile.email ? 'is-done' : ''}>
                    <FiCheckCircle aria-hidden="true" />
                    <span>
                      Public email {profile.email ? 'added' : 'not added yet'} — shown in Contact.
                    </span>
                    {!profile.email ? (
                      <button type="button" className="text-btn" onClick={() => goToTab('profile')}>
                        Add
                      </button>
                    ) : null}
                  </div>
                  <div className={profile.github ? 'is-done' : ''}>
                    <FiCheckCircle aria-hidden="true" />
                    <span>
                      GitHub link {profile.github ? 'added' : 'not added yet'} — used in the hero and
                      footer.
                    </span>
                    {!profile.github ? (
                      <button type="button" className="text-btn" onClick={() => goToTab('profile')}>
                        Add
                      </button>
                    ) : null}
                  </div>
                  <div className={counts.projects ? 'is-done' : ''}>
                    <FiCheckCircle aria-hidden="true" />
                    <span>
                      {counts.projects
                        ? `${counts.projects} project${counts.projects === 1 ? '' : 's'} published.`
                        : 'No projects yet — add only real work.'}
                    </span>
                    {!counts.projects ? (
                      <button
                        type="button"
                        className="text-btn"
                        onClick={() => setProjectModal({ mode: 'create', item: null })}
                      >
                        Add
                      </button>
                    ) : null}
                  </div>
                  <div>
                    <FiFileText aria-hidden="true" />
                    <span>
                      Resume file: place <code>resume.pdf</code> in <code>public/</code> to enable
                      viewing and downloading.
                    </span>
                  </div>
                </div>
              </section>
            </>
          ) : null}

          {activeTab === 'projects' ? (
            <section className="admin-section">
              <div className="admin-toolbar">
                <div className="admin-toolbar-copy">
                  <span className="admin-count">{counts.projects}</span>
                  <span>project{counts.projects === 1 ? '' : 's'} stored locally</span>
                </div>
                <button
                  type="button"
                  className="btn btn--primary btn--sm"
                  onClick={() => setProjectModal({ mode: 'create', item: null })}
                >
                  <FiPlus aria-hidden="true" /> Add project
                </button>
              </div>

              {projects.length ? (
                <div className="admin-list">
                  {projects.map((project) => (
                    <article className="admin-item glass" key={project.id}>
                      <ProjectThumb project={project} />
                      <div className="admin-item-body">
                        <div className="admin-item-top">
                          <h3>{project.title}</h3>
                          <span className="admin-item-date">
                            {new Date(project.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                        <p>{project.description}</p>
                        <div className="admin-item-meta">
                          {project.technologies?.map((tech) => (
                            <span className="tag tag--sm" key={tech}>
                              {tech}
                            </span>
                          ))}
                          {safeLink(project.github) ? (
                            <a
                              className="admin-mini-link"
                              href={safeLink(project.github)}
                              target="_blank"
                              rel="noreferrer noopener"
                            >
                              <FiExternalLink aria-hidden="true" /> Code
                            </a>
                          ) : null}
                          {safeLink(project.demo) ? (
                            <a
                              className="admin-mini-link"
                              href={safeLink(project.demo)}
                              target="_blank"
                              rel="noreferrer noopener"
                            >
                              <FiExternalLink aria-hidden="true" /> Demo
                            </a>
                          ) : null}
                        </div>
                      </div>
                      <div className="admin-item-actions">
                        <button
                          type="button"
                          className="icon-btn"
                          onClick={() => setProjectModal({ mode: 'edit', item: project })}
                          aria-label={`Edit ${project.title}`}
                          title="Edit project"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          type="button"
                          className="icon-btn icon-btn--danger"
                          onClick={() => setDeleteTarget({ type: 'project', item: project })}
                          aria-label={`Delete ${project.title}`}
                          title="Delete project"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyAdmin
                  icon={FiFolder}
                  title="No projects yet"
                  text="Add a project you have genuinely built. Include the technologies, a screenshot and real links."
                  action={
                    <button
                      type="button"
                      className="btn btn--primary btn--sm"
                      onClick={() => setProjectModal({ mode: 'create', item: null })}
                    >
                      <FiPlus aria-hidden="true" /> Add your first project
                    </button>
                  }
                />
              )}
            </section>
          ) : null}

          {activeTab === 'certificates' ? (
            <section className="admin-section">
              <div className="admin-toolbar">
                <div className="admin-toolbar-copy">
                  <span className="admin-count">{counts.certificates}</span>
                  <span>certificate{counts.certificates === 1 ? '' : 's'} stored locally</span>
                </div>
                <button
                  type="button"
                  className="btn btn--primary btn--sm"
                  onClick={() => setCertificateModal({ mode: 'create', item: null })}
                >
                  <FiPlus aria-hidden="true" /> Add certificate
                </button>
              </div>

              {certificates.length ? (
                <div className="admin-list">
                  {certificates.map((certificate) => (
                    <article className="admin-item glass" key={certificate.id}>
                      <div className="admin-thumb admin-thumb--icon" aria-hidden="true">
                        <FiAward />
                      </div>
                      <div className="admin-item-body">
                        <div className="admin-item-top">
                          <h3>{certificate.title}</h3>
                          <span className="admin-item-date">
                            {certificate.date ? formatMonth(certificate.date) : 'No date'}
                          </span>
                        </div>
                        <p className="admin-item-sub">{certificate.issuer}</p>
                        {safeLink(certificate.url) ? (
                          <a
                            className="admin-mini-link"
                            href={safeLink(certificate.url)}
                            target="_blank"
                            rel="noreferrer noopener"
                          >
                            <FiExternalLink aria-hidden="true" /> Credential
                          </a>
                        ) : (
                          <span className="admin-muted">No credential link</span>
                        )}
                      </div>
                      <div className="admin-item-actions">
                        <button
                          type="button"
                          className="icon-btn"
                          onClick={() => setCertificateModal({ mode: 'edit', item: certificate })}
                          aria-label={`Edit ${certificate.title}`}
                          title="Edit certificate"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          type="button"
                          className="icon-btn icon-btn--danger"
                          onClick={() => setDeleteTarget({ type: 'certificate', item: certificate })}
                          aria-label={`Delete ${certificate.title}`}
                          title="Delete certificate"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyAdmin
                  icon={FiAward}
                  title="No certificates yet"
                  text="Add a certificate only when you have actually earned it. Include the issuer and issue date."
                  action={
                    <button
                      type="button"
                      className="btn btn--primary btn--sm"
                      onClick={() => setCertificateModal({ mode: 'create', item: null })}
                    >
                      <FiPlus aria-hidden="true" /> Add a certificate
                    </button>
                  }
                />
              )}
            </section>
          ) : null}

          {activeTab === 'experience' ? (
            <section className="admin-section">
              <div className="admin-toolbar">
                <div className="admin-toolbar-copy">
                  <span className="admin-count">{counts.experience}</span>
                  <span>experience entr{counts.experience === 1 ? 'y' : 'ies'} stored locally</span>
                </div>
                <button
                  type="button"
                  className="btn btn--primary btn--sm"
                  onClick={() => setExperienceModal({ mode: 'create', item: null })}
                >
                  <FiPlus aria-hidden="true" /> Add experience
                </button>
              </div>

              {experience.length ? (
                <div className="admin-list">
                  {experience.map((item) => (
                    <article className="admin-item glass" key={item.id}>
                      <div className="admin-thumb admin-thumb--icon" aria-hidden="true">
                        <FiBriefcase />
                      </div>
                      <div className="admin-item-body">
                        <div className="admin-item-top">
                          <h3>{item.role}</h3>
                          <span className="admin-item-date">
                            {formatRange(item.start, item.end, item.current) || 'No dates'}
                          </span>
                        </div>
                        <p className="admin-item-sub">
                          {item.organization} · <span className="exp-type">{item.type}</span>
                        </p>
                        <p>{item.description}</p>
                        {item.location ? (
                          <span className="admin-muted">{item.location}</span>
                        ) : null}
                      </div>
                      <div className="admin-item-actions">
                        <button
                          type="button"
                          className="icon-btn"
                          onClick={() => setExperienceModal({ mode: 'edit', item })}
                          aria-label={`Edit ${item.role}`}
                          title="Edit experience"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          type="button"
                          className="icon-btn icon-btn--danger"
                          onClick={() => setDeleteTarget({ type: 'experience', item })}
                          aria-label={`Delete ${item.role}`}
                          title="Delete experience"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyAdmin
                  icon={FiBriefcase}
                  title="No experience yet"
                  text="Record internships, workshops, hackathons and technical events only after you have actually taken part."
                  action={
                    <button
                      type="button"
                      className="btn btn--primary btn--sm"
                      onClick={() => setExperienceModal({ mode: 'create', item: null })}
                    >
                      <FiPlus aria-hidden="true" /> Add experience
                    </button>
                  }
                />
              )}
            </section>
          ) : null}

          {activeTab === 'profile' ? (
            <section className="admin-section">
              <div className="admin-panel glass">
                <div className="admin-panel-head">
                  <div>
                    <h2>Profile information</h2>
                    <p>Changes appear across the whole website immediately.</p>
                  </div>
                  <span className="admin-panel-badge">
                    <FiCheckCircle aria-hidden="true" /> Auto-saved locally
                  </span>
                </div>
                <ProfileForm initialProfile={profile} onSave={handleProfileSave} />
              </div>
            </section>
          ) : null}

          {activeTab === 'data' ? (
            <section className="admin-section">
              <div className="admin-banner admin-banner--info">
                <FiInfo aria-hidden="true" />
                <div>
                  <strong>How local data works</strong>
                  <p>
                    Data is saved under <code>dv.portfolio.*</code> keys in this browser. Other
                    visitors will not see LocalStorage edits. To publish content for everyone, copy
                    your content into <code>src/data/defaults.js</code> and deploy, or connect a real
                    backend later. Use backups to move data between browsers.
                  </p>
                </div>
              </div>

              <div className="data-grid">
                <article className="tool-card glass">
                  <span className="tool-icon" aria-hidden="true">
                    <FiDownload />
                  </span>
                  <h3>Export a backup</h3>
                  <p>Download all profile, project, certificate and experience data as one JSON file.</p>
                  <button type="button" className="btn btn--primary btn--sm" onClick={handleExport}>
                    <FiDownload aria-hidden="true" /> Export data
                  </button>
                </article>

                <article className="tool-card glass">
                  <span className="tool-icon" aria-hidden="true">
                    <FiUpload />
                  </span>
                  <h3>Import a backup</h3>
                  <p>Restore a previous backup. This replaces the current local content.</p>
                  <label className="btn btn--soft btn--sm tool-file-btn">
                    <FiUpload aria-hidden="true" /> Choose JSON file
                    <input
                      type="file"
                      accept="application/json,.json"
                      onChange={handleImport}
                      className="sr-only"
                    />
                  </label>
                </article>

                <article className="tool-card glass">
                  <span className="tool-icon" aria-hidden="true">
                    <FiDatabase />
                  </span>
                  <h3>Storage details</h3>
                  <ul className="storage-list">
                    <li>
                      <span>Projects</span> <strong>{counts.projects}</strong>
                    </li>
                    <li>
                      <span>Certificates</span> <strong>{counts.certificates}</strong>
                    </li>
                    <li>
                      <span>Experience</span> <strong>{counts.experience}</strong>
                    </li>
                    <li>
                      <span>Approx. size</span> <strong>{formatBytes(storageSize)}</strong>
                    </li>
                  </ul>
                </article>

                <article className="tool-card tool-card--danger glass">
                  <span className="tool-icon" aria-hidden="true">
                    <FiRefreshCw />
                  </span>
                  <h3>Reset all content</h3>
                  <p>
                    Restore the default profile and remove all projects, certificates and experience
                    from this browser.
                  </p>
                  <button
                    type="button"
                    className="btn btn--danger btn--sm"
                    onClick={() => setResetOpen(true)}
                  >
                    <FiTrash2 aria-hidden="true" /> Reset everything
                  </button>
                </article>
              </div>

              <div className="admin-section">
                <div className="admin-section-head">
                  <h2>Deployment reminder</h2>
                  <span>Before going live</span>
                </div>
                <div className="admin-checklist glass">
                  <div>
                    <FiFileText aria-hidden="true" />
                    <span>
                      Add your real <code>public/resume.pdf</code> and replace{' '}
                      <code>public/profile.jpg</code> with your photo.
                    </span>
                  </div>
                  <div>
                    <FiMail aria-hidden="true" />
                    <span>Add your public email, LinkedIn and GitHub links under Profile.</span>
                  </div>
                  <div>
                    <FiCalendar aria-hidden="true" />
                    <span>
                      Add real projects, certificates and experience before sharing the website.
                    </span>
                  </div>
                </div>
              </div>
            </section>
          ) : null}

          <div className="admin-footer">
            <p>
              Local demo dashboard · Stored in your browser ·{' '}
              <a href="#home">Back to website</a>
            </p>
          </div>
        </main>
      </div>

      <Modal
        open={Boolean(projectModal)}
        onClose={() => setProjectModal(null)}
        title={projectModal?.mode === 'edit' ? 'Edit project' : 'Add project'}
        subtitle="Only add work you have actually completed."
        size="lg"
      >
        <ProjectForm
          initialValue={projectModal?.item}
          onSubmit={handleProjectSubmit}
          onCancel={() => setProjectModal(null)}
        />
      </Modal>

      <Modal
        open={Boolean(certificateModal)}
        onClose={() => setCertificateModal(null)}
        title={certificateModal?.mode === 'edit' ? 'Edit certificate' : 'Add certificate'}
        subtitle="Real certificates only — no invented achievements."
        size="lg"
      >
        <CertificateForm
          initialValue={certificateModal?.item}
          onSubmit={handleCertificateSubmit}
          onCancel={() => setCertificateModal(null)}
        />
      </Modal>

      <Modal
        open={Boolean(experienceModal)}
        onClose={() => setExperienceModal(null)}
        title={experienceModal?.mode === 'edit' ? 'Edit experience' : 'Add experience'}
        subtitle="Internships, workshops, hackathons and technical events."
        size="lg"
      >
        <ExperienceForm
          initialValue={experienceModal?.item}
          onSubmit={handleExperienceSubmit}
          onCancel={() => setExperienceModal(null)}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={deleteCopy?.title || 'Delete item?'}
        message={deleteCopy?.message || 'This item will be deleted.'}
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <ConfirmDialog
        open={resetOpen}
        title="Reset everything?"
        message="Your profile will return to the default details, and all projects, certificates and experience stored in this browser will be removed."
        confirmLabel="Reset all data"
        onConfirm={handleReset}
        onCancel={() => setResetOpen(false)}
      />
    </div>
  )
}
