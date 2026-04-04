"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Check, X, Eye, Trash2 } from "lucide-react";

interface WallPost {
    id: string;
    name: string;
    message: string;
    phone: string | null;
    is_approved: boolean;
    is_hidden: boolean;
    created_at: string;
}

export default function AdminWallPage() {
    const [posts, setPosts] = useState<WallPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "pending" | "approved">("pending");

    useEffect(() => {
        fetchPosts();

        // Set up realtime subscription (optional - fails gracefully)
        let channel: any;
        try {
            channel = supabase
                .channel('wall-posts')
                .on('postgres_changes',
                    { event: '*', schema: 'public', table: 'wall_posts' },
                    () => {
                        fetchPosts(); // Refresh when changes occur
                    }
                )
                .subscribe();
        } catch (error) {
            console.log('ℹ️ Realtime updates disabled - manual refresh needed');
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
                .order("created_at", { ascending: false });

            if (error) throw error;
            setPosts(data || []);
        } catch (error) {
            console.error("Error fetching wall posts:", error);
        } finally {
            setLoading(false);
        }
    }

    async function approvePost(id: string) {
        try {
            const { error } = await supabase
                .from("wall_posts")
                .update({ is_approved: true, is_hidden: false })
                .eq("id", id);

            if (error) throw error;
            await fetchPosts();
        } catch (error) {
            console.error("Error approving post:", error);
        }
    }

    async function hidePost(id: string) {
        try {
            const { error } = await supabase
                .from("wall_posts")
                .update({ is_hidden: true })
                .eq("id", id);

            if (error) throw error;
            await fetchPosts();
        } catch (error) {
            console.error("Error hiding post:", error);
        }
    }

    async function deletePost(id: string) {
        if (!confirm("Are you sure you want to delete this post?")) return;

        try {
            const { error } = await supabase
                .from("wall_posts")
                .delete()
                .eq("id", id);

            if (error) throw error;
            await fetchPosts();
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    }

    const filteredPosts = posts.filter(post => {
        if (filter === "pending") return !post.is_approved;
        if (filter === "approved") return post.is_approved && !post.is_hidden;
        return true;
    });

    if (loading) {
        return <div className="text-center py-12">Loading wall posts...</div>;
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h3 className="font-oswald font-bold text-2xl text-gray-900 mb-2">Community Wall</h3>
                <p className="text-gray-600 text-sm">Moderate supporter messages and testimonials</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-3 mb-6">
                <button
                    onClick={() => setFilter("pending")}
                    className={`px-5 py-2 rounded-lg font-semibold transition-all ${filter === "pending"
                        ? "bg-orange-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                >
                    Pending ({posts.filter(p => !p.is_approved).length})
                </button>
                <button
                    onClick={() => setFilter("approved")}
                    className={`px-5 py-2 rounded-lg font-semibold transition-all ${filter === "approved"
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                >
                    Approved ({posts.filter(p => p.is_approved && !p.is_hidden).length})
                </button>
                <button
                    onClick={() => setFilter("all")}
                    className={`px-5 py-2 rounded-lg font-semibold transition-all ${filter === "all"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                >
                    All Posts
                </button>
            </div>

            {/* Posts List */}
            <div className="space-y-4">
                {filteredPosts.length === 0 ? (
                    <div className="bg-white rounded-lg p-8 text-center border border-gray-200">
                        <p className="text-gray-500">No posts found in this category.</p>
                    </div>
                ) : (
                    filteredPosts.map((post) => (
                        <div
                            key={post.id}
                            className="bg-white rounded-lg p-5 shadow-sm border border-gray-200"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h4 className="font-bold text-gray-900">{post.name}</h4>
                                        {post.phone && (
                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                📱 {post.phone}
                                            </span>
                                        )}
                                        <span className="text-xs text-gray-400">
                                            {new Date(post.created_at).toLocaleDateString()}
                                        </span>
                                        {post.is_approved && !post.is_hidden && (
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-semibold">
                                                ✓ Published
                                            </span>
                                        )}
                                        {post.is_hidden && (
                                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-semibold">
                                                ✗ Hidden
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">{post.message}</p>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    {!post.is_approved ? (
                                        <>
                                            <button
                                                onClick={() => approvePost(post.id)}
                                                className="flex items-center gap-1 bg-green-500 text-white px-4 py-2 rounded-lg 
                                   hover:bg-green-600 transition-colors font-semibold text-sm"
                                                title="Approve"
                                            >
                                                <Check size={18} />
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => deletePost(post.id)}
                                                className="p-2 hover:bg-red-50 rounded transition-colors text-red-600"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => hidePost(post.id)}
                                                className="p-2 hover:bg-orange-50 rounded transition-colors text-orange-600"
                                                title="Hide"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => deletePost(post.id)}
                                                className="p-2 hover:bg-red-50 rounded transition-colors text-red-600"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
