"use client";
import { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";
import { X } from "lucide-react";

interface FormData {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

const empty: FormData = { fullName: "", email: "", subject: "", message: "" };

const field =
  "w-full rounded-md border border-white/10 bg-white/[.02] px-3 py-2 text-[12px] text-white placeholder:text-neutral-600 focus:border-white/30 focus:outline-none disabled:opacity-50";
const label = "mb-1 block font-mono text-[10px] uppercase tracking-widest text-neutral-200";

export default function LetsTalk() {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState<FormData>(empty);
  const firstField = useRef<HTMLInputElement>(null);

  const close = () => {
    if (sending) return;
    setOpen(false);
    setFormData(empty);
  };

  // Esc to close, lock body scroll, focus first field
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstField.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, sending]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          subject: formData.subject,
          user_name: formData.fullName,
          message: formData.message,
          user_email: formData.email,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );
      toast.success("Message sent successfully");
      setFormData(empty); // reset
      setSending(false);
      setOpen(false); // close
    } catch (error) {
      console.error("Email send error:", error);
      toast.error("Failed to send message. Please try again.");
      setSending(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-primary px-4 py-2 text-[11px] font-semibold text-black cursor-pointer"
      >
        Let's Talk →
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(e) => e.target === e.currentTarget && close()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-title"
        >
          <div className="my-auto w-full max-w-[440px] rounded-md border border-white/10 bg-[#0a0a0a] text-left shadow-2xl">
            <div className="hatch h-4 border-b border-white/10" />
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-5">
              <h2 id="contact-title" className="font-serif text-[22px] leading-none text-primary">
                Say Hello
              </h2>
              <button
                type="button"
                onClick={close}
                aria-label="Close"
                className="rounded p-1 text-neutral-500 hover:bg-white/10 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 px-4 py-5 sm:px-5">
              <p className="text-[11px] leading-[16px] text-neutral-400">
                Drop a message and I'll get back to you by email.
              </p>
              <div>
                <label htmlFor="fullName" className={label}>Full name</label>
                <input
                  ref={firstField}
                  id="fullName"
                  type="text"
                  name="fullName"
                  placeholder="Your name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  disabled={sending}
                  className={field}
                />
              </div>
              <div>
                <label htmlFor="email" className={label}>Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={sending}
                  className={field}
                />
              </div>
              <div>
                <label htmlFor="subject" className={label}>Subject</label>
                <input
                  id="subject"
                  type="text"
                  name="subject"
                  placeholder="What's this about?"
                  value={formData.subject}
                  onChange={handleChange}
                  disabled={sending}
                  className={field}
                />
              </div>
              <div>
                <label htmlFor="message" className={label}>Message</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Tell me a bit more..."
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  disabled={sending}
                  className={`${field} resize-none`}
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={close}
                  disabled={sending}
                  className="rounded-md border border-white/10 px-4 py-2 text-[11px] text-neutral-400 hover:text-white disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="rounded-md bg-white px-4 py-2 text-[11px] font-semibold text-black disabled:opacity-60 cursor-pointer"
                >
                  {sending ? "Sending..." : "Send a message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}