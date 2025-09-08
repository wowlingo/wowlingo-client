import { useEffect, useState } from "react";

export default function useKoreanVoice() {
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    const pick = () => {
      const vs = window.speechSynthesis.getVoices();
      const ko = vs.find((v) => v.lang?.toLowerCase().startsWith("ko"));
      setVoice(ko || null);
    };
    pick();
    window.speechSynthesis.onvoiceschanged = pick;
  }, []);

  return voice;
}

export function speakKorean(text: string, voice: SpeechSynthesisVoice | null) {
  const msg = new SpeechSynthesisUtterance(text);
  if (voice) msg.voice = voice;
  msg.lang = "ko-KR";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(msg);
}
