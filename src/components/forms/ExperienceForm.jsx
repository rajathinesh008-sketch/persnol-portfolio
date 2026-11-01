import { useState } from 'react'
import { FiSave, FiX } from 'react-icons/fi'
import { EXPERIENCE_TYPES } from '../../data/defaults'

function toForm(experience) {
  return {
    role: experience?.role || '',
    organization: experience?.organization || '',
    type: experience?.type || 'Internship',
    start: experience?.start || '',
    end: experience?.end || '',
    current: Boolean(experience?.current),
    location: experience?.location || '',
    description: experience?.description || '',
  }
}

export default function ExperienceForm({ initialValue, onSubmit, onCancel }) {
  const [values, setValues] = useState(() => toForm(initialValue))
  const [errors, setErrors] = useState({})

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    setValues((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'current' && checked ? { end: '' } : {}),
    }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const next = {}
    if (values.role.trim().length < 2) next.role = 'Enter your role or event name.'
    if (values.organization.trim().length < 2) next.organization = 'Enter the organisation name.'
    if (!values.start) next.start = 'Choose a start month.'
    if (!values.current && !values.end) next.end = 'Choose an end month, or mark it as current.'
    if (!values.current && values.start && values.end && values.end < values.start)
      next.end = 'The end month cannot be before the start month.'
    if (values.description.trim().length < 15)
      next.description = 'Add a short, honest description (at least 15 characters).'

    setErrors(next)
    if (Object.keys(next).length) return

    onSubmit({
      role: values.role.trim(),
      organization: values.organization.trim(),
      type: values.type,
      start: values.start,
      end: values.current ? '' : values.end,
      current: values.current,
      location: values.location.trim(),
      description: values.description.trim(),
    })
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <div className={`form-group ${errors.role ? 'has-error' : ''}`}>
          <label className="form-label" htmlFor="experience-role">
            Role / event <span aria-hidden="true">*</span>
          </label>
          <input
            id="experience-role"
            name="role"
            className="form-input"
            value={values.role}
            onChange={handleChange}
            placeholder="e.g. Web Development Intern"
            maxLength={120}
            aria-invalid={Boolean(errors.role)}
          />
          {errors.role ? <span className="form-error">{errors.role}</span> : null}
        </div>

        <div className={`form-group ${errors.organization ? 'has-error' : ''}`}>
          <label className="form-label" htmlFor="experience-organization">
            Organisation <span aria-hidden="true">*</span>
          </label>
          <input
            id="experience-organization"
            name="organization"
            className="form-input"
            value={values.organization}
            onChange={handleChange}
            placeholder="Company or institution"
            maxLength={120}
            aria-invalid={Boolean(errors.organization)}
          />
          {errors.organization ? <span className="form-error">{errors.organization}</span> : null}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="experience-type">
            Type
          </label>
          <select
            id="experience-type"
            name="type"
            className="form-input form-select"
            value={values.type}
            onChange={handleChange}
          >
            {EXPERIENCE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="experience-location">
            Location
          </label>
          <input
            id="experience-location"
            name="location"
            className="form-input"
            value={values.location}
            onChange={handleChange}
            placeholder="City or Online"
            maxLength={80}
          />
        </div>
      </div>

      <div className="form-row">
        <div className={`form-group ${errors.start ? 'has-error' : ''}`}>
          <label className="form-label" htmlFor="experience-start">
            Start month <span aria-hidden="true">*</span>
          </label>
          <input
            id="experience-start"
            name="start"
            className="form-input"
            type="month"
            value={values.start}
            onChange={handleChange}
            aria-invalid={Boolean(errors.start)}
          />
          {errors.start ? <span className="form-error">{errors.start}</span> : null}
        </div>

        <div className={`form-group ${errors.end ? 'has-error' : ''}`}>
          <label className="form-label" htmlFor="experience-end">
            End month
          </label>
          <input
            id="experience-end"
            name="end"
            className="form-input"
            type="month"
            value={values.end}
            onChange={handleChange}
            disabled={values.current}
            aria-invalid={Boolean(errors.end)}
          />
          {errors.end ? <span className="form-error">{errors.end}</span> : null}
        </div>
      </div>

      <label className="checkbox-row" htmlFor="experience-current">
        <input
          id="experience-current"
          name="current"
          type="checkbox"
          checked={values.current}
          onChange={handleChange}
        />
        <span>I am currently doing this</span>
      </label>

      <div className={`form-group ${errors.description ? 'has-error' : ''}`}>
        <label className="form-label" htmlFor="experience-description">
          Description <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="experience-description"
          name="description"
          className="form-input form-textarea"
          rows={4}
          value={values.description}
          onChange={handleChange}
          placeholder="What did you work on or learn?"
          maxLength={600}
          aria-invalid={Boolean(errors.description)}
        />
        <div className="form-group-foot">
          {errors.description ? (
            <span className="form-error">{errors.description}</span>
          ) : (
            <span className="form-hint">Keep it factual and specific.</span>
          )}
          <span className="char-count">{values.description.length}/600</span>
        </div>
      </div>

      <p className="form-note">
        Only record internships, workshops, hackathons and events that you actually attended.
      </p>

      <div className="form-actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          <FiX aria-hidden="true" /> Cancel
        </button>
        <button type="submit" className="btn btn--primary">
          <FiSave aria-hidden="true" /> Save experience
        </button>
      </div>
    </form>
  )
}
