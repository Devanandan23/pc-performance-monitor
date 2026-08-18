function MetricCard({ label, value, unit, detail, tone }) {
  return (
    <article className="metric-card">
      <div className="metric-card__top">
        <span className={`metric-icon metric-icon--${tone}`} aria-hidden="true" />
        <span>{label}</span>
      </div>
      <p className="metric-value">
        {value}
        <span>{unit}</span>
      </p>
      <p className="metric-detail">{detail}</p>
    </article>
  )
}

export default MetricCard
