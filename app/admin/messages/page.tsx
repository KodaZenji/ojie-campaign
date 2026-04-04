"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Mail, Check, Trash2 } from "lucide-react";

interface ContactMessage {
    id: string;
    name: string;
    phone: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

export default function AdminMessagesPage() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

    useEffect(() => {
        fetchMessages();

        // Set up realtime subscription (optional - fails gracefully)
        let channel: any;
        try {
            channel = supabase
                .channel('contact-messages')
                .on('postgres_changes',
                    { event: '*', schema: 'public', table: 'contact_messages' },
                    () => {
                        fetchMessages();
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

    async function fetchMessages() {
        try {
            const { data, error } = await supabase
                .from("contact_messages")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setMessages(data || []);
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            setLoading(false);
        }
    }

    async function markAsRead(id: string) {
        try {
            const { error } = await supabase
                .from("contact_messages")
                .update({ is_read: true })
                .eq("id", id);

            if (error) throw error;
            await fetchMessages();
        } catch (error) {
            console.error("Error marking as read:", error);
        }
    }

    async function deleteMessage(id: string) {
        if (!confirm("Are you sure you want to delete this message?")) return;

        try {
            const { error } = await supabase
                .from("contact_messages")
                .delete()
                .eq("id", id);

            if (error) throw error;
            await fetchMessages();
            if (selectedMessage?.id === id) setSelectedMessage(null);
        } catch (error) {
            console.error("Error deleting message:", error);
        }
    }

    if (loading) {
        return <div className="text-center py-12">Loading messages...</div>;
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h3 className="font-oswald font-bold text-2xl text-gray-900 mb-2">Contact Messages</h3>
                <p className="text-gray-600 text-sm">View and manage supporter communications</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Messages List */}
                <div className="lg:col-span-1 space-y-3">
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b border-gray-200">
                            <h4 className="font-semibold text-gray-700">
                                All Messages ({messages.length})
                            </h4>
                        </div>
                        <div className="max-h-[600px] overflow-y-auto">
                            {messages.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    No messages yet
                                </div>
                            ) : (
                                messages.map((msg) => (
                                    <button
                                        key={msg.id}
                                        onClick={() => setSelectedMessage(msg)}
                                        className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left
                      ${selectedMessage?.id === msg.id ? 'bg-blue-50' : ''}
                      ${!msg.is_read ? 'bg-yellow-50' : ''}`}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-semibold text-gray-900 truncate">{msg.name}</span>
                                            {!msg.is_read && (
                                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 mb-1">📱 {msg.phone}</p>
                                        <p className="text-xs text-gray-400">
                                            {new Date(msg.created_at).toLocaleDateString()}
                                        </p>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Message Detail */}
                <div className="lg:col-span-2">
                    {selectedMessage ? (
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            {/* Header */}
                            <div className="p-5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                                <div>
                                    <h4 className="font-bold text-lg text-gray-900">{selectedMessage.name}</h4>
                                    <p className="text-sm text-gray-600">{selectedMessage.phone}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {!selectedMessage.is_read && (
                                        <button
                                            onClick={() => markAsRead(selectedMessage.id)}
                                            className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1.5 
                                 rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold"
                                        >
                                            <Check size={16} />
                                            Mark Read
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteMessage(selectedMessage.id)}
                                        className="p-2 hover:bg-red-50 rounded transition-colors text-red-600"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Message Body */}
                            <div className="p-6">
                                <div className="mb-4">
                                    <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">
                                        Message
                                    </label>
                                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                                        {selectedMessage.message}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-gray-200">
                                    <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">
                                        Received
                                    </label>
                                    <p className="text-sm text-gray-600">
                                        {new Date(selectedMessage.created_at).toLocaleString()}
                                    </p>
                                </div>

                                {/* Quick Actions */}
                                <div className="mt-6 flex gap-3">
                                    <a
                                        href={`https://wa.me/${selectedMessage.phone.replace('+', '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 
                               rounded-lg hover:bg-green-600 transition-colors font-semibold text-sm"
                                    >
                                        <Mail size={16} />
                                        Reply on WhatsApp
                                    </a>
                                    <a
                                        href={`tel:${selectedMessage.phone}`}
                                        className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 
                               rounded-lg hover:bg-blue-600 transition-colors font-semibold text-sm"
                                    >
                                        📞 Call Now
                                    </a>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                            <Mail className="mx-auto mb-4 text-gray-300" size={48} />
                            <p className="text-gray-500 font-semibold">Select a message to view details</p>
                            <p className="text-gray-400 text-sm mt-2">
                                Click on any message from the list to read and respond
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
