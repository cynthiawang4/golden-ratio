import create from 'zustand'
import { supabase } from '../lib/supabaseClient'

export type Choice = { id: string; label: string }
export type Vote = { id: string; choice_id: string; score: number }

type State = {
  choices: Choice[]
  votes: Vote[]
  load: () => Promise<void>
  addChoice: (label: string) => Promise<void>
  addVote: (vote: Omit<Vote, 'id'>) => Promise<void>
  averages: () => Record<string, number>
  winner: () => Choice | null
}

export const useChoices = create<State>((set, get) => ({
  choices: [],
  votes: [],
  load: async () => {
    const { data: choices } = await supabase.from('choices').select('*')
    const { data: votes } = await supabase.from('votes').select('*')
    set({ choices: (choices || []) as Choice[], votes: (votes || []) as Vote[] })
  },
  addChoice: async (label: string) => {
    const { data, error } = await supabase.from('choices').insert({ label }).select().single()
    if (error) throw error
    set((s) => ({ choices: [...s.choices, data as Choice] }))
  },
  addVote: async (vote) => {
    const { data, error } = await supabase.from('votes').insert(vote).select().single()
    if (error) throw error
    set((s) => ({ votes: [...s.votes, data as Vote] }))
  },
  averages: () => {
    const votes = get().votes
    const sums: Record<string, { total: number; count: number }> = {}
    for (const v of votes) {
      if (!sums[v.choice_id]) sums[v.choice_id] = { total: 0, count: 0 }
      sums[v.choice_id].total += v.score
      sums[v.choice_id].count += 1
    }
    const out: Record<string, number> = {}
    for (const id of Object.keys(sums)) out[id] = sums[id].total / sums[id].count
    return out
  },
  winner: () => {
    const avgs = get().averages()
    const choices = get().choices
    let bestId: string | null = null
    let bestScore = -Infinity
    for (const id of Object.keys(avgs)) {
      if (avgs[id] > bestScore) {
        bestScore = avgs[id]
        bestId = id
      }
    }
    return choices.find((c) => c.id === bestId) || null
  },
}))
