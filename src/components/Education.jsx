import { FiAward, FiBookOpen, FiCompass } from 'react-icons/fi'
import { usePortfolio } from '../context/PortfolioContext'
import Reveal from './ui/Reveal'
import SectionHeader from './ui/SectionHeader'

export default function Education() {
  const { profile } = usePortfolio()

  const items = [
    {
      icon: FiBookOpen,
      badge: `Pursuing · ${profile.year}`,
      title: profile.degree,
      organization: profile.college,
      description:
        'Building a foundation in programming, data structures, web development and problem solving through coursework and hands-on practice.',
      meta: 'Pudukkottai, Tamil Nadu',
    },
    {
      icon: FiAward,
      badge: 'Completed',
      title: 'Higher Secondary Education',
      organization: profile.school,
      description:
        'Completed higher secondary schooling in Pudukkottai and developed an early interest in computers and technology.',
      meta: 'Pudukkottai, Tamil Nadu',
    },
  ]

  return (
    <section className="section section--alt" id="education">
      <div className="container">
        <Reveal>
          <SectionHeader
            eyebrow="Education"
            title="My learning journey."
            description="The academic path that is shaping me into a software developer."
          />
        </Reveal>

        <ol className="timeline">
          {items.map((item, index) => {
            const Icon = item.icon
            return (
              <Reveal as="li" className="timeline-item" key={item.title} delay={index * 120}>
                <div className="timeline-marker" aria-hidden="true">
                  <Icon />
                </div>
                <article className="timeline-card glass">
                  <div className="timeline-top">
                    <span className={`timeline-badge ${index === 0 ? 'is-current' : ''}`}>
                      {index === 0 ? <span className="status-dot" aria-hidden="true" /> : null}
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="timeline-title">{item.title}</h3>
                  <p className="timeline-org">{item.organization}</p>
                  <p className="timeline-desc">{item.description}</p>
                  <p className="timeline-meta">{item.meta}</p>
                </article>
              </Reveal>
            )
          })}
        </ol>

        <Reveal delay={200}>
          <aside className="education-note glass">
            <span className="note-icon" aria-hidden="true">
              <FiCompass />
            </span>
            <p>
              <strong>Currently exploring:</strong> artificial intelligence, web development,
              software development and problem solving — with a focus on learning by building.
            </p>
          </aside>
        </Reveal>
      </div>
    </section>
  )
}
