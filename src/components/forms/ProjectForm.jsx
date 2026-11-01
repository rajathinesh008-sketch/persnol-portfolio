import { useState } from 'react'
import { FiSave, FiX } from 'react-icons/fi'
import { isHttpUrl, normalizeUrl, parseList } from '../../utils/helpers'

const EMPTY = {
  title: '',
  description: '',
  technologies: '',
  image: '',
  github: '',
  demo: '',
}

function toForm(project) {
  if (!project) return EMPTY
  return {
    title: project.title || '',
    description: project.description || '',
    technologies: (project.technologies || []).join(', '),
    image: project.image || '',
    github: project.github || '',
    demo: project.demo || '',
  }
}

export default function ProjectForm({ initialValue, onSubmit, onCancel }) {
  const [values, setValues] = useState(() => toForm(initialValue))
  const [errors, setErrors] = useState({})

  function handleChange(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const next = {}

    if (values.title.trim().length < 3) next.title = 'Give the project a title of at least 3 characters.'
    if (values.description.trim().length < 20)
      next.description = 'Write at least 20 characters so visitors understand the project.'

    const image = normalizeUrl(values.image)
    if (image && !isHttpUrl(image)) next.image = 'Use a valid URL or a path like /images/project.jpg.'

    const github = normalizeUrl(values.github)
    if (github && !isHttpUrl(github)) next.github = 'Enter a valid GitHub URL.'

    const demo = normalizeUrl(values.demo)
    if (demo && !isHttpUrl(demo)) next.demo = 'Enter a valid live demo URL.'

    setErrors(next)
    if (Object.keys(next).length) return

    onSubmit({
      title: values.title.trim(),
      description: values.description.trim(),
      technologies: parseList(values.technologies),
      image,
      github,
      demo,
    })
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit} noValidate>
      <div className={`form-group ${errors.title ? 'has-error' : ''}`}>
        <label className="form-label" htmlFor="project-title">
          Project title <span aria-hidden="true">*</span>
        </label>
        <input
          id="project-title"
          name="title"
          className="form-input"
          value={values.title}
          onChange={handleChange}
          placeholder="e.g. Personal Portfolio Website"
          maxLength={90}
          aria-invalid={Boolean(errors.title)}
        />
        {errors.title ? <span className="form-error">{errors.title}</span> : null}
      </div>

      <div className={`form-group ${errors.description ? 'has-error' : ''}`}>
        <label className="form-label" htmlFor="project-description">
          Description <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="project-description"
          name="description"
          className="form-input form-textarea"
          rows={4}
          value={values.description}
          onChange={handleChange}
          placeholder="What does the project do? What did you learn?"
          maxLength={600}
          aria-invalid={Boolean(errors.description)}
        />
        <div className="form-group-foot">
          {errors.description ? (
            <span className="form-error">{errors.description}</span>
          ) : (
            <span className="form-hint">Be accurate — only describe what you actually built.</span>
          )}
          <span className="char-count">{values.description.length}/600</span>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="project-technologies">
          Technologies used
        </label>
        <input
          id="project-technologies"
          name="technologies"
          className="form-input"
          value={values.technologies}
          onChange={handleChange}
          placeholder="React.js, CSS, JavaScript"
        />
        <span className="form-hint">Separate each technology with a comma.</span>
      </div>

      <div className={`form-group ${errors.image ? 'has-error' : ''}`}>
        <label className="form-label" htmlFor="project-image">
          Project image URL
        </label>
        <input
          id="project-image"
          name="image"
          className="form-input"
          value={values.image}
          onChange={handleChange}
          placeholder="https://… or /images/my-project.png"
          aria-invalid={Boolean(errors.image)}
        />
        {errors.image ? (
          <span className="form-error">{errors.image}</span>
        ) : (
          <span className="form-hint">
            Optional. Use a real image URL or put an image inside <code>public/images</code>.
          </span>
        )}
      </div>

      <div className="form-row">
        <div className={`form-group ${errors.github ? 'has-error' : ''}`}>
          <label className="form-label" htmlFor="project-github">
            GitHub link
          </label>
          <input
            id="project-github"
            name="github"
            className="form-input"
            value={values.github}
            onChange={handleChange}
            placeholder="https://github.com/username/repo"
            aria-invalid={Boolean(errors.github)}
          />
          {errors.github ? <span className="form-error">{errors.github}</span> : null}
        </div>

        <div className={`form-group ${errors.demo ? 'has-error' : ''}`}>
          <label className="form-label" htmlFor="project-demo">
            Live demo link
          </label>
          <input
            id="project-demo"
            name="demo"
            className="form-input"
            value={values.demo}
            onChange={handleChange}
            placeholder="https://your-project.vercel.app"
            aria-invalid={Boolean(errors.demo)}
          />
          {errors.demo ? <span className="form-error">{errors.demo}</span> : null}
        </div>
      </div>

      <p className="form-note">
        Leave a link empty if it does not exist. Empty links are hidden instead of showing broken
        placeholders.
      </p>

      <div className="form-actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          <FiX aria-hidden="true" /> Cancel
        </button>
        <button type="submit" className="btn btn--primary">
          <FiSave aria-hidden="true" /> Save project
        </button>
      </div>
    </form>
  )
}
