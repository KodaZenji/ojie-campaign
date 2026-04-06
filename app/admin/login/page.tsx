"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/supabase";
import { Heart } from "lucide-react";

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await signIn(email, password);
            router.push("/admin/dashboard");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Failed to sign in. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-green-main flex items-center justify-center px-5">
            <div className="w-full max-w-md">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-full bg-gold flex items-center justify-center mx-auto mb-4">
                        <Heart className="text-gold-dark" size={32} fill="currentColor" />
                    </div>
                    <h1 className="font-oswald font-bold text-white text-3xl mb-2">
                        Admin Portal
                    </h1>
                    <p className="text-green-muted text-sm">
                        Hon. Ojie Inegbeboh Campaign Dashboard
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-lg p-8 shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full border border-gray-300 rounded px-4 py-3 outline-none focus:border-green-main focus:ring-2 focus:ring-green-pale transition-all"
                                placeholder="admin@ojiecampaign.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full border border-gray-300 rounded px-4 py-3 outline-none focus:border-green-main focus:ring-2 focus:ring-green-pale transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-green-main text-white font-oswald font-bold py-4 rounded
                         hover:brightness-110 active:scale-98 transition-all
                         disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? "Signing In..." : "Sign In to Dashboard"}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-xs text-gray-500 text-center">
                            Authorized personnel only. All access is logged and monitored.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-green-muted text-xs mt-6">
                    Secured Authentication • let's Do More - 2027
                </p>
            </div>
        </div>
    );
}
