import { apiFetch } from "@/lib/http";

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export interface AssistantReply {
  reply: string;
  /** Tools that changed data, e.g. "create_transaction". */
  actions: string[];
}

/**
 * Sends the conversation to the assistant. Gemini has no memory between calls,
 * so we always send the history (the last 20 messages, the back-end limit).
 */
export function sendAssistantMessage(
  walletId: number,
  messages: ChatMessage[],
): Promise<AssistantReply> {
  const recent = messages.slice(-20);
  // The conversation must start with the user, so drop any leading assistant message.
  while (recent.length > 0 && recent[0].role === "model") {
    recent.shift();
  }
  return apiFetch<AssistantReply>(`/api/v1/wallets/${walletId}/assistant`, {
    method: "POST",
    body: JSON.stringify({ messages: recent }),
  });
}