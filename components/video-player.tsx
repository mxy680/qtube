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

  // Load YouTube IFrame API
  useEffect(() => {
    // Check if script is already loaded
    if (window.YT && window.YT.Player) {
      return
    }

    const tag = document.createElement("script")
    tag.src = "https://www.youtube.com/iframe_api"
    const firstScriptTag = document.getElementsByTagName("script")[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

    // Initialize player when API is ready
    ;(window as any).onYouTubeIframeAPIReady = () => {
      // Player will be initialized when iframe is ready
    }
  }, [])

  // Handle Q key press/release
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if Q key is pressed (case insensitive)
      if (e.key.toLowerCase() === "q" && !qKeyPressedRef.current) {
        qKeyPressedRef.current = true
        pauseVideo()
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "q" && qKeyPressedRef.current) {
        qKeyPressedRef.current = false
        // Optionally resume video when Q is released
        // resumeVideo()
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
      // Use YouTube IFrame API to pause
      const iframe = iframeRef.current
      const player = (iframe as any).playerInstance

      if (player && typeof player.pauseVideo === "function") {
        player.pauseVideo()
        setIsPaused(true)
      } else {
        // Fallback: send postMessage to iframe
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
  }

  // Initialize YouTube player when iframe loads
  const handleIframeLoad = () => {
    if (window.YT && window.YT.Player && iframeRef.current) {
      const player = new window.YT.Player(iframeRef.current, {
        events: {
          onReady: () => {
            // Player is ready
          },
        },
      })
      // Store player instance on iframe for later access
      ;(iframeRef.current as any).playerInstance = player
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
        onLoad={handleIframeLoad}
      />
      {isPaused && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/50 rounded-lg px-4 py-2 text-white text-sm font-light">
            Video paused (holding Q)
          </div>
        </div>
      )}
    </div>
  )
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

