"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, signOut } from "@/lib/supabase";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard, FileText, MessageSquare,
    Mail, LogOut, User, Menu, X
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);
    const [userEmail, setUserEmail] = useState<string>("");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        async function checkAuth() {
            try {
                const session = await getSession();
                if (!session) { router.push("/admin/login"); return; }
                setUserEmail(session.user.email || "");
            } catch { router.push("/admin/login"); }
            finally { setLoading(false); }
        }
        checkAuth();
    }, [router]);

    // Close sidebar on route change
    useEffect(() => { setSidebarOpen(false); }, [pathname]);

    async function handleSignOut() {
        await signOut();
        router.push("/admin/login");
    }

    const navItems = [
        { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/achievements", label: "Achievements", icon: FileText },
        { href: "/admin/wall", label: "Community Wall", icon: MessageSquare },
        { href: "/admin/messages", label: "Messages", icon: Mail },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-green-main border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-semibold">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            <div className="p-6 border-b border-green-mid">
                <h1 className="font-oswald font-bold text-xl mb-1">Media Team</h1>
                <p className="text-green-muted text-xs">Hon. Ojie Inegbeboh</p>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                                ${isActive
                                    ? "bg-gold text-gold-dark font-semibold"
                                    : "text-green-muted hover:bg-green-mid hover:text-white"
                                }`}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t border-green-mid">
                <div className="flex items-center gap-3 mb-4 px-4">
                    <User size={18} className="text-green-muted" />
                    <span className="text-sm text-green-muted truncate">{userEmail}</span>
                </div>
                <button
                    onClick={handleSignOut}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-mid 
                       text-white rounded-lg hover:bg-red-600 transition-colors font-semibold text-sm"
                >
                    <LogOut size={18} />
                    Sign Out
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar - desktop always visible, mobile slide-in */}
            <aside className={`fixed inset-y-0 left-0 w-64 bg-green-main text-white z-50 transform transition-transform duration-300
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
                <SidebarContent />
            </aside>

            {/* Main Content */}
            <main className="md:ml-64">
                {/* Top Bar */}
                <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-5 sticky top-0 z-30">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {/* Hamburger - mobile only */}
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <Menu size={22} />
                            </button>
                            <h2 className="font-oswald font-bold text-xl md:text-2xl text-gray-900">
                                {(() => {
                                    const pageName = pathname.split('/').pop() || 'Dashboard';
                                    return pageName.charAt(0).toUpperCase() + pageName.slice(1);
                                })()}
                            </h2>
                        </div>
                        <span className="text-sm text-gray-500 hidden md:block">Let's Do More - 2027</span>
                    </div>
                </header>

                <div className="p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}