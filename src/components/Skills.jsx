import { FiInfo } from 'react-icons/fi'
import { SKILLS, SKILL_NOTE } from '../data/skills'
import { useInView } from '../hooks/useInView'
import Reveal from './ui/Reveal'
import SectionHeader from './ui/SectionHeader'

function SkillCard({ skill, index }) {
  const [ref, inView] = useInView({ threshold: 0.35 })
  const Icon = skill.icon
  const numericLevel = Math.max(0, Math.min(100, skill.level))

  return (
    <article
      ref={ref}
      className={`skill-card glass ${inView ? 'is-visible' : ''}`}
      style={{
        '--skill-color': skill.color,
        '--skill-level': `${numericLevel}%`,
        '--card-delay': `${index * 60}ms`,
      }}
    >
      <div className="skill-head">
        <span className="skill-icon" aria-hidden="true">
          <Icon />
        </span>
        <span className="skill-category">{skill.category}</span>
      </div>

      <div className="skill-title-row">
        <h3>{skill.name}</h3>
        <span className={`skill-level ${numericLevel >= 60 ? 'is-open' : ''}`}>{skill.label}</span>
      </div>

      <p className="skill-desc">{skill.description}</p>

      <div
        className="skill-progress"
        role="progressbar"
        aria-label={`${skill.name} self-assessed level`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={numericLevel}
      >
        <span className="progress-track">
          <span className="progress-fill" />
        </span>
        <span className="progress-value">{numericLevel}%</span>
      </div>
    </article>
  )
}

export default function Skills() {
  return (
    <section className="section" id="skills">
      <div className="container">
        <Reveal>
          <SectionHeader
            eyebrow="Technical skills"
            title="Tools I'm learning and using."
            description="An honest snapshot of my current skills — some are comfortable, others are still growing."
            action={
              <div className="skills-legend" aria-label="Skill level legend">
                <span>
                  <i className="legend-dot legend-dot--learning" /> Learning
                </span>
                <span>
                  <i className="legend-dot legend-dot--open" /> Comfortable
                </span>
              </div>
            }
          />
        </Reveal>

        <div className="skills-grid">
          {SKILLS.map((skill, index) => (
            <SkillCard key={skill.id} skill={skill} index={index} />
          ))}
        </div>

        <Reveal delay={150}>
          <aside className="skills-note glass">
            <FiInfo aria-hidden="true" />
            <p>{SKILL_NOTE}</p>
          </aside>
        </Reveal>
      </div>
    </section>
  )
}
