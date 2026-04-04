"use client";
import { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import { X, Check, RotateCw } from "lucide-react";

interface ImageCropperProps {
    image: string;
    onCropComplete: (croppedImage: File) => void;
    onCancel: () => void;
}

export default function ImageCropper({ image, onCropComplete, onCancel }: ImageCropperProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    const onCropChange = (crop: { x: number; y: number }) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom: number) => {
        setZoom(zoom);
    };

    const onRotationChange = (rotation: number) => {
        setRotation(rotation);
    };

    const onCropAreaComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const image = new Image();
            image.addEventListener("load", () => resolve(image));
            image.addEventListener("error", (error) => reject(error));
            image.src = url;
        });

    const getCroppedImg = async (
        imageSrc: string,
        pixelCrop: any,
        rotation = 0
    ): Promise<Blob> => {
        const image = await createImage(imageSrc);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
            throw new Error("No 2d context");
        }

        const maxSize = Math.max(image.width, image.height);
        const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

        canvas.width = safeArea;
        canvas.height = safeArea;

        ctx.translate(safeArea / 2, safeArea / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-safeArea / 2, -safeArea / 2);

        ctx.drawImage(
            image,
            safeArea / 2 - image.width * 0.5,
            safeArea / 2 - image.height * 0.5
        );

        const data = ctx.getImageData(0, 0, safeArea, safeArea);

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.putImageData(
            data,
            Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
            Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
        );

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(blob);
                }
            }, "image/jpeg", 0.9);
        });
    };

    const handleSave = async () => {
        try {
            const croppedBlob = await getCroppedImg(image, croppedAreaPixels, rotation);
            const file = new File([croppedBlob], "cropped-image.jpg", { type: "image/jpeg" });
            onCropComplete(file);
        } catch (error) {
            console.error("Error cropping image:", error);
            alert("Failed to crop image. Please try again.");
        }
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Enter") {
                e.preventDefault();
                handleSave();
            } else if (e.key === "Escape") {
                e.preventDefault();
                onCancel();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleSave, onCancel]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[9999] p-4">
            <div className="bg-white rounded-xl max-w-5xl w-full max-h-[95vh] overflow-hidden flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <div>
                        <h3 className="font-oswald font-bold text-2xl text-gray-900">Crop Image</h3>
                        <p className="text-sm text-gray-600 mt-1">Drag to move • Scroll to zoom • Adjust controls below</p>
                    </div>
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                        title="Close without saving"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Cropper Area */}
                <div className="relative flex-1 min-h-[400px] bg-gray-900">
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        rotation={rotation}
                        aspect={4 / 3}
                        onCropChange={onCropChange}
                        onZoomChange={onZoomChange}
                        onRotationChange={onRotationChange}
                        onCropComplete={onCropAreaComplete}
                    />
                </div>

                {/* Controls */}
                <div className="px-6 py-5 border-t border-gray-200 space-y-4 bg-white">
                    {/* Zoom Control */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-semibold text-gray-700">Zoom Level</label>
                            <span className="text-sm font-bold text-green-main">{Math.round(zoom * 100)}%</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="3"
                            step="0.1"
                            value={zoom}
                            onChange={(e) => onZoomChange(parseFloat(e.target.value))}
                            className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-main"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>100%</span>
                            <span>200%</span>
                            <span>300%</span>
                        </div>
                    </div>

                    {/* Rotation Control */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-semibold text-gray-700">Rotation</label>
                            <span className="text-sm font-bold text-green-main">{rotation}°</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="range"
                                min="0"
                                max="360"
                                step="1"
                                value={rotation}
                                onChange={(e) => onRotationChange(parseInt(e.target.value))}
                                className="flex-1 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-main"
                            />
                            <button
                                onClick={() => setRotation((rotation + 90) % 360)}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2 font-semibold text-sm"
                                title="Rotate 90° clockwise"
                            >
                                <RotateCw size={18} />
                                Rotate 90°
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons - Prominent */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button
                            onClick={handleSave}
                            className="flex-1 bg-green-main text-white font-bold py-4 rounded-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 text-lg shadow-lg"
                            title="Save cropped image"
                        >
                            <Check size={24} strokeWidth={3} />
                            ✓ Use This Crop
                        </button>
                        <button
                            onClick={onCancel}
                            className="px-8 bg-gray-200 text-gray-700 font-bold py-4 rounded-lg hover:bg-gray-300 transition-colors text-lg"
                            title="Cancel and discard changes"
                        >
                            Cancel
                        </button>
                    </div>

                    <p className="text-xs text-gray-500 text-center pt-2">
                        💡 Tip: You can also use mouse wheel to zoom in/out
                    </p>
                </div>
            </div>
        </div>
    );
}
