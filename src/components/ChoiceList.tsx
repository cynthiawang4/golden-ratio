import { useEffect, useState } from 'react'
import { useChoices } from '../store/useChoices'

export default function ChoiceList() {
  const { choices, load, addChoice, averages, winner } = useChoices()
  const [label, setLabel] = useState('')

  useEffect(() => { load() }, [])

  return (
    <div className="card">
      <h3>Choices</h3>
      <div className="choices">
        {choices.map((c) => (
          <div key={c.id} className="row">
            <div style={{ flex: 1 }}>{c.label}</div>
            <div style={{ minWidth: 80 }}>{averages()[c.id]?.toFixed(2) ?? '—'}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Add choice" />
        <button onClick={() => { if (label.trim()) { addChoice(label.trim()); setLabel('') } }} style={{ marginLeft: 8 }}>Add</button>
      </div>

      <div style={{ marginTop: 12 }}>
        <strong>Current winner:</strong> {winner()?.label ?? 'No votes yet'}
      </div>
    </div>
  )
}
