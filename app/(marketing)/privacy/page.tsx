import React from 'react';

export default function PrivacyPolicy() {
    return (
        <div className="container mx-auto px-4 pt-8 pb-12 max-w-4xl text-gray-300 prose prose-invert prose-headings:text-white prose-a:text-hazard-amber">
            <h1 className="text-4xl font-bold mb-8 text-white">Privacy Policy</h1>
            <p className="text-sm text-gray-500 mb-8">Last Updated: December 2025</p>

            <section className="mb-8">
                <h2>1. Introduction</h2>
                <p>
                    Welcome to TENTROPY. We are committed to protecting your personal information and your right to privacy.
                    This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
                </p>
            </section>

            <section className="mb-8">
                <h2>2. Information We Collect</h2>
                <p>We collect information that you provide directly to us when you:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>Register for an account (email address, username, password).</li>
                    <li>Participate in coding challenges (submitted code, execution results).</li>
                    <li>Contact us for support.</li>
                </ul>
                <p className="mt-4">
                    <strong>Automated Information:</strong> We automatically collect certain information when you visit, use, or navigate the site. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our site, and other technical information.
                </p>
            </section>

            <section className="mb-8">
                <h2>3. How We Use Your Information</h2>
                <p>We use the information we collect or receive:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>To facilitate account creation and logon processes.</li>
                    <li>To provide and manage the coding challenges and your progress.</li>
                    <li>To improve our services and user experience (analytics).</li>
                    <li>To enforce our terms, conditions, and policies.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2>4. Sharing Your Information</h2>
                <p>We may process or share your data that we hold based on the following legal basis:</p>
                <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Consent:</strong> We may process your data if you have given us specific consent to use your personal information for a specific purpose.</li>
                    <li><strong>Legitimate Interests:</strong> We may process your data when it is reasonably necessary to achieve our legitimate business interests.</li>
                    <li><strong>Legal Obligations:</strong> We may disclose your information where we are legally required to do so.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2>5. Cookies and Tracking Technologies</h2>
                <p>
                    We use cookies and similar tracking technologies (like web beacons and pixels) to access or store information.
                    Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice.
                </p>
            </section>

            <section className="mb-8">
                <h2>6. Data Security</h2>
                <p>
                    We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process.
                    However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
                </p>
            </section>

            <section className="mb-8">
                <h2>7. Contact Us</h2>
                <p>
                    If you have questions or comments about this policy, you may email us at <a href="mailto:jalilbouziane09@gmail.com">jalilbouziane09@gmail.com</a>.
                </p>
            </section>
        </div>
    );
}
