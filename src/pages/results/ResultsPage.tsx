import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase, auth } from "../../lib/supabaseClient";

export default function ResultsPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [results, setResults] = useState<Array<{ id: string; label: string; score: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roomId) return;
    (async () => {
      setLoading(true);
      const { data: poll } = await supabase.from("polls").select("owner_id").eq("id", roomId).single();
      setOwnerId((poll as any)?.owner_id ?? null);
      const { data: userData } = await auth.getUser();
      setUser((userData as any)?.user ?? null);

      // fetch choices and aggregate scores
      const { data: choices } = await supabase.from("choices").select("id, label").eq("poll_id", roomId);
      const list = (choices as any) || [];
      const computed = [] as any[];
      for (const c of list) {
        const { data: votes } = await supabase.from("votes").select("score").eq("choice_id", c.id);
        const total = (votes as any[] || []).reduce((acc, v) => acc + (v.score || 0), 0);
        computed.push({ id: c.id, label: c.label, score: total });
      }
      computed.sort((a, b) => b.score - a.score);
      setResults(computed);
      setLoading(false);
    })();
  }, [roomId]);

  if (!roomId) return <div>No poll specified</div>;

  if (loading) return <div>Loading...</div>;

  if (!user || ownerId !== user.id) {
    return <div>Only the poll host can view the results. Please sign in as the host.</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Results</h2>
      <ol>
        {results.map((r) => (
          <li key={r.id}>{r.label} — {r.score}</li>
        ))}
      </ol>
      <button onClick={() => navigate(`/choice/${roomId}`)}>Back to choices</button>
    </div>
  );
}
