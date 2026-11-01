export default function SectionHeader({ eyebrow, title, description, action }) {
  return (
    <div className="section-head">
      <div className="section-head-copy">
        <span className="section-eyebrow">
          <span className="eyebrow-dot" aria-hidden="true" />
          {eyebrow}
        </span>
        <h2 className="section-title">{title}</h2>
        {description ? <p className="section-sub">{description}</p> : null}
      </div>
      {action ? <div className="section-action">{action}</div> : null}
    </div>
  )
}
