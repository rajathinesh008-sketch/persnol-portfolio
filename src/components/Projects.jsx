import { useMemo, useState } from 'react'
import {
  FiExternalLink,
  FiFolder,
  FiGithub,
  FiPlus,
  FiSearch,
} from 'react-icons/fi'
import { usePortfolio } from '../context/PortfolioContext'
import { isSafeLink, safeLink } from '../utils/helpers'
import EmptyState from './ui/EmptyState'
import Reveal from './ui/Reveal'
import SectionHeader from './ui/SectionHeader'

function ProjectCard({ project, index }) {
  const [imageFailed, setImageFailed] = useState(false)
  const imageSrc = isSafeLink(project.image) ? project.image : ''
  const github = safeLink(project.github)
  const demo = safeLink(project.demo)

  return (
    <article className="project-card glass" style={{ '--card-delay': `${index * 70}ms` }}>
      <div className="project-media">
        {imageSrc && !imageFailed ? (
          <img
            src={imageSrc}
            alt={`Preview of ${project.title}`}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="project-placeholder" aria-hidden="true">
            <span className="project-placeholder-mark">{project.title.slice(0, 2).toUpperCase()}</span>
            <FiFolder className="project-placeholder-icon" />
          </div>
        )}
        <span className="project-index">{String(index + 1).padStart(2, '0')}</span>
      </div>

      <div className="project-body">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-desc">{project.description}</p>

        {project.technologies?.length ? (
          <div className="tech-tags" aria-label="Technologies used">
            {project.technologies.map((tech) => (
              <span className="tag tag--sm" key={tech}>
                {tech}
              </span>
            ))}
          </div>
        ) : null}

        <div className="project-links">
          {github ? (
            <a className="project-link" href={github} target="_blank" rel="noreferrer noopener">
              <FiGithub aria-hidden="true" /> Code
            </a>
          ) : null}
          {demo ? (
            <a className="project-link project-link--accent" href={demo} target="_blank" rel="noreferrer noopener">
              <FiExternalLink aria-hidden="true" /> Live demo
            </a>
          ) : null}
          {!github && !demo ? <span className="project-link project-link--muted">No link added yet</span> : null}
        </div>
      </div>
    </article>
  )
}

export default function Projects() {
  const { projects } = usePortfolio()
  const [query, setQuery] = useState('')
  const [activeTech, setActiveTech] = useState('All')

  const technologies = useMemo(() => {
    const unique = new Set()
    projects.forEach((project) => {
      project.technologies?.forEach((tech) => unique.add(tech))
    })
    return ['All', ...Array.from(unique).slice(0, 8)]
  }, [projects])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    return projects.filter((project) => {
      const matchesTech =
        activeTech === 'All' || project.technologies?.some((tech) => tech === activeTech)
      if (!matchesTech) return false
      if (!term) return true
      return (
        project.title.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term) ||
        project.technologies?.some((tech) => tech.toLowerCase().includes(term))
      )
    })
  }, [projects, query, activeTech])

  const addButton = (
    <a className="btn btn--soft btn--sm" href="#/admin/projects">
      <FiPlus aria-hidden="true" /> Add project
    </a>
  )

  return (
    <section className="section section--alt" id="projects">
      <div className="container">
        <Reveal>
          <SectionHeader
            eyebrow="Projects"
            title="Things I build and learn from."
            description="Real projects appear here as I complete them. Every project is stored locally and can be managed from the dashboard."
            action={addButton}
          />
        </Reveal>

        {projects.length ? (
          <Reveal delay={60}>
            <div className="project-toolbar">
              <label className="search-box">
                <FiSearch aria-hidden="true" />
                <span className="sr-only">Search projects</span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by project or technology…"
                />
              </label>
              <div className="filter-chips" role="group" aria-label="Filter projects by technology">
                {technologies.map((tech) => (
                  <button
                    type="button"
                    key={tech}
                    className={`filter-chip ${activeTech === tech ? 'is-active' : ''}`}
                    aria-pressed={activeTech === tech}
                    onClick={() => setActiveTech(tech)}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>
        ) : null}

        {!projects.length ? (
          <Reveal delay={80}>
            <EmptyState
              icon={FiFolder}
              title="No projects added yet"
              text="I only list work that I have actually built. New projects will appear here as soon as they are ready. Add your first project from the dashboard."
              action={addButton}
            />
          </Reveal>
        ) : null}

        {projects.length && !filtered.length ? (
          <Reveal delay={80}>
            <EmptyState
              icon={FiSearch}
              title="No matching projects"
              text="Try a different search term or technology filter."
              action={
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => {
                    setQuery('')
                    setActiveTech('All')
                  }}
                >
                  Clear filters
                </button>
              }
            />
          </Reveal>
        ) : null}

        {filtered.length ? (
          <div className="projects-grid">
            {filtered.map((project, index) => (
              <Reveal key={project.id} delay={index * 60}>
                <ProjectCard project={project} index={index} />
              </Reveal>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
