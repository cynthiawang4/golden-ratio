import React, { useEffect, useState } from 'react'
import { useChoices } from '../store/useChoices'

export default function PollList() {
  const { polls, loadPolls, createPoll, selectPoll, currentPollId } = useChoices()
  const [title, setTitle] = useState('')

  useEffect(() => { loadPolls() }, [])

  return (
    <div className="card">
      <h3>Your Polls</h3>
      <div className="choices">
        {polls.map((p) => (
          <div key={p.id} className="row">
            <div style={{ flex: 1 }}>{p.title}</div>
            <button onClick={() => selectPoll(p.id)} disabled={currentPollId === p.id}>Select</button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New poll title" />
        <button onClick={() => { if (title.trim()) { createPoll(title.trim()); setTitle('') } }} style={{ marginLeft: 8 }}>Create</button>
      </div>
    </div>
  )
}
