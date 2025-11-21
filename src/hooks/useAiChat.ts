// src/hooks/useAiChat.ts
"use client";

import { useEffect, useState } from "react";
import {
  getChatHistory,
  addUserChatMessage,
  addAssistantChatMessage,
  AiSupportMessageRow,
} from "@/lib/emagrifyApi";

export function useAiChat() {
  const [messages, setMessages] = useState<AiSupportMessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getChatHistory();
      setMessages(data);
      setError(null);
    } catch (err: any) {
      setError(err?.message || "Erro ao carregar chat.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const sendUserMessage = async (text: string) => {
    if (!text.trim()) return;
    try {
      setSending(true);
      const userMsg = await addUserChatMessage(text);
      setMessages((prev) => [...prev, userMsg]);

      // Aqui você chamaria sua IA de verdade (API externa / route handler)
      // Por enquanto vamos responder com uma mensagem fake só pra funcionar.
      const fakeAnswer =
        "Essa é uma resposta simulada da IA. Aqui você pode integrar a API real depois. 😊";

      const assistantMsg = await addAssistantChatMessage(fakeAnswer);
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setError(err?.message || "Erro ao enviar mensagem.");
    } finally {
      setSending(false);
    }
  };

  return {
    messages,
    loading,
    sending,
    error,
    sendUserMessage,
  };
}
