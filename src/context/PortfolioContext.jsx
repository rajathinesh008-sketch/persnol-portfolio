import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { DEFAULT_PROFILE, EMPTY_COLLECTIONS, STORAGE_KEYS } from '../data/defaults'
import { uid } from '../utils/helpers'
import { useToast } from './ToastContext'

const PortfolioContext = createContext(null)

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

function readProfile() {
  const stored = readJson(STORAGE_KEYS.profile, {})
  const merged = { ...DEFAULT_PROFILE, ...(stored && typeof stored === 'object' ? stored : {}) }
  return {
    ...merged,
    roles: Array.isArray(merged.roles) && merged.roles.length ? merged.roles : DEFAULT_PROFILE.roles,
    interests: Array.isArray(merged.interests) ? merged.interests : DEFAULT_PROFILE.interests,
  }
}

function readCollection(key) {
  const stored = readJson(key, [])
  return Array.isArray(stored) ? stored : []
}

function cleanProject(project) {
  return {
    id: project.id || uid('project'),
    title: String(project.title || '').trim(),
    description: String(project.description || '').trim(),
    technologies: Array.isArray(project.technologies) ? project.technologies : [],
    image: String(project.image || '').trim(),
    github: String(project.github || '').trim(),
    demo: String(project.demo || '').trim(),
    createdAt: project.createdAt || new Date().toISOString(),
  }
}

function cleanCertificate(certificate) {
  return {
    id: certificate.id || uid('certificate'),
    title: String(certificate.title || '').trim(),
    issuer: String(certificate.issuer || '').trim(),
    date: String(certificate.date || '').trim(),
    url: String(certificate.url || '').trim(),
    createdAt: certificate.createdAt || new Date().toISOString(),
  }
}

function cleanExperience(experience) {
  return {
    id: experience.id || uid('experience'),
    role: String(experience.role || '').trim(),
    organization: String(experience.organization || '').trim(),
    type: String(experience.type || 'Internship').trim(),
    start: String(experience.start || '').trim(),
    end: String(experience.end || '').trim(),
    current: Boolean(experience.current),
    location: String(experience.location || '').trim(),
    description: String(experience.description || '').trim(),
    createdAt: experience.createdAt || new Date().toISOString(),
  }
}

export function PortfolioProvider({ children }) {
  const { addToast } = useToast()
  const [profile, setProfile] = useState(readProfile)
  const [projects, setProjects] = useState(() => readCollection(STORAGE_KEYS.projects))
  const [certificates, setCertificates] = useState(() => readCollection(STORAGE_KEYS.certificates))
  const [experience, setExperience] = useState(() => readCollection(STORAGE_KEYS.experience))

  // Persist each slice independently. A quota error is surfaced as a toast.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile))
    } catch {
      addToast('Could not save your profile. Browser storage may be full.', 'error')
    }
  }, [profile, addToast])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(projects))
    } catch {
      addToast('Could not save projects. Browser storage may be full.', 'error')
    }
  }, [projects, addToast])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.certificates, JSON.stringify(certificates))
    } catch {
      addToast('Could not save certificates. Browser storage may be full.', 'error')
    }
  }, [certificates, addToast])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.experience, JSON.stringify(experience))
    } catch {
      addToast('Could not save experience. Browser storage may be full.', 'error')
    }
  }, [experience, addToast])

  // Keep other open tabs in sync when the data is edited.
  useEffect(() => {
    function onStorage(event) {
      if (!event.key) return
      try {
        if (event.key === STORAGE_KEYS.profile && event.newValue) {
          setProfile({ ...DEFAULT_PROFILE, ...JSON.parse(event.newValue) })
        }
        if (event.key === STORAGE_KEYS.projects && event.newValue) {
          const next = JSON.parse(event.newValue)
          if (Array.isArray(next)) setProjects(next)
        }
        if (event.key === STORAGE_KEYS.certificates && event.newValue) {
          const next = JSON.parse(event.newValue)
          if (Array.isArray(next)) setCertificates(next)
        }
        if (event.key === STORAGE_KEYS.experience && event.newValue) {
          const next = JSON.parse(event.newValue)
          if (Array.isArray(next)) setExperience(next)
        }
      } catch {
        /* ignore malformed cross-tab data */
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const updateProfile = useCallback((patch) => {
    setProfile((current) => ({ ...current, ...patch }))
  }, [])

  const addProject = useCallback((project) => {
    setProjects((current) => [cleanProject(project), ...current])
  }, [])

  const updateProject = useCallback((id, project) => {
    setProjects((current) =>
      current.map((item) => (item.id === id ? cleanProject({ ...item, ...project, id }) : item)),
    )
  }, [])

  const deleteProject = useCallback((id) => {
    setProjects((current) => current.filter((item) => item.id !== id))
  }, [])

  const addCertificate = useCallback((certificate) => {
    setCertificates((current) => [cleanCertificate(certificate), ...current])
  }, [])

  const updateCertificate = useCallback((id, certificate) => {
    setCertificates((current) =>
      current.map((item) =>
        item.id === id ? cleanCertificate({ ...item, ...certificate, id }) : item,
      ),
    )
  }, [])

  const deleteCertificate = useCallback((id) => {
    setCertificates((current) => current.filter((item) => item.id !== id))
  }, [])

  const addExperience = useCallback((item) => {
    setExperience((current) => [cleanExperience(item), ...current])
  }, [])

  const updateExperience = useCallback((id, item) => {
    setExperience((current) =>
      current.map((entry) => (entry.id === id ? cleanExperience({ ...entry, ...item, id }) : entry)),
    )
  }, [])

  const deleteExperience = useCallback((id) => {
    setExperience((current) => current.filter((item) => item.id !== id))
  }, [])

  const exportData = useCallback(
    () => ({
      app: 'dineshraja-portfolio',
      version: 1,
      exportedAt: new Date().toISOString(),
      profile,
      projects,
      certificates,
      experience,
    }),
    [profile, projects, certificates, experience],
  )

  const importData = useCallback((data) => {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      throw new Error('This file does not look like a portfolio backup.')
    }
    if (!data.profile || typeof data.profile !== 'object') {
      throw new Error('The backup is missing profile details.')
    }
    setProfile({
      ...DEFAULT_PROFILE,
      ...data.profile,
      roles: Array.isArray(data.profile.roles) ? data.profile.roles : DEFAULT_PROFILE.roles,
      interests: Array.isArray(data.profile.interests)
        ? data.profile.interests
        : DEFAULT_PROFILE.interests,
    })
    setProjects(Array.isArray(data.projects) ? data.projects.map(cleanProject) : [])
    setCertificates(
      Array.isArray(data.certificates) ? data.certificates.map(cleanCertificate) : [],
    )
    setExperience(Array.isArray(data.experience) ? data.experience.map(cleanExperience) : [])
  }, [])

  const resetAll = useCallback(() => {
    setProfile({ ...DEFAULT_PROFILE, roles: [...DEFAULT_PROFILE.roles], interests: [...DEFAULT_PROFILE.interests] })
    setProjects([...EMPTY_COLLECTIONS.projects])
    setCertificates([...EMPTY_COLLECTIONS.certificates])
    setExperience([...EMPTY_COLLECTIONS.experience])
  }, [])

  const value = useMemo(
    () => ({
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
    }),
    [
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
    ],
  )

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>
}

export function usePortfolio() {
  const context = useContext(PortfolioContext)
  if (!context) throw new Error('usePortfolio must be used inside PortfolioProvider')
  return context
}
