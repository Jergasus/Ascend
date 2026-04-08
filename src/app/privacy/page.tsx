import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Ascend",
  description: "Privacy Policy for Ascend Habit Tracker",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-white/60 mb-8">Last updated: April 9, 2026</p>

        <div className="space-y-8 text-white/80">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Introduction</h2>
            <p>
              Welcome to Ascend (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your 
              privacy and personal information. This Privacy Policy explains how we collect, use, 
              and safeguard your data when you use our mobile application and related services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-medium text-white mb-2">2.1 Account Information</h3>
            <p className="mb-4">
              When you sign in with Google, we collect your name, email address, and profile picture 
              to create and manage your account.
            </p>
            
            <h3 className="text-xl font-medium text-white mb-2">2.2 Habit Data</h3>
            <p className="mb-4">
              We store the habits you create, including habit names, categories, frequencies, 
              colors, and completion records. This data is essential for the app to function.
            </p>
            
            <h3 className="text-xl font-medium text-white mb-2">2.3 Usage Data</h3>
            <p>
              We may collect anonymous usage statistics to improve our services, such as 
              app performance metrics and feature usage patterns.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>To provide and maintain the Ascend service</li>
              <li>To sync your habits across devices</li>
              <li>To send you habit reminders (if enabled)</li>
              <li>To improve and optimize the app experience</li>
              <li>To communicate important updates about the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Data Storage and Security</h2>
            <p>
              Your data is stored securely using industry-standard encryption. We use trusted 
              third-party services (such as cloud databases) that comply with data protection 
              regulations. We implement appropriate technical and organizational measures to 
              protect your personal information against unauthorized access, alteration, or destruction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Third-Party Services</h2>
            <p className="mb-4">We use the following third-party services:</p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Google Sign-In:</strong> For authentication</li>
              <li><strong>Apple App Store / Google Play:</strong> For app distribution</li>
              <li><strong>Vercel:</strong> For hosting our web services</li>
            </ul>
            <p className="mt-4">
              These services have their own privacy policies, and we encourage you to review them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Data Retention</h2>
            <p>
              We retain your personal data for as long as your account is active or as needed 
              to provide you services. If you delete your account, we will delete your personal 
              data within 30 days, except where we are required to retain it for legal purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Export your data in a portable format</li>
              <li>Opt out of marketing communications</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, please contact us at the email address below.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Children&apos;s Privacy</h2>
            <p>
              Ascend is not intended for children under 13 years of age. We do not knowingly 
              collect personal information from children under 13. If you believe we have 
              collected such information, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any 
              changes by posting the new Privacy Policy on this page and updating the 
              &quot;Last updated&quot; date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our data practices, 
              please contact us at:
            </p>
            <p className="mt-4">
              <strong>Email:</strong> ascend.project.help@gmail.com
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/40">
          <p>© {new Date().getFullYear()} Ascend. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
