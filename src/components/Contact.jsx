import { useState } from 'react'
import {
  FiAlertCircle,
  FiCheckCircle,
  FiCopy,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiMapPin,
  FiSend,
  FiSettings,
} from 'react-icons/fi'
import { usePortfolio } from '../context/PortfolioContext'
import { useToast } from '../context/ToastContext'
import { copyText, isValidEmail, safeLink } from '../utils/helpers'
import Reveal from './ui/Reveal'
import SectionHeader from './ui/SectionHeader'

const EMPTY_FORM = { name: '', email: '', subject: '', message: '' }

function validateField(name, value) {
  const text = String(value || '').trim()
  if (name === 'name') {
    if (!text) return 'Please enter your name.'
    if (text.length < 2) return 'Your name should be at least 2 characters.'
  }
  if (name === 'email') {
    if (!text) return 'Please enter your email address.'
    if (!isValidEmail(text)) return 'Please enter a valid email address.'
  }
  if (name === 'subject') {
    if (!text) return 'Please add a subject.'
    if (text.length < 3) return 'The subject should be at least 3 characters.'
  }
  if (name === 'message') {
    if (!text) return 'Please write a message.'
    if (text.length < 10) return 'Please write at least 10 characters.'
  }
  return ''
}

function validateAll(values) {
  return Object.keys(EMPTY_FORM).reduce((errors, field) => {
    const error = validateField(field, values[field])
    if (error) errors[field] = error
    return errors
  }, {})
}

export default function Contact() {
  const { profile } = usePortfolio()
  const { addToast } = useToast()
  const [values, setValues] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [feedback, setFeedback] = useState(null)
  const [copied, setCopied] = useState(false)

  const emailLink = isValidEmail(profile.email) ? `mailto:${profile.email}` : ''
  const linkedin = safeLink(profile.linkedin)
  const github = safeLink(profile.github)

  const channels = [
    {
      key: 'email',
      label: 'Email',
      icon: FiMail,
      value: isValidEmail(profile.email) ? profile.email : 'Not added yet',
      href: emailLink,
      hint: emailLink ? 'Click to start an email' : 'Add your email from the dashboard',
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      icon: FiLinkedin,
      value: linkedin ? 'View my LinkedIn profile' : 'Not added yet',
      href: linkedin,
      hint: linkedin ? 'Opens in a new tab' : 'Add a real LinkedIn URL from the dashboard',
    },
    {
      key: 'github',
      label: 'GitHub',
      icon: FiGithub,
      value: github ? 'View my GitHub profile' : 'Not added yet',
      href: github,
      hint: github ? 'Opens in a new tab' : 'Add a real GitHub URL from the dashboard',
    },
  ]

  async function handleCopyEmail() {
    if (!isValidEmail(profile.email)) {
      addToast('Add your email in Dashboard → Profile first.', 'warning')
      return
    }
    try {
      await copyText(profile.email)
      setCopied(true)
      addToast('Email address copied.', 'success')
      setTimeout(() => setCopied(false), 2200)
    } catch {
      addToast('Could not copy the email address. Please select it manually.', 'error')
    }
  }

  function handleChange(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
    if (feedback) setFeedback(null)
  }

  function handleBlur(event) {
    const { name, value } = event.target
    const error = validateField(name, value)
    setErrors((current) => ({ ...current, [name]: error }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validateAll(values)
    setErrors(nextErrors)

    const firstError = Object.keys(nextErrors)[0]
    if (firstError) {
      setFeedback({ type: 'error', text: 'Please fix the highlighted fields and try again.' })
      const field = event.currentTarget.querySelector(`[name="${firstError}"]`)
      field?.focus()
      return
    }

    if (!isValidEmail(profile.email)) {
      setFeedback({
        type: 'error',
        text: 'The contact email is not configured on this site yet.',
        action: { label: 'Add it in Dashboard → Profile', href: '#/admin/profile' },
      })
      return
    }

    const body = [
      `Hi Dineshraja,`,
      '',
      values.message.trim(),
      '',
      '—',
      `Name: ${values.name.trim()}`,
      `Email: ${values.email.trim()}`,
    ].join('\n')
    const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(
      values.subject.trim(),
    )}&body=${encodeURIComponent(body)}`

    window.location.href = mailto
    setFeedback({
      type: 'success',
      text: `Your email app should now open with the message ready to send. If it does not open, email me directly at ${profile.email}.`,
    })
    addToast('Message prepared in your email app.', 'success')
  }

  const emailMissing = !isValidEmail(profile.email)
  const socialMissing = !linkedin || !github

  return (
    <section className="section section--alt" id="contact">
      <div className="container">
        <Reveal>
          <SectionHeader
            eyebrow="Contact"
            title="Let's build, learn or simply talk."
            description="Have a question, an opportunity or an idea? Send a message — I'd be glad to hear from you."
          />
        </Reveal>

        <div className="contact-grid">
          <Reveal className="contact-info" delay={60}>
            <div className="contact-channels">
              {channels.map(({ key, label, icon: Icon, value, href, hint }) => {
                const inner = (
                  <>
                    <span className="contact-icon" aria-hidden="true">
                      <Icon />
                    </span>
                    <span className="contact-details">
                      <span className="contact-label">{label}</span>
                      <span className={`contact-value ${!href ? 'is-empty' : ''}`}>{value}</span>
                      <span className="contact-hint">{hint}</span>
                    </span>
                  </>
                )

                return href ? (
                  <div className="contact-card" key={key}>
                    <a
                      className="contact-card-link"
                      href={href}
                      target={href.startsWith('mailto:') ? undefined : '_blank'}
                      rel={href.startsWith('mailto:') ? undefined : 'noreferrer noopener'}
                    >
                      {inner}
                    </a>
                    {key === 'email' ? (
                      <button
                        type="button"
                        className="contact-copy"
                        onClick={handleCopyEmail}
                        aria-label="Copy email address"
                        title="Copy email address"
                      >
                        {copied ? <FiCheckCircle /> : <FiCopy />}
                      </button>
                    ) : null}
                  </div>
                ) : (
                  <a className="contact-card contact-card--empty" href="#/admin/profile" key={key}>
                    {inner}
                    <FiSettings className="contact-empty-icon" aria-hidden="true" />
                  </a>
                )
              })}

              <div className="contact-card contact-card--static">
                <span className="contact-icon" aria-hidden="true">
                  <FiMapPin />
                </span>
                <span className="contact-details">
                  <span className="contact-label">Location</span>
                  <span className="contact-value">{profile.location}</span>
                  <span className="contact-hint">Based in Tamil Nadu, India</span>
                </span>
              </div>
            </div>

            {emailMissing || socialMissing ? (
              <div className="contact-note">
                <FiAlertCircle aria-hidden="true" />
                <p>
                  Only real contact details are published. Add the missing links from the{' '}
                  <a href="#/admin/profile">Admin Dashboard → Profile</a>. No placeholder links are
                  used.
                </p>
              </div>
            ) : null}
          </Reveal>

          <Reveal className="contact-form-card glass" delay={130}>
            <div className="form-card-head">
              <span className="form-card-icon" aria-hidden="true">
                <FiSend />
              </span>
              <div>
                <h3>Send me a message</h3>
                <p>This form opens your email app with the details filled in.</p>
              </div>
            </div>

            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
                  <label className="form-label" htmlFor="contact-name">
                    Your name <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    className="form-input"
                    type="text"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g. Arun Kumar"
                    autoComplete="name"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'contact-name-error' : undefined}
                    maxLength={80}
                  />
                  {errors.name ? (
                    <span className="form-error" id="contact-name-error">
                      {errors.name}
                    </span>
                  ) : null}
                </div>

                <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
                  <label className="form-label" htmlFor="contact-email">
                    Your email <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    className="form-input"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="you@example.com"
                    autoComplete="email"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'contact-email-error' : undefined}
                    maxLength={120}
                  />
                  {errors.email ? (
                    <span className="form-error" id="contact-email-error">
                      {errors.email}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className={`form-group ${errors.subject ? 'has-error' : ''}`}>
                <label className="form-label" htmlFor="contact-subject">
                  Subject <span aria-hidden="true">*</span>
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  className="form-input"
                  type="text"
                  value={values.subject}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="What would you like to talk about?"
                  aria-invalid={Boolean(errors.subject)}
                  aria-describedby={errors.subject ? 'contact-subject-error' : undefined}
                  maxLength={120}
                />
                {errors.subject ? (
                  <span className="form-error" id="contact-subject-error">
                    {errors.subject}
                  </span>
                ) : null}
              </div>

              <div className={`form-group ${errors.message ? 'has-error' : ''}`}>
                <label className="form-label" htmlFor="contact-message">
                  Message <span aria-hidden="true">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  className="form-input form-textarea"
                  rows={6}
                  value={values.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Write your message here…"
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'contact-message-error' : undefined}
                  maxLength={1200}
                />
                <div className="form-group-foot">
                  {errors.message ? (
                    <span className="form-error" id="contact-message-error">
                      {errors.message}
                    </span>
                  ) : (
                    <span className="form-hint">Minimum 10 characters.</span>
                  )}
                  <span className="char-count">{values.message.length}/1200</span>
                </div>
              </div>

              {feedback ? (
                <div
                  className={`form-alert form-alert--${feedback.type}`}
                  role="status"
                  aria-live="polite"
                >
                  {feedback.type === 'success' ? (
                    <FiCheckCircle aria-hidden="true" />
                  ) : (
                    <FiAlertCircle aria-hidden="true" />
                  )}
                  <div>
                    <p>{feedback.text}</p>
                    {feedback.action ? (
                      <a className="form-alert-link" href={feedback.action.href}>
                        {feedback.action.label}
                      </a>
                    ) : null}
                  </div>
                </div>
              ) : null}

              <button type="submit" className="btn btn--primary btn--full">
                <FiSend aria-hidden="true" /> Send message
              </button>

              <p className="form-note">
                This is a static website — no message is stored or sent automatically. Your email
                app handles the final send.
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
