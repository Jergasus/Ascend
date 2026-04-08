import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Ascend",
  description: "Terms of Service for Ascend Habit Tracker",
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-white/60 mb-8">Last updated: April 9, 2026</p>

        <div className="space-y-8 text-white/80">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
            <p>
              By downloading, installing, or using the Ascend mobile application (&quot;App&quot;), 
              you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not 
              agree to these Terms, do not use the App.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
            <p>
              Ascend is a habit tracking application that helps users build and maintain 
              positive habits. The App allows you to create habits, track your progress, 
              view statistics, and receive reminders.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. User Accounts</h2>
            <p className="mb-4">
              To use Ascend, you must sign in using a Google account. You are responsible for:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Maintaining the security of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Pricing</h2>
            <p className="mb-4">
              Ascend is free to use with all features included. If you enjoy the app,
              you can support its development through voluntary donations via our
              Buy Me A Coffee page. Donations are entirely optional and do not unlock
              additional features.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Acceptable Use</h2>
            <p className="mb-4">You agree not to:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Use the App for any illegal purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with the proper functioning of the App</li>
              <li>Reverse engineer, decompile, or disassemble the App</li>
              <li>Use automated systems to access the App</li>
              <li>Resell or redistribute the App or its content</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Intellectual Property</h2>
            <p>
              The App, including its design, features, and content, is owned by Ascend 
              and protected by copyright, trademark, and other intellectual property laws. 
              You are granted a limited, non-exclusive, non-transferable license to use 
              the App for personal, non-commercial purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. User Content</h2>
            <p>
              You retain ownership of the habits and data you create in the App. By using 
              the App, you grant us a license to store and process this data to provide 
              our services. We will not share your habit data with third parties except 
              as described in our Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Disclaimer of Warranties</h2>
            <p>
              THE APP IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY 
              KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE APP WILL BE 
              UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">9. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, ASCEND SHALL NOT BE LIABLE FOR ANY 
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY 
              LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">10. Modifications to Service</h2>
            <p>
              We reserve the right to modify, suspend, or discontinue the App at any time, 
              with or without notice. We will not be liable to you or any third party for 
              any modification, suspension, or discontinuation of the App.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">11. Changes to Terms</h2>
            <p>
              We may update these Terms from time to time. We will notify you of any 
              material changes by posting the new Terms on this page. Your continued use 
              of the App after such changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">12. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws 
              of the jurisdiction in which Ascend operates, without regard to its conflict 
              of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">13. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
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
