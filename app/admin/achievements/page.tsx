"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Edit, Trash2, Eye, EyeOff, Upload, X, Crop } from "lucide-react";
import ImageCropper from "@/components/ImageCropper";

interface Achievement {
    id: string;
    date: string;
    location: string;
    headline: string;
    body: string;
    reaction: string;
    image_url: string | null;
    is_published: boolean;
}

export default function AdminAchievementsPage() {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        date: "",
        location: "",
        headline: "",
        body: "",
        reaction: "",
        image_url: "",
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [showCropper, setShowCropper] = useState(false);
    const [cropImageUrl, setCropImageUrl] = useState<string>("");
    const formRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        checkAuth();
        fetchAchievements();
    }, []);

    async function checkAuth() {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            window.location.href = "/admin/login";
        }
    }

    async function fetchAchievements() {
        try {
            const { data, error } = await supabase
                .from("achievements")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Fetch error:", error);
                throw error;
            }
            setAchievements(data || []);
        } catch (error) {
            console.error("Error fetching achievements:", error);
            alert("Failed to load achievements. Please refresh the page.");
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        try {
            // Check if user is authenticated
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                alert("Session expired. Please log in again.");
                window.location.href = "/admin/login";
                return;
            }

            let imageUrl = formData.image_url;

            // Upload new image if selected
            if (selectedFile) {
                setUploading(true);
                const uploadFormData = new FormData();
                uploadFormData.append("file", selectedFile);

                const response = await fetch("/api/upload", {
                    method: "POST",
                    body: uploadFormData,
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || "Upload failed");
                }

                imageUrl = result.url;
                setUploading(false);
            }

            const dataToSave = {
                ...formData,
                image_url: imageUrl,
            };

            if (editingId) {
                // Update existing
                const { error } = await supabase
                    .from("achievements")
                    .update(dataToSave)
                    .eq("id", editingId);

                if (error) {
                    console.error("Update error:", error);
                    throw error;
                }
            } else {
                // Create new
                const { error } = await supabase
                    .from("achievements")
                    .insert([dataToSave]);

                if (error) {
                    console.error("Insert error:", error);
                    throw error;
                }
            }

            await fetchAchievements();
            resetForm();
            alert(editingId ? "Achievement updated successfully!" : "Achievement created successfully!");
        } catch (error: any) {
            console.error("Error saving achievement:", error);

            // Provide more helpful error messages
            let errorMessage = "Failed to save achievement. ";

            if (error.code === '42501') {
                errorMessage += "Permission denied. Please log out and log back in.";
            } else if (error.message) {
                errorMessage += error.message;
            } else {
                errorMessage += "Please try again.";
            }

            alert(errorMessage);
            setUploading(false);
        }
    }

    async function deleteAchievement(id: string) {
        if (!confirm("Are you sure you want to delete this achievement?")) return;

        try {
            const { error } = await supabase
                .from("achievements")
                .delete()
                .eq("id", id);

            if (error) throw error;
            await fetchAchievements();
        } catch (error) {
            console.error("Error deleting achievement:", error);
            alert("Failed to delete achievement.");
        }
    }

    async function togglePublish(id: string, currentStatus: boolean) {
        try {
            const { error } = await supabase
                .from("achievements")
                .update({ is_published: !currentStatus })
                .eq("id", id);

            if (error) throw error;
            await fetchAchievements();
        } catch (error) {
            console.error("Error toggling publish status:", error);
        }
    }

    function editAchievement(achievement: Achievement) {
        setEditingId(achievement.id);
        setFormData({
            date: achievement.date,
            location: achievement.location,
            headline: achievement.headline,
            body: achievement.body,
            reaction: achievement.reaction,
            image_url: achievement.image_url || "",
        });
        setPreviewUrl(achievement.image_url || "");
        setSelectedFile(null);
        setShowForm(true);
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
    }

    function handleFileSelect(file: File) {
        setSelectedFile(file);
        // Create preview URL for cropping
        const reader = new FileReader();
        reader.onloadend = () => {
            setCropImageUrl(reader.result as string);
            setShowCropper(true);
        };
        reader.readAsDataURL(file);
    }

    function handleCropComplete(croppedFile: File) {
        setSelectedFile(croppedFile);
        // Create preview from cropped file
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(croppedFile);
        setShowCropper(false);
        setCropImageUrl("");
    }

    function handleCropCancel() {
        setShowCropper(false);
        setCropImageUrl("");
        setSelectedFile(null);
    }

    function resetForm() {
        setShowForm(false);
        setEditingId(null);
        setFormData({
            date: "",
            location: "",
            headline: "",
            body: "",
            reaction: "",
            image_url: "",
        });
        setSelectedFile(null);
        setPreviewUrl("");
    }

    if (loading) {
        return <div className="text-center py-12">Loading achievements...</div>;
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="font-oswald font-bold text-2xl text-gray-900">Achievement Cards</h3>
                    <p className="text-gray-600 text-sm mt-1">Manage and showcase campaign milestones</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-green-main text-white px-5 py-3 rounded-lg 
                     hover:brightness-110 transition-all font-semibold"
                >
                    <Plus size={20} />
                    {showForm ? "Cancel" : "Add New"}
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div ref={formRef} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8">
                    <h4 className="font-oswald font-bold text-xl mb-4">
                        {editingId ? "Edit Achievement" : "Create New Achievement"}
                    </h4>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                                <input
                                    type="text"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    placeholder="e.g., February 2025"
                                    required
                                    className="w-full border border-gray-300 rounded px-4 py-2 outline-none focus:border-green-main"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="e.g., Edo State House of Assembly"
                                    required
                                    className="w-full border border-gray-300 rounded px-4 py-2 outline-none focus:border-green-main"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Headline</label>
                            <input
                                type="text"
                                value={formData.headline}
                                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                                placeholder="Compelling headline for the story"
                                required
                                className="w-full border border-gray-300 rounded px-4 py-2 outline-none focus:border-green-main"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Story Body</label>
                            <textarea
                                value={formData.body}
                                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                                placeholder="Tell the full story..."
                                rows={5}
                                required
                                className="w-full border border-gray-300 rounded px-4 py-2 outline-none focus:border-green-main resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Reaction Label</label>
                                <input
                                    type="text"
                                    value={formData.reaction}
                                    onChange={(e) => setFormData({ ...formData, reaction: e.target.value })}
                                    placeholder="e.g., Standing Up for Igueben"
                                    required
                                    className="w-full border border-gray-300 rounded px-4 py-2 outline-none focus:border-green-main"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Image (optional)</label>

                                {/* Image Preview */}
                                {previewUrl && (
                                    <div className="mb-3 relative">
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="w-full h-48 object-cover rounded-lg border border-gray-200"
                                        />
                                        <div className="absolute top-2 right-2 flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (selectedFile || formData.image_url) {
                                                        setCropImageUrl(previewUrl);
                                                        setShowCropper(true);
                                                    }
                                                }}
                                                className="bg-blue-500 text-white p-1.5 rounded-full hover:bg-blue-600 transition-colors"
                                                title="Re-crop image"
                                            >
                                                <Crop size={14} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setPreviewUrl("");
                                                    setFormData({ ...formData, image_url: "" });
                                                    setSelectedFile(null);
                                                }}
                                                className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* File Upload */}
                                <div className="flex items-center gap-2">
                                    <label className="flex-1 cursor-pointer">
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg px-4 py-3 hover:border-green-main transition-colors flex items-center justify-center gap-2">
                                            <Upload size={18} className="text-gray-400" />
                                            <span className="text-sm text-gray-600">
                                                {selectedFile ? selectedFile.name : "Choose image file"}
                                            </span>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    handleFileSelect(file);
                                                }
                                            }}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Max 5MB. JPEG, PNG, WebP, or GIF
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={uploading}
                                className="bg-green-main text-white px-6 py-2 rounded-lg hover:brightness-110 font-semibold disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {uploading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Uploading...
                                    </>
                                ) : (
                                    <>{editingId ? "Update Achievement" : "Create Achievement"}</>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                disabled={uploading}
                                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 font-semibold disabled:opacity-60"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Image Cropper Modal */}
            {showCropper && cropImageUrl && (
                <ImageCropper
                    image={cropImageUrl}
                    onCropComplete={handleCropComplete}
                    onCancel={handleCropCancel}
                />
            )}

            {/* List */}
            <div className="space-y-4">
                {achievements.map((achievement) => (
                    <div
                        key={achievement.id}
                        className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 hover:shadow-md transition-all"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold ${achievement.is_published
                                        ? "bg-green-100 text-green-700"
                                        : "bg-orange-100 text-orange-700"
                                        }`}>
                                        {achievement.is_published ? "Published" : "Draft"}
                                    </span>
                                    <span className="text-xs text-gray-500">{achievement.date}</span>
                                </div>
                                <h4 className="font-oswald font-bold text-lg text-gray-900 mb-2">
                                    {achievement.headline}
                                </h4>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{achievement.body}</p>
                                <p className="text-xs text-gray-500">📍 {achievement.location}</p>
                            </div>

                            <div className="flex items-center gap-2 ml-4">
                                <button
                                    onClick={() => togglePublish(achievement.id, achievement.is_published)}
                                    className="p-2 hover:bg-gray-100 rounded transition-colors"
                                    title={achievement.is_published ? "Unpublish" : "Publish"}
                                >
                                    {achievement.is_published ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                                <button
                                    onClick={() => editAchievement(achievement)}
                                    className="p-2 hover:bg-blue-50 rounded transition-colors text-blue-600"
                                    title="Edit"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={() => deleteAchievement(achievement.id)}
                                    className="p-2 hover:bg-red-50 rounded transition-colors text-red-600"
                                    title="Delete"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
