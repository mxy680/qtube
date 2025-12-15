"use client"

import { useState, useRef, useEffect } from "react"

interface VoiceAssistantProps {
  videoId: string
  videoTitle: string
}

export function VoiceAssistant({ videoId, videoTitle }: VoiceAssistantProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  useEffect(() => {
    // Check if browser supports Web Speech API
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || (window as any).webkitSpeechRecognition

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = false
        recognition.lang = "en-US"

        recognition.onresult = async (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript
          setIsRecording(false)
          setIsProcessing(true)

          // Process the question and get answer
          try {
            const answer = await processQuestion(transcript, videoId, videoTitle)
            speakAnswer(answer)
          } catch (error) {
            console.error("Error processing question:", error)
            speakAnswer("Sorry, I encountered an error processing your question.")
          } finally {
            setIsProcessing(false)
          }
        }

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error("Speech recognition error:", event.error)
          setIsRecording(false)
          setIsProcessing(false)
          if (event.error === "no-speech") {
            speakAnswer("I didn't hear anything. Please try again.")
          } else {
            speakAnswer("Sorry, there was an error with speech recognition.")
          }
        }

        recognition.onend = () => {
          setIsRecording(false)
        }

        recognitionRef.current = recognition
      }

      synthRef.current = window.speechSynthesis
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (synthRef.current) {
        synthRef.current.cancel()
      }
    }
  }, [videoId, videoTitle])

  const startRecording = () => {
    if (recognitionRef.current && !isRecording && !isProcessing && !isSpeaking) {
      try {
        recognitionRef.current.start()
        setIsRecording(true)
      } catch (error) {
        console.error("Error starting recognition:", error)
      }
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop()
      setIsRecording(false)
    }
  }

  const speakAnswer = (text: string) => {
    if (synthRef.current) {
      synthRef.current.cancel() // Cancel any ongoing speech

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 1.0
      utterance.pitch = 1.0
      utterance.volume = 1.0

      utterance.onstart = () => {
        setIsSpeaking(true)
      }

      utterance.onend = () => {
        setIsSpeaking(false)
      }

      utterance.onerror = () => {
        setIsSpeaking(false)
      }

      synthRef.current.speak(utterance)
    }
  }

  const processQuestion = async (
    question: string,
    videoId: string,
    videoTitle: string
  ): Promise<string> => {
    // TODO: Implement actual AI/question answering logic
    // For now, return a placeholder response
    return `Based on the video "${videoTitle}", I understand you asked: "${question}". This feature is currently being developed.`
  }

  const handleMouseDown = () => {
    startRecording()
  }

  const handleMouseUp = () => {
    stopRecording()
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    startRecording()
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault()
    stopRecording()
  }

  // Check if browser supports Web Speech API
  const isSupported =
    typeof window !== "undefined" &&
    (window.SpeechRecognition || (window as any).webkitSpeechRecognition) &&
    window.speechSynthesis

  if (!isSupported) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm font-light text-muted-foreground text-center">
          Voice assistant is not supported in your browser
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4 p-6">
      <div className="text-center">
        <h3 className="text-sm font-normal text-foreground">Ask a Question</h3>
      </div>

      <button
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        disabled={isProcessing || isSpeaking}
        className={`
          w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200
          ${
            isRecording
              ? "bg-red-600 scale-110 shadow-lg shadow-red-600/50"
              : isProcessing || isSpeaking
                ? "bg-muted cursor-not-allowed"
                : "bg-primary hover:bg-primary/90 cursor-pointer"
          }
        `}
        aria-label={isRecording ? "Recording, release to stop" : "Hold to ask a question"}
      >
        {isProcessing ? (
          <svg
            className="w-8 h-8 text-foreground animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <svg
            className={`w-8 h-8 ${isRecording ? "text-white" : "text-primary-foreground"}`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
        )}
      </button>

      {isRecording && (
        <div className="flex items-center gap-2 text-sm font-light text-red-600">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
          <span>Listening...</span>
        </div>
      )}

      {isProcessing && (
        <div className="flex items-center gap-2 text-sm font-light text-muted-foreground">
          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" />
          <span>Processing...</span>
        </div>
      )}

      {isSpeaking && (
        <div className="flex items-center gap-2 text-sm font-light text-primary">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span>Speaking...</span>
        </div>
      )}
    </div>
  )
}

