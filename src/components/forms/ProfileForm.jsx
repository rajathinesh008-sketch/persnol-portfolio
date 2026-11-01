import { useEffect, useState } from 'react'
import { FiBookOpen, FiLink, FiRefreshCw, FiSave, FiTarget, FiUser } from 'react-icons/fi'
import {
  initialsOf,
  isHttpUrl,
  isValidEmail,
  normalizeUrl,
  parseList,
} from '../../utils/helpers'
import ProfileImage from '../ui/ProfileImage'

function toForm(profile) {
  return {
    name: profile.name || '',
    headline: profile.headline || '',
    location: profile.location || '',
    degree: profile.degree || '',
    year: profile.year || '',
    college: profile.college || '',
    school: profile.school || '',
    careerGoal: profile.careerGoal || '',
    availability: profile.availability || '',
    roles: (profile.roles || []).join(', '),
    interests: (profile.interests || []).join(', '),
    intro: profile.intro || '',
    bio: profile.bio || '',
    shortTermGoal: profile.shortTermGoal || '',
    longTermGoal: profile.longTermGoal || '',
    email: profile.email || '',
    linkedin: profile.linkedin || '',
    github: profile.github || '',
    photo: profile.photo || '',
    resumeUrl: profile.resumeUrl || '',
  }
}

export default function ProfileForm({ initialProfile, onSave }) {
  const [values, setValues] = useState(() => toForm(initialProfile))
  const [errors, setErrors] = useState({})

  useEffect(() => {
    setValues(toForm(initialProfile))
    setErrors({})
  }, [initialProfile])

  function handleChange(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  function validate() {
    const next = {}
    if (values.name.trim().length < 2) next.name = 'Enter your full name.'
    if (values.headline.trim().length < 5) next.headline = 'Add a short professional headline.'
    if (values.intro.trim().length < 20) next.intro = 'Write at least 20 characters for your introduction.'
    if (values.location.trim().length < 2) next.location = 'Enter your location.'
    if (values.degree.trim().length < 2) next.degree = 'Enter your degree.'
    if (values.college.trim().length < 2) next.college = 'Enter your college name.'
    if (!parseList(values.roles).length) next.roles = 'Add at least one role for the typing animation.'
    if (values.email.trim() && !isValidEmail(values.email)) next.email = 'Enter a valid email address.'
    if (values.linkedin.trim() && !isHttpUrl(normalizeUrl(values.linkedin)))
      next.linkedin = 'Enter a valid URL (e.g. https://linkedin.com/in/your-name).'
    if (values.github.trim() && !isHttpUrl(normalizeUrl(values.github)))
      next.github = 'Enter a valid URL (e.g. https://github.com/your-username).'
    if (values.photo.trim() && !isHttpUrl(normalizeUrl(values.photo)))
      next.photo = 'Use a valid image URL or a path like /profile.jpg.'
    if (values.resumeUrl.trim() && !isHttpUrl(normalizeUrl(values.resumeUrl)))
      next.resumeUrl = 'Use a path like /resume.pdf or a valid URL.'
    return next
  }

  function handleSubmit(event) {
    event.preventDefault()
    const next = validate()
    setErrors(next)
    const firstError = Object.keys(next)[0]
    if (firstError) {
      const field = event.currentTarget.querySelector(`[name="${firstError}"]`)
      field?.focus()
      return
    }

    onSave({
      name: values.name.trim(),
      initials: initialsOf(values.name),
      headline: values.headline.trim(),
      location: values.location.trim(),
      degree: values.degree.trim(),
      year: values.year.trim(),
      college: values.college.trim(),
      school: values.school.trim(),
      careerGoal: values.careerGoal.trim(),
      availability: values.availability.trim(),
      roles: parseList(values.roles),
      interests: parseList(values.interests),
      intro: values.intro.trim(),
      bio: values.bio.trim(),
      shortTermGoal: values.shortTermGoal.trim(),
      longTermGoal: values.longTermGoal.trim(),
      email: values.email.trim(),
      linkedin: normalizeUrl(values.linkedin),
      github: normalizeUrl(values.github),
      photo: normalizeUrl(values.photo) || '/profile.jpg',
      resumeUrl: normalizeUrl(values.resumeUrl) || '/resume.pdf',
    })
  }

  function handleReset() {
    setValues(toForm(initialProfile))
    setErrors({})
  }

  return (
    <form className="admin-form profile-form" onSubmit={handleSubmit} noValidate>
      <fieldset className="form-section">
        <legend>
          <FiUser aria-hidden="true" /> Profile basics
        </legend>
        <div className="form-grid">
          <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
            <label className="form-label" htmlFor="profile-name">
              Full name <span aria-hidden="true">*</span>
            </label>
            <input
              id="profile-name"
              name="name"
              className="form-input"
              value={values.name}
              onChange={handleChange}
              maxLength={80}
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name ? <span className="form-error">{errors.name}</span> : null}
          </div>

          <div className={`form-group ${errors.headline ? 'has-error' : ''}`}>
            <label className="form-label" htmlFor="profile-headline">
              Headline <span aria-hidden="true">*</span>
            </label>
            <input
              id="profile-headline"
              name="headline"
              className="form-input"
              value={values.headline}
              onChange={handleChange}
              maxLength={120}
              aria-invalid={Boolean(errors.headline)}
            />
            {errors.headline ? <span className="form-error">{errors.headline}</span> : null}
          </div>

          <div className={`form-group ${errors.location ? 'has-error' : ''}`}>
            <label className="form-label" htmlFor="profile-location">
              Location <span aria-hidden="true">*</span>
            </label>
            <input
              id="profile-location"
              name="location"
              className="form-input"
              value={values.location}
              onChange={handleChange}
              maxLength={100}
              aria-invalid={Boolean(errors.location)}
            />
            {errors.location ? <span className="form-error">{errors.location}</span> : null}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="profile-availability">
              Availability line
            </label>
            <input
              id="profile-availability"
              name="availability"
              className="form-input"
              value={values.availability}
              onChange={handleChange}
              maxLength={100}
              placeholder="Open to internships & learning opportunities"
            />
          </div>

          <div className={`form-group field--full ${errors.roles ? 'has-error' : ''}`}>
            <label className="form-label" htmlFor="profile-roles">
              Typing roles <span aria-hidden="true">*</span>
            </label>
            <input
              id="profile-roles"
              name="roles"
              className="form-input"
              value={values.roles}
              onChange={handleChange}
              placeholder="Computer Science Student, Aspiring Software Developer"
              aria-invalid={Boolean(errors.roles)}
            />
            {errors.roles ? (
              <span className="form-error">{errors.roles}</span>
            ) : (
              <span className="form-hint">
                Separate with commas. These words animate on the home page.
              </span>
            )}
          </div>

          <div className={`form-group field--full ${errors.intro ? 'has-error' : ''}`}>
            <label className="form-label" htmlFor="profile-intro">
              Short introduction <span aria-hidden="true">*</span>
            </label>
            <textarea
              id="profile-intro"
              name="intro"
              className="form-input form-textarea"
              rows={4}
              value={values.intro}
              onChange={handleChange}
              maxLength={700}
              aria-invalid={Boolean(errors.intro)}
            />
            {errors.intro ? (
              <span className="form-error">{errors.intro}</span>
            ) : (
              <span className="form-hint">Used on the home page and in the About section.</span>
            )}
          </div>

          <div className="form-group field--full">
            <label className="form-label" htmlFor="profile-bio">
              About paragraph
            </label>
            <textarea
              id="profile-bio"
              name="bio"
              className="form-input form-textarea"
              rows={4}
              value={values.bio}
              onChange={handleChange}
              maxLength={900}
            />
          </div>

          <div className={`form-group ${errors.photo ? 'has-error' : ''}`}>
            <label className="form-label" htmlFor="profile-photo">
              Profile image URL
            </label>
            <input
              id="profile-photo"
              name="photo"
              className="form-input"
              value={values.photo}
              onChange={handleChange}
              placeholder="/profile.jpg"
              aria-invalid={Boolean(errors.photo)}
            />
            {errors.photo ? (
              <span className="form-error">{errors.photo}</span>
            ) : (
              <span className="form-hint">
                Default is <code>/profile.jpg</code> from the public folder.
              </span>
            )}
          </div>

          <div className="form-group">
            <span className="form-label">Image preview</span>
            <div className="photo-preview">
              <ProfileImage
                src={normalizeUrl(values.photo)}
                alt="Profile image preview"
                initials={initialsOf(values.name)}
                className="photo-preview-img"
              />
            </div>
          </div>
        </div>
      </fieldset>

      <fieldset className="form-section">
        <legend>
          <FiBookOpen aria-hidden="true" /> Academic details
        </legend>
        <div className="form-grid">
          <div className={`form-group ${errors.degree ? 'has-error' : ''}`}>
            <label className="form-label" htmlFor="profile-degree">
              Degree <span aria-hidden="true">*</span>
            </label>
            <input
              id="profile-degree"
              name="degree"
              className="form-input"
              value={values.degree}
              onChange={handleChange}
              maxLength={120}
              aria-invalid={Boolean(errors.degree)}
            />
            {errors.degree ? <span className="form-error">{errors.degree}</span> : null}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="profile-year">
              Year / status
            </label>
            <input
              id="profile-year"
              name="year"
              className="form-input"
              value={values.year}
              onChange={handleChange}
              placeholder="1st Year"
              maxLength={60}
            />
          </div>

          <div className={`form-group field--full ${errors.college ? 'has-error' : ''}`}>
            <label className="form-label" htmlFor="profile-college">
              College <span aria-hidden="true">*</span>
            </label>
            <input
              id="profile-college"
              name="college"
              className="form-input"
              value={values.college}
              onChange={handleChange}
              maxLength={160}
              aria-invalid={Boolean(errors.college)}
            />
            {errors.college ? <span className="form-error">{errors.college}</span> : null}
          </div>

          <div className="form-group field--full">
            <label className="form-label" htmlFor="profile-school">
              School
            </label>
            <input
              id="profile-school"
              name="school"
              className="form-input"
              value={values.school}
              onChange={handleChange}
              maxLength={160}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="profile-career-goal">
              Career goal
            </label>
            <input
              id="profile-career-goal"
              name="careerGoal"
              className="form-input"
              value={values.careerGoal}
              onChange={handleChange}
              maxLength={100}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="form-section">
        <legend>
          <FiTarget aria-hidden="true" /> Goals & interests
        </legend>
        <div className="form-grid">
          <div className="form-group field--full">
            <label className="form-label" htmlFor="profile-short-goal">
              Short-term goal
            </label>
            <textarea
              id="profile-short-goal"
              name="shortTermGoal"
              className="form-input form-textarea"
              rows={3}
              value={values.shortTermGoal}
              onChange={handleChange}
              maxLength={500}
            />
          </div>

          <div className="form-group field--full">
            <label className="form-label" htmlFor="profile-long-goal">
              Long-term goal
            </label>
            <textarea
              id="profile-long-goal"
              name="longTermGoal"
              className="form-input form-textarea"
              rows={3}
              value={values.longTermGoal}
              onChange={handleChange}
              maxLength={500}
            />
          </div>

          <div className="form-group field--full">
            <label className="form-label" htmlFor="profile-interests">
              Interests
            </label>
            <input
              id="profile-interests"
              name="interests"
              className="form-input"
              value={values.interests}
              onChange={handleChange}
              placeholder="Artificial Intelligence, Web Development"
            />
            <span className="form-hint">Separate each interest with a comma.</span>
          </div>
        </div>
      </fieldset>

      <fieldset className="form-section">
        <legend>
          <FiLink aria-hidden="true" /> Contact & links
        </legend>
        <div className="form-grid">
          <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
            <label className="form-label" htmlFor="profile-email">
              Public email
            </label>
            <input
              id="profile-email"
              name="email"
              className="form-input"
              type="email"
              value={values.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email ? (
              <span className="form-error">{errors.email}</span>
            ) : (
              <span className="form-hint">This address becomes public on the contact section.</span>
            )}
          </div>

          <div className={`form-group ${errors.linkedin ? 'has-error' : ''}`}>
            <label className="form-label" htmlFor="profile-linkedin">
              LinkedIn URL
            </label>
            <input
              id="profile-linkedin"
              name="linkedin"
              className="form-input"
              value={values.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/your-name"
              aria-invalid={Boolean(errors.linkedin)}
            />
            {errors.linkedin ? <span className="form-error">{errors.linkedin}</span> : null}
          </div>

          <div className={`form-group ${errors.github ? 'has-error' : ''}`}>
            <label className="form-label" htmlFor="profile-github">
              GitHub URL
            </label>
            <input
              id="profile-github"
              name="github"
              className="form-input"
              value={values.github}
              onChange={handleChange}
              placeholder="https://github.com/your-username"
              aria-invalid={Boolean(errors.github)}
            />
            {errors.github ? <span className="form-error">{errors.github}</span> : null}
          </div>

          <div className={`form-group ${errors.resumeUrl ? 'has-error' : ''}`}>
            <label className="form-label" htmlFor="profile-resume">
              Resume path
            </label>
            <input
              id="profile-resume"
              name="resumeUrl"
              className="form-input"
              value={values.resumeUrl}
              onChange={handleChange}
              placeholder="/resume.pdf"
              aria-invalid={Boolean(errors.resumeUrl)}
            />
            {errors.resumeUrl ? (
              <span className="form-error">{errors.resumeUrl}</span>
            ) : (
              <span className="form-hint">
                Keep <code>/resume.pdf</code> unless you store the file somewhere else.
              </span>
            )}
          </div>
        </div>

        <p className="form-note">
          Leave a link empty rather than typing a placeholder. Empty links are hidden across the
          website.
        </p>
      </fieldset>

      <div className="form-actions form-actions--sticky">
        <button type="button" className="btn btn--ghost" onClick={handleReset}>
          <FiRefreshCw aria-hidden="true" /> Reset changes
        </button>
        <button type="submit" className="btn btn--primary">
          <FiSave aria-hidden="true" /> Save profile
        </button>
      </div>
    </form>
  )
}
