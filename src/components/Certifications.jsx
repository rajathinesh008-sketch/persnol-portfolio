import { FiAward, FiExternalLink, FiPlus } from 'react-icons/fi'
import { usePortfolio } from '../context/PortfolioContext'
import { formatMonth, safeLink } from '../utils/helpers'
import EmptyState from './ui/EmptyState'
import Reveal from './ui/Reveal'
import SectionHeader from './ui/SectionHeader'

export default function Certifications() {
  const { certificates } = usePortfolio()

  const addButton = (
    <a className="btn btn--soft btn--sm" href="#/admin/certificates">
      <FiPlus aria-hidden="true" /> Add certificate
    </a>
  )

  return (
    <section className="section" id="certifications">
      <div className="container">
        <Reveal>
          <SectionHeader
            eyebrow="Certifications & achievements"
            title="Learning that has been recognised."
            description="Certificates and achievements are listed only when they are genuinely earned."
            action={addButton}
          />
        </Reveal>

        {certificates.length ? (
          <div className="cert-grid">
            {certificates.map((certificate, index) => {
              const credential = safeLink(certificate.url)
              return (
                <Reveal key={certificate.id} delay={index * 70}>
                  <article className="cert-card glass">
                    <div className="cert-top">
                      <span className="cert-icon" aria-hidden="true">
                        <FiAward />
                      </span>
                      <span className="cert-date">
                        {certificate.date ? formatMonth(certificate.date) : 'Date not added'}
                      </span>
                    </div>
                    <h3 className="cert-title">{certificate.title}</h3>
                    <p className="cert-issuer">{certificate.issuer}</p>
                    {credential ? (
                      <a
                        className="cert-link"
                        href={credential}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        View credential <FiExternalLink aria-hidden="true" />
                      </a>
                    ) : null}
                  </article>
                </Reveal>
              )
            })}
          </div>
        ) : (
          <Reveal delay={80}>
            <EmptyState
              icon={FiAward}
              title="No certificates added yet"
              text="When I complete a course, workshop or certification, the real details will be added here. Nothing is invented."
              action={addButton}
            />
          </Reveal>
        )}
      </div>
    </section>
  )
}
