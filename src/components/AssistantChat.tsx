import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Bot, Loader2, Send, X } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import { sendAssistantMessage, type ChatMessage } from "@/services/assistantService";

/** A message on screen. Error bubbles are shown but never sent back to the assistant. */
type UiMessage = ChatMessage & { error?: boolean };

const SUGGESTIONS = ["suggestion_summary", "suggestion_expense", "suggestion_category"] as const;

/** Floating chat with the AI assistant, available on every authenticated screen. */
export function AssistantChat() {
    const { t } = useTranslation();
    const { selectedWallet } = useWallet();
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<UiMessage[]>([]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const listRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Each wallet has its own conversation: switching wallets starts a new one.
    const [chatWalletId, setChatWalletId] = useState(selectedWallet?.id);
    if (selectedWallet?.id !== chatWalletId) {
        setChatWalletId(selectedWallet?.id);
        setMessages([]);
    }

    // Keep the newest message in view.
    useEffect(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
    }, [messages, sending]);

    async function send(text: string) {
        const content = text.trim();
        if (!content || !selectedWallet || sending) return;

        const next: UiMessage[] = [...messages, { role: "user", text: content }];
        setMessages(next);
        setInput("");
        setSending(true);
        try {
            const history = next.filter((m) => !m.error).map(({ role, text }) => ({ role, text }));
            const res = await sendAssistantMessage(selectedWallet.id, history);
            setMessages((current) => [...current, { role: "model", text: res.reply }]);
            if (res.actions.length > 0) {
                toast.success(t("app.assistant.saved", { count: res.actions.length }));
            }
        } catch (err) {
            const text = err instanceof Error ? err.message : t("login.messages.generic_error");
            setMessages((current) => [...current, { role: "model", text, error: true }]);
        } finally {
            setSending(false);
            inputRef.current?.focus();
        }
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        // Enter sends; Shift+Enter breaks the line.
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            void send(input);
        }
    }

    return (
        <>
            {open && (
            <section
                role="dialog"
    aria-label={t("app.assistant.title")}
    onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
    className="fixed inset-x-4 bottom-24 z-50 flex h-[32rem] max-h-[70vh] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl sm:inset-x-auto sm:right-6 sm:w-96"
    >
    <header
        className="flex items-center justify-between px-4 py-3 text-white"
    style={{ background: "var(--gradient-primary)" }}
>
    <div className="flex items-center gap-2">
    <Bot className="h-5 w-5" aria-hidden="true" />
    <div>
        <p className="text-sm font-semibold">{t("app.assistant.title")}</p>
    <p className="text-xs text-white/80">
        {selectedWallet ? selectedWallet.name : t("app.assistant.no_wallet")}
        </p>
        </div>
        </div>
        <button
    type="button"
    onClick={() => setOpen(false)}
    aria-label={t("app.assistant.close")}
    className="grid h-8 w-8 place-items-center rounded-lg transition-colors hover:bg-white/15 cursor-pointer"
    >
    <X className="h-4 w-4" />
        </button>
        </header>

        <div ref={listRef} role="log" aria-live="polite" className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 ? (
                <div className="space-y-3 pt-2">
                <p className="text-sm text-zinc-600">{t("app.assistant.empty")}</p>
    {SUGGESTIONS.map((key) => (
        <button
            key={key}
        type="button"
        disabled={!selectedWallet}
        onClick={() => void send(t(`app.assistant.${key}`))}
        className="block w-full rounded-lg border border-zinc-200 px-3 py-2 text-left text-sm text-zinc-700 transition-colors hover:bg-zinc-50 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
            {t(`app.assistant.${key}`)}
        </button>
    ))}
    </div>
) : (
        messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
    <p
        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
        m.role === "user"
            ? "bg-brand-500 text-white"
            : m.error
                ? "bg-red-50 text-red-700"
                : "bg-zinc-100 text-zinc-800"
    }`}
>
    {m.text}
    </p>
    </div>
))
)}
    {sending && (
        <div className="flex items-center gap-2 text-sm text-zinc-500">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        {t("app.assistant.thinking")}
        </div>
    )}
    </div>

    <form
    onSubmit={(e) => {
        e.preventDefault();
        void send(input);
    }}
    className="flex items-end gap-2 border-t border-zinc-200 p-3"
    >
    <label htmlFor="assistant-input" className="sr-only">
        {t("app.assistant.placeholder")}
    </label>
    <textarea
    id="assistant-input"
    ref={inputRef}
    rows={1}
    value={input}
    onChange={(e) => setInput(e.target.value)}
    onKeyDown={handleKeyDown}
    maxLength={2000}
    disabled={!selectedWallet}
    placeholder={t("app.assistant.placeholder")}
    className="max-h-28 min-h-10 flex-1 resize-none rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 disabled:bg-zinc-50"
    />
    <button
        type="submit"
    disabled={sending || !input.trim() || !selectedWallet}
    aria-label={t("app.assistant.send")}
    className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-white transition-all hover:shadow-lg cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
    style={{ background: "var(--gradient-primary)" }}
>
    <Send className="h-4 w-4" />
        </button>
        </form>
        </section>
)}

    <button
        type="button"
    onClick={() => setOpen((v) => !v)}
    aria-expanded={open}
    aria-label={open ? t("app.assistant.close") : t("app.assistant.open")}
    className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full text-white shadow-lg transition-transform hover:scale-105 cursor-pointer"
    style={{ background: "var(--gradient-primary)" }}
>
    {open ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
    </button>
    </>
);
}