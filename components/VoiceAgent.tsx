import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";

interface VoiceAgentProps {
  onTranscriptChange: (transcript: string) => void;
}

export function VoiceAgent({ onTranscriptChange }: VoiceAgentProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null,
  );

  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;

      recognitionInstance.onresult = (event) => {
        const currentTranscript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join("");
        setTranscript(currentTranscript);
        onTranscriptChange(currentTranscript);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [onTranscriptChange]);

  const startListening = useCallback(() => {
    if (recognition) {
      recognition.start();
      setIsListening(true);
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition]);

  return (
    <div className="space-y-4">
      <div className="flex justify-center mb-4">
        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-4xl">
          🎤
        </div>
      </div>
      <p className="text-center text-lg mb-4">
        {isListening
          ? "I'm listening! Tell me what ingredients you have."
          : "Click the microphone to start speaking."}
      </p>
      <Button
        className={`w-full py-4 text-lg ${isListening ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
        onClick={isListening ? stopListening : startListening}
      >
        {isListening ? (
          <MicOff className="mr-2 h-6 w-6" />
        ) : (
          <Mic className="mr-2 h-6 w-6" />
        )}
        {isListening ? "Stop Listening" : "Start Listening"}
      </Button>
      {transcript && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <p className="font-semibold">Current input:</p>
          <p>{transcript}</p>
        </div>
      )}
    </div>
  );
}
