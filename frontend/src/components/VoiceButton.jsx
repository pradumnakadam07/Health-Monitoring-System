'use client';

import { useState } from 'react';
import voiceService from '@/services/voiceService';
import { Mic, MicOff } from 'lucide-react';

export default function VoiceButton({ onResult, className = '' }) {
  const [isListening, setIsListening] = useState(false);

  const handleVoiceInput = () => {
    if (!voiceService.isSpeechRecognitionAvailable()) {
      alert('Voice input is not supported in your browser');
      return;
    }

    if (isListening) {
      voiceService.stopListening();
      setIsListening(false);
      return;
    }

    setIsListening(true);
    
    voiceService.startListening(
      (transcript, isFinal) => {
        if (isFinal && onResult) {
          onResult(transcript);
        }
      },
      (error) => {
        console.error('Voice error:', error);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );
  };

  return (
    <button
      type="button"
      onClick={handleVoiceInput}
      className={`p-2 rounded-lg transition-colors ${
        isListening 
          ? 'bg-red-100 text-red-600 animate-pulse' 
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      } ${className}`}
      title={isListening ? 'Stop listening' : 'Voice input'}
    >
      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
    </button>
  );
}
