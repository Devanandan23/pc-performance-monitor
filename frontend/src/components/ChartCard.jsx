import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'

function ChartCard({ title, value, unit, color, data }) {
  return (
    <article className="chart-card">
      <div className="chart-card__header">
        <div>
          <p>{title}</p>
          <strong>{value}<span>{unit}</span></strong>
        </div>
        <span className="chart-live">LIVE</span>
      </div>
      <div className="chart-area">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`fill-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" hide />
            <Tooltip
              contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
              labelStyle={{ display: 'none' }}
              formatter={(currentValue) => [`${currentValue}${unit}`, title]}
            />
            <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#fill-${title})`} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </article>
  )
}

export default ChartCard
