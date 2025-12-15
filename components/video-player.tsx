"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface VideoPlayerProps {
  youtubeVideoId: string
  title: string
}

export function VideoPlayer({ youtubeVideoId, title }: VideoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const qKeyPressedRef = useRef(false)
  const iframeReadyRef = useRef(false)

  // Wait for iframe to be ready
  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const handleLoad = () => {
      // Small delay to ensure iframe is fully ready
      setTimeout(() => {
        iframeReadyRef.current = true
      }, 1000)
    }

    iframe.addEventListener("load", handleLoad)
    return () => iframe.removeEventListener("load", handleLoad)
  }, [])

  const pauseVideo = useCallback(() => {
    const iframe = iframeRef.current
    if (!iframe || !iframeReadyRef.current) {
      console.log("Iframe not ready yet")
      return
    }

    try {
      // YouTube iframe API postMessage format
      iframe.contentWindow?.postMessage(
        JSON.stringify({
          event: "command",
          func: "pauseVideo",
          args: "",
        }),
        "https://www.youtube.com"
      )
      setIsPaused(true)
      console.log("Pause command sent")
    } catch (error) {
      console.error("Error pausing video:", error)
    }
  }, [])

  // Handle Q key press/release
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if Q key is pressed (case insensitive)
      // Ignore if user is typing in an input field
      const target = e.target as HTMLElement
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable

      if (e.key.toLowerCase() === "q" && !qKeyPressedRef.current && !isInput) {
        e.preventDefault()
        e.stopPropagation()
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

    // Use capture phase to catch events early
    document.addEventListener("keydown", handleKeyDown, true)
    document.addEventListener("keyup", handleKeyUp, true)

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true)
      document.removeEventListener("keyup", handleKeyUp, true)
    }
  }, [pauseVideo])

  return (
    <div className="aspect-video w-full rounded-lg overflow-hidden bg-black relative">
      <iframe
        ref={iframeRef}
        src={`https://www.youtube.com/embed/${youtubeVideoId}?rel=0&enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="w-full h-full"
        id={`youtube-player-${youtubeVideoId}`}
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

