'use client';

import { Send, Loader2 } from "lucide-react";
import { useTransition } from "react";
import { sendContactEmail } from "@/app/actions/contact";
import toast from "react-hot-toast";

export default function ContactForm() {
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            const result = await sendContactEmail(formData);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Message sent successfully!");
                const form = document.getElementById('contact-form') as HTMLFormElement;
                form.reset();
            }
        });
    };

    return (
        <div className="bg-carbon-grey/30 border border-tungsten-grey rounded-lg p-8">
            <h2 className="text-xl font-bold font-mono text-hazard-amber mb-6">
                SEND MESSAGE
            </h2>
            <form id="contact-form" action={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-xs font-bold text-gray-500 uppercase mb-2">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="w-full bg-deep-anthracite border border-tungsten-grey rounded px-4 py-2 text-white focus:outline-none focus:border-hazard-amber transition-colors font-mono text-sm"
                        placeholder="Full Name"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-xs font-bold text-gray-500 uppercase mb-2">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full bg-deep-anthracite border border-tungsten-grey rounded px-4 py-2 text-white focus:outline-none focus:border-hazard-amber transition-colors font-mono text-sm"
                        placeholder="mail@example.com"
                    />
                </div>
                <div>
                    <label htmlFor="message" className="block text-xs font-bold text-gray-500 uppercase mb-2">Message</label>
                    <textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        className="w-full bg-deep-anthracite border border-tungsten-grey rounded px-4 py-2 text-white focus:outline-none focus:border-hazard-amber transition-colors font-mono text-sm resize-none"
                        placeholder="Your message..."
                    ></textarea>
                </div>
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full flex items-center justify-center gap-2 bg-hazard-amber text-deep-anthracite font-bold py-3 rounded hover:bg-yellow-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isPending ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            SENDING...
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            SEND TRANSMISSION
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
