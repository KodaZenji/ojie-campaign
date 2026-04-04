"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { FileText, MessageSquare, Mail, TrendingUp } from "lucide-react";

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        achievements: 0,
        wallPosts: 0,
        pendingApprovals: 0,
        messages: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                // Fetch achievements count
                const { count: achievementsCount } = await supabase
                    .from("achievements")
                    .select("*", { count: "exact", head: true });

                // Fetch wall posts count
                const { count: wallPostsCount } = await supabase
                    .from("wall_posts")
                    .select("*", { count: "exact", head: true });

                // Fetch pending approvals
                const { count: pendingCount } = await supabase
                    .from("wall_posts")
                    .select("*", { count: "exact", head: true })
                    .eq("is_approved", false);

                // Fetch messages count
                const { count: messagesCount } = await supabase
                    .from("contact_messages")
                    .select("*", { count: "exact", head: true });

                setStats({
                    achievements: achievementsCount || 0,
                    wallPosts: wallPostsCount || 0,
                    pendingApprovals: pendingCount || 0,
                    messages: messagesCount || 0,
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    const statCards = [
        {
            title: "Achievements",
            value: stats.achievements,
            icon: FileText,
            color: "bg-blue-500",
            href: "/admin/achievements",
        },
        {
            title: "Wall Posts",
            value: stats.wallPosts,
            icon: MessageSquare,
            color: "bg-green-500",
            href: "/admin/wall",
        },
        {
            title: "Pending Approval",
            value: stats.pendingApprovals,
            icon: TrendingUp,
            color: "bg-orange-500",
            href: "/admin/wall",
        },
        {
            title: "Messages",
            value: stats.messages,
            icon: Mail,
            color: "bg-purple-500",
            href: "/admin/messages",
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-green-main border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-semibold">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Welcome Section */}
            <div className="mb-8">
                <h3 className="font-oswald font-bold text-3xl text-gray-900 mb-2">
                    Welcome to Campaign Dashboard
                </h3>
                <p className="text-gray-600">
                    Manage achievements, moderate community posts, and track supporter engagement.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <a
                            key={stat.title}
                            href={stat.href}
                            className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all border border-gray-200"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                                    <Icon className="text-white" size={24} />
                                </div>
                                <TrendingUp className="text-gray-400" size={20} />
                            </div>
                            <p className="text-sm text-gray-500 font-semibold mb-1">{stat.title}</p>
                            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                        </a>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h4 className="font-oswald font-bold text-xl text-gray-900 mb-4">Quick Actions</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a
                        href="/admin/achievements"
                        className="flex items-center gap-3 p-4 bg-green-pale rounded-lg hover:bg-green-100 transition-colors"
                    >
                        <FileText className="text-green-main" size={20} />
                        <span className="font-semibold text-gray-900">Add New Achievement</span>
                    </a>
                    <a
                        href="/admin/wall"
                        className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                        <MessageSquare className="text-blue-600" size={20} />
                        <span className="font-semibold text-gray-900">Moderate Wall Posts</span>
                    </a>
                    <a
                        href="/admin/messages"
                        className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                        <Mail className="text-purple-600" size={20} />
                        <span className="font-semibold text-gray-900">View Messages</span>
                    </a>
                </div>
            </div>

            {/* Recent Activity Placeholder */}
            <div className="mt-8 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <h4 className="font-oswald font-bold text-xl text-gray-900 mb-4">
                    Recent Community Activity
                </h4>
                <p className="text-gray-500 text-sm">
                    Real-time updates will appear here when supporters post to the community wall.
                </p>
            </div>
        </div>
    );
}
