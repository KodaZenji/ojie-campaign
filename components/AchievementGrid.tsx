"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AchievementCard from "./AchievementCard";

interface Achievement {
  id: string;
  date: string;
  location: string;
  headline: string;
  body: string;
  reaction: string;
  image_url: string | null;
  reaction_count: number;
}

export default function AchievementGrid() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAchievements() {
      try {
        const { data, error } = await supabase
          .from("achievements")
          .select("*")
          .eq("is_published", true)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setAchievements(data || []);
      } catch (error) {
        console.error("Error fetching achievements:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAchievements();
  }, []);

  async function handleReact(id: string) {
    // Optimistically update UI
    setAchievements((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, reaction_count: (a.reaction_count || 0) + 1 } : a
      )
    );

    // Persist to Supabase using an RPC increment to avoid race conditions
    const { error } = await supabase.rpc("increment_reaction", { achievement_id: id });

    if (error) {
      console.error("Failed to save reaction:", error);
      // Roll back optimistic update on failure
      setAchievements((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, reaction_count: (a.reaction_count || 1) - 1 } : a
        )
      );
    }
  }

  if (loading) {
    return (
      <section id="record" className="section-pad bg-white">
        <div className="max-w-5xl mx-auto text-center py-12">
          <div className="w-12 h-12 border-4 border-green-main border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading achievements...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="record" className="section-pad bg-white">
      <div className="max-w-5xl mx-auto">
        <p className="eyebrow">His Track Record</p>
        <h2 className="section-title">His Work Speaks For Itself</h2>
        <div className="green-rule" />

        {achievements.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Achievements will be displayed here soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {achievements.map((a) => (
              <AchievementCard
                key={a.id}
                id={a.id}
                date={a.date}
                location={a.location}
                headline={a.headline}
                body={a.body}
                reaction={a.reaction}
                reactionCount={a.reaction_count || 0}
                image={a.image_url || undefined}
                onReact={handleReact}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
