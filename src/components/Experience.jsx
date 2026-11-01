import {
  FiAward,
  FiBriefcase,
  FiCalendar,
  FiCode,
  FiMapPin,
  FiPlus,
  FiStar,
  FiZap,
} from 'react-icons/fi'
import { usePortfolio } from '../context/PortfolioContext'
import { formatRange } from '../utils/helpers'
import EmptyState from './ui/EmptyState'
import Reveal from './ui/Reveal'
import SectionHeader from './ui/SectionHeader'

const TYPE_ICONS = {
  Internship: FiBriefcase,
  Workshop: FiCode,
  Hackathon: FiZap,
  'Technical Event': FiCalendar,
  Course: FiAward,
  Volunteering: FiStar,
  Other: FiStar,
}

export default function Experience() {
  const { experience } = usePortfolio()

  const addButton = (
    <a className="btn btn--soft btn--sm" href="#/admin/experience">
      <FiPlus aria-hidden="true" /> Add experience
    </a>
  )

  return (
    <section className="section section--alt" id="experience">
      <div className="container">
        <Reveal>
          <SectionHeader
            eyebrow="Internships & experience"
            title="Where I learn by doing."
            description="Internships, workshops, hackathons and technical events I have genuinely taken part in."
            action={addButton}
          />
        </Reveal>

        {experience.length ? (
          <ol className="timeline experience-timeline">
            {experience.map((item, index) => {
              const Icon = TYPE_ICONS[item.type] || FiStar
              const dates = formatRange(item.start, item.end, item.current)
              return (
                <Reveal as="li" className="timeline-item" key={item.id} delay={index * 80}>
                  <div className="timeline-marker" aria-hidden="true">
                    <Icon />
                  </div>
                  <article className="timeline-card glass exp-card">
                    <div className="exp-top">
                      <span className="exp-type">{item.type}</span>
                      {dates ? <span className="exp-dates">{dates}</span> : null}
                    </div>
                    <h3 className="timeline-title">{item.role}</h3>
                    <p className="timeline-org">{item.organization}</p>
                    {item.location ? (
                      <p className="exp-location">
                        <FiMapPin aria-hidden="true" /> {item.location}
                      </p>
                    ) : null}
                    {item.description ? <p className="timeline-desc">{item.description}</p> : null}
                  </article>
                </Reveal>
              )
            })}
          </ol>
        ) : (
          <Reveal delay={80}>
            <EmptyState
              icon={FiBriefcase}
              title="No experience added yet"
              text="I only list internships, workshops, hackathons and technical events that I have actually attended. This section will grow with real experience."
              action={addButton}
            />
          </Reveal>
        )}
      </div>
    </section>
  )
}
