import { useState } from 'react'
import { FiSave, FiX } from 'react-icons/fi'
import { isHttpUrl, normalizeUrl } from '../../utils/helpers'

function toForm(certificate) {
  return {
    title: certificate?.title || '',
    issuer: certificate?.issuer || '',
    date: certificate?.date || '',
    url: certificate?.url || '',
  }
}

export default function CertificateForm({ initialValue, onSubmit, onCancel }) {
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
    if (values.title.trim().length < 3) next.title = 'Enter the certificate title.'
    if (values.issuer.trim().length < 2) next.issuer = 'Enter the issuing organisation.'
    if (!values.date) next.date = 'Choose the month and year of issue.'

    const url = normalizeUrl(values.url)
    if (url && !isHttpUrl(url)) next.url = 'Enter a valid credential URL.'

    setErrors(next)
    if (Object.keys(next).length) return

    onSubmit({
      title: values.title.trim(),
      issuer: values.issuer.trim(),
      date: values.date,
      url,
    })
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit} noValidate>
      <div className={`form-group ${errors.title ? 'has-error' : ''}`}>
        <label className="form-label" htmlFor="certificate-title">
          Certificate title <span aria-hidden="true">*</span>
        </label>
        <input
          id="certificate-title"
          name="title"
          className="form-input"
          value={values.title}
          onChange={handleChange}
          placeholder="e.g. Introduction to Python"
          maxLength={120}
          aria-invalid={Boolean(errors.title)}
        />
        {errors.title ? <span className="form-error">{errors.title}</span> : null}
      </div>

      <div className={`form-group ${errors.issuer ? 'has-error' : ''}`}>
        <label className="form-label" htmlFor="certificate-issuer">
          Issuing organisation <span aria-hidden="true">*</span>
        </label>
        <input
          id="certificate-issuer"
          name="issuer"
          className="form-input"
          value={values.issuer}
          onChange={handleChange}
          placeholder="e.g. NPTEL, Coursera, college name"
          maxLength={120}
          aria-invalid={Boolean(errors.issuer)}
        />
        {errors.issuer ? <span className="form-error">{errors.issuer}</span> : null}
      </div>

      <div className="form-row">
        <div className={`form-group ${errors.date ? 'has-error' : ''}`}>
          <label className="form-label" htmlFor="certificate-date">
            Date of issue <span aria-hidden="true">*</span>
          </label>
          <input
            id="certificate-date"
            name="date"
            className="form-input"
            type="month"
            value={values.date}
            onChange={handleChange}
            aria-invalid={Boolean(errors.date)}
          />
          {errors.date ? <span className="form-error">{errors.date}</span> : null}
        </div>

        <div className={`form-group ${errors.url ? 'has-error' : ''}`}>
          <label className="form-label" htmlFor="certificate-url">
            Credential link
          </label>
          <input
            id="certificate-url"
            name="url"
            className="form-input"
            value={values.url}
            onChange={handleChange}
            placeholder="https://…"
            aria-invalid={Boolean(errors.url)}
          />
          {errors.url ? (
            <span className="form-error">{errors.url}</span>
          ) : (
            <span className="form-hint">Optional. Only add a link that actually works.</span>
          )}
        </div>
      </div>

      <p className="form-note">
        Add only certificates you have genuinely received. The public section never creates sample
        achievements.
      </p>

      <div className="form-actions">
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          <FiX aria-hidden="true" /> Cancel
        </button>
        <button type="submit" className="btn btn--primary">
          <FiSave aria-hidden="true" /> Save certificate
        </button>
      </div>
    </form>
  )
}
