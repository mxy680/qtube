"use client"

import { useEffect, useRef, useState } from "react"

interface VideoPlayerProps {
  youtubeVideoId: string
  title: string
}

export function VideoPlayer({ youtubeVideoId, title }: VideoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const qKeyPressedRef = useRef(false)

  // Handle Q key press/release
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if Q key is pressed (case insensitive)
      // Ignore if user is typing in an input field
      if (
        e.key.toLowerCase() === "q" &&
        !qKeyPressedRef.current &&
        (e.target as HTMLElement)?.tagName !== "INPUT" &&
        (e.target as HTMLElement)?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault()
        qKeyPressedRef.current = true
        pauseVideo()
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "q" && qKeyPressedRef.current) {
        qKeyPressedRef.current = false
        setIsPaused(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  const pauseVideo = () => {
    if (iframeRef.current) {
      // Use postMessage to control YouTube iframe
      const iframe = iframeRef.current
      iframe.contentWindow?.postMessage(
        JSON.stringify({
          event: "command",
          func: "pauseVideo",
          args: [],
        }),
        "https://www.youtube.com"
      )
      setIsPaused(true)
    }
  }

  return (
    <div className="aspect-video w-full rounded-lg overflow-hidden bg-black relative">
      <iframe
        ref={iframeRef}
        src={`https://www.youtube.com/embed/${youtubeVideoId}?rel=0&enablejsapi=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full"
      />
      {isPaused && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="bg-black/70 rounded-lg px-4 py-2 text-white text-sm font-light">
            Video paused (holding Q)
          </div>
        </div>
      )}
    </div>
  )
}

