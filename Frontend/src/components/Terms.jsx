import React from "react";

export default function TermsAndConditions() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4 py-12">
      <div className="bg-white p-10 rounded-lg shadow-xl max-w-3xl w-full">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center text-blue-600">
          Terms and Conditions
        </h1>
        <p className="text-gray-500 text-center mb-6">
          Last Updated: March 11, 2025
        </p>
        <p className="text-gray-700 leading-relaxed">
          Welcome to <strong>!Facebook</strong>. By accessing or using our
          services, you agree to comply with and be bound by the following terms
          and conditions. If you do not agree with any part of these terms, you
          may not use our services.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">
          1. Acceptance of Terms
        </h2>
        <p className="text-gray-700 leading-relaxed">
          By creating an account or using <strong>!Facebook</strong>, you
          confirm that you are at least 13 years old and legally capable of
          entering into these Terms and Conditions.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">
          2. User Accounts
        </h2>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>
            You are responsible for maintaining the confidentiality of your
            account credentials.
          </li>
          <li>
            You agree not to share your login details or allow others to access
            your account.
          </li>
          <li>
            We reserve the right to suspend or terminate accounts that violate
            these terms.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">
          3. Acceptable Use
        </h2>
        <p className="text-gray-700 leading-relaxed">
          When using <strong>!Facebook</strong>, you agree not to:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>
            Post or share content that is illegal, harmful, defamatory, or
            violates the rights of others.
          </li>
          <li>Engage in harassment, bullying, or any form of abuse.</li>
          <li>
            Use automated tools or bots to access our services without
            permission.
          </li>
          <li>
            Attempt to hack, disrupt, or interfere with the platform’s
            functionality.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">
          4. Content Ownership & Rights
        </h2>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>
            You retain ownership of any content you post on{" "}
            <strong>!Facebook</strong>.
          </li>
          <li>
            By posting content, you grant us a non-exclusive, worldwide,
            royalty-free license to use, display, and distribute your content
            within our platform.
          </li>
          <li>
            We reserve the right to remove content that violates our policies.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">
          5. Privacy & Data Protection
        </h2>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>
            We collect and store user data as outlined in our{" "}
            <strong>Privacy Policy</strong>.
          </li>
          <li>
            Your personal information will not be sold to third parties without
            your consent.
          </li>
          <li>
            By using our services, you agree to the collection and use of your
            data in accordance with our policies.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">
          6. Limitation of Liability
        </h2>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>
            <strong>!Facebook</strong> is provided "as is" without any
            warranties.
          </li>
          <li>
            We are not responsible for any direct, indirect, or incidental
            damages resulting from your use of the platform.
          </li>
          <li>We do not guarantee uninterrupted or error-free service.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">
          7. Termination of Service
        </h2>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>
            We reserve the right to suspend or terminate accounts that violate
            these terms or engage in harmful activities.
          </li>
          <li>You may deactivate your account at any time.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">
          8. Changes to Terms
        </h2>
        <p className="text-gray-700 leading-relaxed">
          We may update these Terms and Conditions at any time. You will be
          notified of major changes, and continued use of{" "}
          <strong>!Facebook</strong> implies acceptance of the updated terms.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">
          9. Contact Information
        </h2>
        <p className="text-gray-700 leading-relaxed">
          For any questions regarding these Terms and Conditions, please contact
          us at lukeheinsley@gmail.com.
        </p>

        <p className="mt-6 text-gray-700 text-center font-medium">
          By using <strong>!Facebook</strong>, you acknowledge that you have
          read, understood, and agreed to these Terms and Conditions.
        </p>
        <a
          href="/"
          className="inline-block text-white bg-blue-600 hover:bg-blue-700 px-6 py-3 mt-10 rounded-md text-lg font-semibold transition"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}
