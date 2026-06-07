import { Bot, ImagePlus, MessageCircleMore, Send, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

const initialMessage = {
  id: 1,
  type: "bot",
  text: "Hi, I'm Payroll Assistant. Ask me about employees, attendance, payroll, leaves, reports, settings, or upload a screenshot for context.",
};

const buildReply = (input, attachmentName) => {
  const text = input.toLowerCase().trim();
  const hasAny = (terms) => terms.some((term) => text.includes(term));

  if (attachmentName) {
    return `Thanks for the image${attachmentName ? ` (${attachmentName})` : ""}. Add a short note about what you want fixed or explained, and I’ll use it as context.`;
  }

  if (/\b(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(text)) {
    return "Hello. I can help you find the right HRMS screen, explain a workflow, or point out what to do next.";
  }

  if (hasAny(["employee", "staff", "team member", "worker"])) {
    return "Use Employees to create or edit staff records, search by name, assign departments, and review profile details.";
  }

  if (hasAny(["attendance", "present", "absent", "late", "working days"])) {
    return "Attendance is where you track present, absent, and leave counts. Keep it updated before running payroll.";
  }

  if (hasAny(["payroll", "salary", "payslip", "net pay", "deduction"])) {
    return "Payroll lets you generate monthly salary, review deductions, mark payments, and download payslip PDFs.";
  }

  if (hasAny(["leave", "vacation", "request", "pto", "approval"])) {
    return "Open Leaves to submit requests from the employee side or approve and reject requests from the admin side.";
  }

  if (hasAny(["report", "export", "summary", "analytics", "chart"])) {
    return "Reports includes summary charts and export actions for employee, attendance, and payroll data.";
  }

  if (hasAny(["setting", "profile", "company", "logo", "currency", "theme"])) {
    return "Settings is where you update company details, admin profile data, logo settings, currency, and other preferences.";
  }

  if (hasAny(["notification", "alert", "bell"])) {
    return "Notifications appear in the top-right bell menu. Open it to review recent system updates and actions.";
  }

  if (hasAny(["password", "login", "signin", "sign in", "reset"])) {
    return "If you need account access help, use the login and forgot-password screens. I can guide you through the visible steps in the app.";
  }

  if (hasAny(["logout", "sign out", "signout"])) {
    return "Use Logout in the header when you are done. The session stays handled by the existing auth flow.";
  }

  return "I can help with employees, attendance, payroll, leaves, reports, settings, notifications, and account questions. Ask a specific task and I'll point you to the right screen.";
};

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([initialMessage]);
  const [isTyping, setIsTyping] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const inputRef = useRef(null);
  const endRef = useRef(null);
  const replyTimer = useRef(null);
  const nextId = useRef(2);

  const quickPrompts = useMemo(
    () => ["How do I add an employee?", "Where are payslips?", "How do leave requests work?"],
    []
  );

  useEffect(
    () => () => {
      if (replyTimer.current) clearTimeout(replyTimer.current);
      if (attachment?.preview) URL.revokeObjectURL(attachment.preview);
    },
    [attachment]
  );

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, open, isTyping]);

  const clearAttachment = () => {
    setAttachment((current) => {
      if (current?.preview) URL.revokeObjectURL(current.preview);
      return null;
    });
  };

  const handleAttachment = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (attachment?.preview) URL.revokeObjectURL(attachment.preview);

    const preview = URL.createObjectURL(file);
    setAttachment({
      name: file.name,
      preview,
    });
  };

  const sendMessage = (rawText = message) => {
    const text = rawText.trim();
    if (!text && !attachment) return;
    if (isTyping) return;

    const userMessage = {
      id: nextId.current++,
      type: "user",
      text: text || "Uploaded an image for context.",
      image: attachment?.preview || null,
      imageName: attachment?.name || null,
    };

    setMessages((current) => [...current, userMessage]);
    setMessage("");
    setIsTyping(true);

    const currentAttachmentName = attachment?.name || "";
    clearAttachment();

    replyTimer.current = window.setTimeout(() => {
      const botMessage = {
        id: nextId.current++,
        type: "bot",
        text: buildReply(text, currentAttachmentName),
      };
      setMessages((current) => [...current, botMessage]);
      setIsTyping(false);
    }, 650);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="chat-pop mb-3 flex h-[34rem] w-[min(92vw,24rem)] flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.28)] dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-start justify-between border-b border-slate-200 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-700 px-4 py-4 text-white dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="relative grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-white ring-1 ring-white/15">
                <MessageCircleMore size={22} />
                <Sparkles className="absolute -right-1 -top-1 text-emerald-200" size={12} />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-sm font-semibold">
                  AI Assistant
                  <Sparkles size={14} className="text-emerald-200" />
                </div>
                <p className="text-xs text-slate-200">Modern HRMS helper with image context support</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full p-2 text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.06),transparent_42%),linear-gradient(to_bottom,#f6f9f5,#e9efea)] px-4 py-4 dark:bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.08),transparent_36%),linear-gradient(to_bottom,#07111f,#020617)]">
            {messages.map((item) => (
              <div
                key={item.id}
                className={`flex items-end gap-2 ${item.type === "user" ? "justify-end" : "justify-start"}`}
              >
                {item.type === "bot" && (
                  <div className="mb-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-950 text-white dark:bg-emerald-400 dark:text-slate-950">
                    <Bot size={16} />
                  </div>
                )}
                <div
                  className={`max-w-[85%] whitespace-pre-line rounded-3xl px-4 py-3 text-sm leading-6 shadow-sm ${
                    item.type === "user"
                      ? "rounded-br-md bg-slate-950 text-white dark:bg-emerald-500 dark:text-slate-950"
                      : "rounded-bl-md border border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  }`}
                >
                  {item.image && (
                    <div className="mb-3 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                      <img src={item.image} alt={item.imageName || "Uploaded attachment"} className="max-h-44 w-full object-cover" />
                      {item.imageName && (
                        <div className="border-t border-slate-200 px-3 py-2 text-[11px] text-slate-500 dark:border-slate-700 dark:text-slate-400">
                          {item.imageName}
                        </div>
                      )}
                    </div>
                  )}
                  {item.text}
                </div>
                {item.type === "user" && (
                  <div className="mb-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-100 text-[10px] font-semibold text-emerald-700 dark:bg-white/10 dark:text-white">
                    You
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center gap-3 rounded-3xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-slate-950 text-white dark:bg-emerald-400 dark:text-slate-950">
                    <Bot size={16} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Typing</p>
                    <div className="flex items-center gap-1.5">
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                      <span className="typing-dot" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            {attachment && (
              <div className="mb-3 flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm dark:border-slate-700 dark:bg-slate-800">
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Attached image</p>
                  <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">{attachment.name}</p>
                </div>
                <button
                  type="button"
                  onClick={clearAttachment}
                  className="rounded-full border border-slate-200 p-2 text-slate-500 transition-colors hover:border-emerald-500 hover:text-emerald-600 dark:border-slate-700 dark:hover:text-white"
                  aria-label="Remove attachment"
                >
                  <X size={14} />
                </button>
              </div>
            )}
            <div className="mb-3 flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:-translate-y-0.5 hover:border-emerald-500 hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-emerald-400 dark:hover:text-white"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-500 hover:text-emerald-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-emerald-400 dark:hover:text-white"
                aria-label="Upload image"
                title="Upload image"
              >
                <ImagePlus size={16} />
              </button>
              <input ref={inputRef} type="file" accept="image/*" onChange={handleAttachment} className="hidden" />
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask about payroll, attendance, leaves..."
                rows={2}
                className="min-h-[3.25rem] flex-1 resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
              <button
                type="button"
                onClick={() => sendMessage()}
                disabled={!message.trim() && !attachment || isTyping}
                className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-950 text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-emerald-500 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-emerald-400 dark:text-slate-950 dark:hover:bg-white"
                aria-label="Send message"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((value) => !value)}
        className="group relative grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-700 text-white shadow-[0_20px_40px_rgba(15,23,42,0.35)] transition-all hover:-translate-y-0.5 hover:scale-105 dark:from-emerald-400 dark:via-emerald-300 dark:to-sky-300 dark:text-slate-950"
        aria-label="Open assistant"
      >
        <MessageCircleMore size={24} />
        <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-emerald-300 text-[10px] font-bold text-slate-950 shadow-sm dark:bg-white dark:text-slate-950">
          AI
        </span>
      </button>
    </div>
  );
};

export default ChatBot;
