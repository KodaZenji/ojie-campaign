"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Heart, Send } from "lucide-react";

interface WallPost {
    id: string;
    name: string;
    message: string;
    created_at: string;
}

export default function CommunityWall() {
    const [posts, setPosts] = useState<WallPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        fetchPosts();

        // Real-time updates (optional - fails gracefully if realtime not enabled)
        let channel: any;
        try {
            channel = supabase
                .channel('community-wall')
                .on('postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'wall_posts',
                        filter: `is_approved=eq.true`
                    },
                    (payload) => {
                        // Add new post to the list
                        const newPost = payload.new as WallPost;
                        setPosts(prev => [newPost, ...prev]);
                    }
                )
                .subscribe();
        } catch (error) {
            console.log('ℹ️ Realtime updates disabled - page refresh needed for new posts');
        }

        return () => {
            if (channel) {
                supabase.removeChannel(channel);
            }
        };
    }, []);

    async function fetchPosts() {
        try {
            const { data, error } = await supabase
                .from("wall_posts")
                .select("*")
                .eq("is_approved", true)
                .eq("is_hidden", false)
                .order("created_at", { ascending: false })
                .limit(20);

            if (error) throw error;
            setPosts(data || []);
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!formData.name || !formData.message) return;

        setSubmitting(true);

        try {
            const { error } = await supabase
                .from("wall_posts")
                .insert([{
                    name: formData.name,
                    phone: formData.phone,
                    message: formData.message,
                    is_approved: false, // Requires admin approval
                }]);

            if (error) throw error;

            setSubmitted(true);
            setFormData({ name: "", phone: "", message: "" });
            setTimeout(() => {
                setSubmitted(false);
                setShowForm(false);
            }, 3000);
        } catch (error) {
            console.error("Error submitting post:", error);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section className="bg-gray-50 px-5 py-14">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <p className="text-sm text-green-main font-bold tracking-widest uppercase mb-3">
                        Voices of Igueben
                    </p>
                    <h2 className="font-oswald font-bold text-3xl md:text-4xl text-gray-900 mb-3">
                        Community Wall
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Hear from supporters across our constituency. Share your message of support for Hon. Ojie.
                    </p>
                </div>

                {/* Submit Button / Form */}
                <div className="max-w-2xl mx-auto mb-12">
                    {!showForm ? (
                        <button
                            onClick={() => setShowForm(true)}
                            className="w-full bg-green-main text-white font-oswald font-bold py-4 rounded-lg
                         hover:brightness-110 transition-all flex items-center justify-center gap-3"
                        >
                            <Heart size={20} fill="currentColor" />
                            Share Your Support
                        </button>
                    ) : (
                        <div className="bg-white rounded-lg p-6 shadow-lg border-2 border-green-main">
                            {submitted ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Heart className="text-green-main" size={32} fill="currentColor" />
                                    </div>
                                    <h3 className="font-oswald font-bold text-xl text-gray-900 mb-2">
                                        Thank You for Your Support!
                                    </h3>
                                    <p className="text-gray-600">
                                        Your message will appear on the wall after moderation.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Your Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Enter your full name"
                                            required
                                            className="w-full border border-gray-300 rounded px-4 py-3 outline-none focus:border-green-main focus:ring-2 focus:ring-green-pale"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Phone Number (optional)
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="+234 XXX XXX XXXX"
                                            className="w-full border border-gray-300 rounded px-4 py-3 outline-none focus:border-green-main focus:ring-2 focus:ring-green-pale"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Your Message *
                                        </label>
                                        <textarea
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            placeholder="Share why you support Hon. Ojie..."
                                            rows={4}
                                            required
                                            className="w-full border border-gray-300 rounded px-4 py-3 outline-none focus:border-green-main focus:ring-2 focus:ring-green-pale resize-none"
                                        />
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="flex-1 bg-green-main text-white font-oswald font-bold py-3 rounded-lg
                                 hover:brightness-110 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                                        >
                                            <Send size={18} />
                                            {submitting ? "Submitting..." : "Submit Message"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowForm(false)}
                                            className="px-6 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}
                </div>

                {/* Wall Posts Grid */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block w-12 h-12 border-4 border-green-main border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-600 font-semibold mt-4">Loading messages...</p>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                        <Heart className="mx-auto mb-4 text-gray-300" size={48} />
                        <p className="text-gray-500 font-semibold text-lg">Be the first amongst your friends to share your support!</p>
                        <p className="text-gray-400 text-sm mt-2">
                            Click the button above to post a message
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {posts.map((post) => (
                            <div
                                key={post.id}
                                className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 hover:shadow-md transition-all"
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 bg-green-main rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold text-xs">
                                            {post.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm text-gray-900">{post.name}</p>
                                        <p className="text-xs text-gray-400">
                                            {new Date(post.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-gray-700 text-sm leading-relaxed italic">
                                    "{post.message}"
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
