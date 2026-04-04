"use client";
import Image from "next/image";
import { useState } from "react";
import { candidate } from "@/lib/data";
import { ThumbsUp } from "lucide-react";

interface AchievementCardProps {
  date: string; location: string; headline: string;
  body: string; reaction: string; image?: string;
}

export default function AchievementCard({
  date, location, headline, body, reaction, image,
}: AchievementCardProps) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);

  function handleLike() {
    if (liked) {
      setLiked(false);
      setCount((c) => c - 1);
    } else {
      setLiked(true);
      setCount((c) => c + 1);
    }
  }

  return (
    <article className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">

      {/* Card header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <div className="w-10 h-10 rounded-full bg-green-main flex items-center justify-center shrink-0">
          <span className="font-oswald font-bold text-white text-xs">{candidate.initials}</span>
        </div>
        <div>
          <p className="font-semibold text-sm text-gray-900">{candidate.shortName}</p>
          <p className="text-xs text-gray-500">{date}</p>
        </div>
      </div>

      {/* Image or placeholder */}
      <div className="relative w-full h-64 bg-green-pale flex flex-col items-center justify-center gap-2 border-b border-gray-100 py-4">
        {image ? (
          <Image src={image} alt={headline} fill className="object-cover" sizes="(max-width: 640px) 100vw, 50vw" />
        ) : (
          <>
            <div className="w-8 h-8 rounded bg-green-main opacity-40" />
            <span className="text-[10px] text-green-main font-bold tracking-[0.15em] uppercase">{location}</span>
          </>
        )}
      </div>

      {/* Body */}
      <div className="px-4 py-4">
        <h3 className="font-oswald text-lg font-bold text-gray-900 leading-snug mb-2">{headline}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
      </div>

      {/* Footer actions */}
      <div className="px-4 pb-4 flex gap-5 border-t border-gray-100 pt-3">

        {/* Like button */}
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 text-xs font-semibold transition-colors
            ${liked ? "text-green-main" : "text-gray-400 hover:text-green-main"}`}
        >
          <ThumbsUp
            size={14}
            className={`transition-transform ${liked ? "scale-125 fill-green-main" : ""}`}
          />
          <span>{reaction}</span>
          {count > 0 && (
            <span className="bg-green-pale text-green-main text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {count}
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
          className="text-xs text-gray-400 font-semibold hover:text-green-main transition-colors"
        >
          ↗ Share
        </button>

      </div>
    </article>
  );
}