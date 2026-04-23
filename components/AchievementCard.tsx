"use client";

import Image from "next/image";
import { useState } from "react";
import { candidate } from "@/lib/data";
import { ThumbsUp } from "lucide-react";

interface AchievementCardProps {
  id: string;
  date: string;
  location: string;
  headline: string;
  body: string;
  reaction: string;
  reactionCount: number;
  image?: string;
  onReact: (id: string) => void;
}

export default function AchievementCard({
  id,
  date,
  location,
  headline,
  body,
  reaction,
  reactionCount,
  image,
  onReact,
}: AchievementCardProps) {
  const [liked, setLiked] = useState(false);

  function handleLike() {
    if (liked) return;
    setLiked(true);
    onReact(id);
  }

  return (
    <article className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Card header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 ring-1 ring-gray-200/80">
          <img
            src={candidate.photo}
            alt={candidate.shortName}
            width={36}
            height={36}
            className="object-cover w-full h-full"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm text-gray-900 truncate">
            {candidate.shortName}
          </p>
          <p className="text-xs text-gray-400">
            {date} · {location}
          </p>
        </div>
      </div>

      {/* Image or placeholder */}
      <div className="relative w-full aspect-[16/10] bg-gray-100 border-b border-gray-100">
        {image ? (
          <Image
            src={image}
            alt={headline}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 50vw"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-400">
            <div className="w-8 h-8 rounded bg-gray-200" />
            <span className="text-[10px] font-bold tracking-widest uppercase">
              {location}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="px-4 pt-4 pb-2">
        <h3 className="font-oswald text-xl font-bold text-gray-900 leading-tight mb-2 tracking-tight">
          {headline}
        </h3>
        <p className="text-[15px] text-gray-600 leading-relaxed">{body}</p>
      </div>

      {/* Footer actions */}
      <div className="px-4 py-3 flex items-center justify-between border-t border-gray-100">
        {/* Like button */}
        <button
          onClick={handleLike}
          disabled={liked}
          className={`flex items-center gap-1.5 text-xs font-medium transition-colors
            ${liked ? "text-green-700" : "text-gray-500 hover:text-gray-800"}`}
        >
          <ThumbsUp
            size={15}
            className={`transition-transform ${
              liked ? "scale-110 fill-green-700 text-green-700" : ""
            }`}
          />
          <span>{reaction}</span>
          {reactionCount > 0 && (
            <span className="text-gray-400 text-[11px] ml-0.5">
              {reactionCount}
            </span>
          )}
        </button>

        {/* Share button */}
        <button
          onClick={() =>
            navigator.share?.({
              title: headline,
              text: body,
              url: window.location.href,
            })
          }
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-1"
        >
          <span>Share</span>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </button>
      </div>
    </article>
  );
}
