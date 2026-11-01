import { FiInbox } from 'react-icons/fi'

export default function EmptyState({ icon: Icon = FiInbox, title, text, action }) {
  return (
    <div className="empty-state">
      <span className="empty-icon" aria-hidden="true">
        <Icon />
      </span>
      <h3>{title}</h3>
      {text ? <p>{text}</p> : null}
      {action ? <div className="empty-action">{action}</div> : null}
    </div>
  )
}
