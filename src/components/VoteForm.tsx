import React, { useState } from 'react'
import { useChoices } from '../store/useChoices'

export default function VoteForm() {
  const { choices, addVote } = useChoices()
  const [scores, setScores] = useState<Record<string, number>>({})

  const handleChange = (id: string, value: string) => {
    const n = parseInt(value || '0', 10)
    setScores((s) => ({ ...s, [id]: isNaN(n) ? 0 : n }))
  }

  const submit = async () => {
    // For simplicity save one vote row per choice
    for (const c of choices) {
      const score = scores[c.id] ?? 0
      await addVote({ choice_id: c.id, score })
    }
    setScores({})
    alert('Vote recorded')
  }

  if (choices.length === 0) return null

  return (
    <div className="card">
      <h3>Cast a vote</h3>
      <div className="choices">
        {choices.map((c) => (
          <div key={c.id} className="row">
            <div style={{ flex: 1 }}>{c.label}</div>
            <input type="number" min={0} max={10} value={scores[c.id] ?? ''} onChange={(e) => handleChange(c.id, e.target.value)} style={{ width: 80 }} />
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12 }}>
        <button onClick={submit}>Submit Vote</button>
      </div>
    </div>
  )
}
