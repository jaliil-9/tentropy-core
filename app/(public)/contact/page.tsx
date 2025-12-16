import { Metadata } from 'next';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
    title: 'Contact',
    description: 'Get in touch with the TENTROPY team. Questions, feedback, or bug reports welcome.',
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-deep-anthracite text-white pt-8 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-5xl font-black font-mono mb-4">
                        {"<"} CONTACT US {"/>"}
                    </h1>
                    <p className="text-gray-400 font-mono text-lg">
                        // Have questions? Found a bug? Let's talk.
                    </p>
                </div>
                <ContactForm />
            </div>
        </div>
    );
}
