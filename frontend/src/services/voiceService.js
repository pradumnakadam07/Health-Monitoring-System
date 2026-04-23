import { useState } from 'react';

// Voice Assistant Service
// Speech-to-Text and Text-to-Speech functionality

class VoiceService {
  constructor() {
    this.speechRecognition = null;
    this.speechSynthesis = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.isListening = false;
    this.isSpeaking = false;
    this.currentLanguage = 'en-US';
    
    // Initialize Speech Recognition (only in browser)
    if (typeof window !== 'undefined') {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.speechRecognition = new SpeechRecognition();
        this.speechRecognition.continuous = false;
        this.speechRecognition.interimResults = true;
        this.speechRecognition.lang = this.currentLanguage;
      }
    }
  }
  
  // Set language for voice recognition/synthesis
  setLanguage(langCode) {
    const languageMap = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'mr': 'mr-IN',
      'ta': 'ta-IN',
      'fr': 'fr-FR'
    };
    this.currentLanguage = languageMap[langCode] || 'en-US';
    
    if (this.speechRecognition) {
      this.speechRecognition.lang = this.currentLanguage;
    }
  }
  
  // Check if speech recognition is available
  isSpeechRecognitionAvailable() {
    return this.speechRecognition !== null;
  }
  
  // Check if speech synthesis is available
  isSpeechSynthesisAvailable() {
    return this.speechSynthesis !== undefined;
  }
  
  // Speech-to-Text: Start listening
  startListening(onResult, onError, onEnd) {
    if (!this.speechRecognition) {
      onError?.(new Error('Speech recognition not supported'));
      return false;
    }
    
    if (this.isListening) {
      return false;
    }
    
    this.isListening = true;
    
    this.speechRecognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      
      onResult?.(transcript, event.results[0].isFinal);
    };
    
    this.speechRecognition.onerror = (event) => {
      this.isListening = false;
      onError?.(new Error(event.error));
    };
    
    this.speechRecognition.onend = () => {
      this.isListening = false;
      onEnd?.();
    };
    
    this.speechRecognition.start();
    return true;
  }
  
  // Speech-to-Text: Stop listening
  stopListening() {
    if (this.speechRecognition && this.isListening) {
      this.speechRecognition.stop();
      this.isListening = false;
    }
  }
  
  // Text-to-Speech: Speak the given text
  speak(text, onStart, onEnd, onError) {
    if (!this.speechSynthesis) {
      onError?.(new Error('Speech synthesis not supported'));
      return false;
    }
    
    // Cancel any ongoing speech
    this.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.currentLanguage;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Get available voices and set the appropriate one
    const voices = this.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith(this.currentLanguage.split('-')[0])) || voices[0];
    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.onstart = () => {
      this.isSpeaking = true;
      onStart?.();
    };
    
    utterance.onend = () => {
      this.isSpeaking = false;
      onEnd?.();
    };
    
    utterance.onerror = (event) => {
      this.isSpeaking = false;
      onError?.(new Error(event.error));
    };
    
    this.speechSynthesis.speak(utterance);
    return true;
  }
  
  // Text-to-Speech: Stop speaking
  stopSpeaking() {
    if (this.speechSynthesis) {
      this.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
  }
  
  // Get available voices
  getVoices() {
    if (this.speechSynthesis) {
      return this.speechSynthesis.getVoices();
    }
    return [];
  }
  
  // Check if currently listening
  getIsListening() {
    return this.isListening;
  }
  
  // Check if currently speaking
  getIsSpeaking() {
    return this.isSpeaking;
  }
}

// Singleton instance
const voiceService = new VoiceService();

export default voiceService;

// React hook for voice functionality
export const useVoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  const startListening = () => {
    return new Promise((resolve, reject) => {
      voiceService.startListening(
        (result, isFinal) => {
          setTranscript(result);
          if (isFinal) {
            resolve(result);
          }
        },
        (error) => reject(error),
        () => setIsListening(false)
      );
      setIsListening(true);
    });
  };
  
  const stopListening = () => {
    voiceService.stopListening();
    setIsListening(false);
  };
  
  const speak = (text) => {
    return new Promise((resolve, reject) => {
      voiceService.speak(
        text,
        () => setIsSpeaking(true),
        () => {
          setIsSpeaking(false);
          resolve();
        },
        (error) => {
          setIsSpeaking(false);
          reject(error);
        }
      );
    });
  };
  
  const stopSpeaking = () => {
    voiceService.stopSpeaking();
    setIsSpeaking(false);
  };
  
  const setLanguage = (langCode) => {
    voiceService.setLanguage(langCode);
  };
  
  return {
    isListening,
    isSpeaking,
    transcript,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    setLanguage,
    isAvailable: voiceService.isSpeechRecognitionAvailable() || voiceService.isSpeechSynthesisAvailable()
  };
};
