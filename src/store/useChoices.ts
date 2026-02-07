import create from 'zustand'
import { supabase } from '../lib/supabaseClient'

export type Choice = { id: string; label: string; poll_id: string }
export type Vote = { id: string; poll_id: string; choice_id: string; user_id?: string; score: number }
export type Poll = { id: string; owner_id: string; title: string }

type State = {
  user: { id: string; email?: string; name?: string } | null
  polls: Poll[]
  currentPollId: string | null
  choices: Choice[]
  votes: Vote[]
  loadPolls: () => Promise<void>
  selectPoll: (pollId: string | null) => Promise<void>
  createPoll: (title: string) => Promise<void>
  load: () => Promise<void>
  addChoice: (label: string) => Promise<void>
  addVote: (vote: Omit<Vote, 'id' | 'poll_id' | 'user_id'>) => Promise<void>
  averages: () => Record<string, number>
  winner: () => Choice | null
  setUser: (u: { id: string; email?: string; name?: string } | null) => void
}

export const useChoices = create<State>((set, get) => ({
  user: null,
  polls: [],
  currentPollId: null,
  choices: [],
  votes: [],
  setUser: (u) => set({ user: u }),
  loadPolls: async () => {
    const user = get().user
    if (!user) return
    const { data } = await supabase.from('polls').select('*').eq('owner_id', user.id)
    set({ polls: (data || []) as Poll[] })
  },
  createPoll: async (title) => {
    const user = get().user
    if (!user) throw new Error('Not signed in')
    const { data, error } = await supabase.from('polls').insert({ title, owner_id: user.id }).select().single()
    if (error) throw error
    set((s) => ({ polls: [...s.polls, data as Poll], currentPollId: (data as Poll).id }))
    // load choices/votes for new poll
    await get().load()
  },
  selectPoll: async (pollId) => {
    set({ currentPollId: pollId })
    await get().load()
  },
  load: async () => {
    const pollId = get().currentPollId
    if (!pollId) return
    const { data: choices } = await supabase.from('choices').select('*').eq('poll_id', pollId)
    const { data: votes } = await supabase.from('votes').select('*').eq('poll_id', pollId)
    set({ choices: (choices || []) as Choice[], votes: (votes || []) as Vote[] })
  },
  addChoice: async (label) => {
    const pollId = get().currentPollId
    if (!pollId) throw new Error('No poll selected')
    const { data, error } = await supabase.from('choices').insert({ label, poll_id: pollId }).select().single()
    if (error) throw error
    set((s) => ({ choices: [...s.choices, data as Choice] }))
  },
  addVote: async (vote) => {
    const pollId = get().currentPollId
    const user = get().user
    if (!pollId) throw new Error('No poll selected')
    const payload = { ...vote, poll_id: pollId, user_id: user?.id }
    const { data, error } = await supabase.from('votes').insert(payload).select().single()
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
