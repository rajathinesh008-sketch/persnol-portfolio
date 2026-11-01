import {
  FiArrowRight,
  FiAward,
  FiBookOpen,
  FiMapPin,
  FiTarget,
  FiTrendingUp,
  FiZap,
} from 'react-icons/fi'
import { usePortfolio } from '../context/PortfolioContext'
import ProfileImage from './ui/ProfileImage'
import Reveal from './ui/Reveal'
import SectionHeader from './ui/SectionHeader'

export default function About() {
  const { profile } = usePortfolio()

  const details = [
    { icon: FiMapPin, label: 'Location', value: profile.location },
    { icon: FiBookOpen, label: 'Degree', value: `${profile.degree} · ${profile.year}` },
    { icon: FiAward, label: 'College', value: profile.college },
    { icon: FiTarget, label: 'Career goal', value: profile.careerGoal },
  ]

  return (
    <section className="section" id="about">
      <div className="container">
        <Reveal>
          <SectionHeader
            eyebrow="About me"
            title="A student developer with a curious mind."
            description="Learning the fundamentals, building real things and improving one step at a time."
          />
        </Reveal>

        <div className="about-grid">
          <Reveal className="about-card-wrap" delay={60}>
            <article className="profile-card glass">
              <div className="profile-card-top">
                <ProfileImage
                  src={profile.photo}
                  alt={profile.name}
                  initials={profile.initials}
                  className="profile-avatar"
                />
                <div>
                  <h3>{profile.name}</h3>
                  <p>{profile.headline}</p>
                  <span className="availability">
                    <span className="status-dot" aria-hidden="true" />
                    {profile.availability}
                  </span>
                </div>
              </div>

              <dl className="info-list">
                {details.map(({ icon: Icon, label, value }) => (
                  <div className="info-row" key={label}>
                    <span className="info-icon" aria-hidden="true">
                      <Icon />
                    </span>
                    <div>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>

              <div className="interest-block">
                <h4>Interests</h4>
                <div className="interest-tags">
                  {profile.interests.map((interest) => (
                    <span className="tag" key={interest}>
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </Reveal>

          <Reveal className="about-copy" delay={130}>
            <h3 className="about-heading">
              I&apos;m at the beginning of my journey — and I&apos;m building with purpose.
            </h3>
            <p className="lead">{profile.intro}</p>
            <p>{profile.bio}</p>

            <div className="about-academics">
              <span className="academics-icon" aria-hidden="true">
                <FiBookOpen />
              </span>
              <div>
                <h4>Academic background</h4>
                <p>
                  Currently pursuing <strong>{profile.degree}</strong> at{' '}
                  <strong>{profile.college}</strong>. I completed my higher secondary
                  education at <strong>{profile.school}</strong>.
                </p>
              </div>
            </div>

            <div className="objective-grid">
              <article className="objective-card">
                <span className="objective-icon" aria-hidden="true">
                  <FiZap />
                </span>
                <h4>Short-term goal</h4>
                <p>{profile.shortTermGoal}</p>
              </article>
              <article className="objective-card">
                <span className="objective-icon" aria-hidden="true">
                  <FiTrendingUp />
                </span>
                <h4>Long-term goal</h4>
                <p>{profile.longTermGoal}</p>
              </article>
            </div>

            <div className="about-links">
              <a className="text-link" href="#skills">
                See what I&apos;m learning <FiArrowRight aria-hidden="true" />
              </a>
              <a className="text-link" href="#contact">
                Get in touch <FiArrowRight aria-hidden="true" />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
