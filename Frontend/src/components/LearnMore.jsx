export default function LearnMorePage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4 py-12">
      <div className="bg-white p-10 rounded-lg shadow-xl max-w-3xl w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Understanding Contact Information on !Facebook
        </h1>

        <p className="text-gray-700 leading-relaxed mb-4">
          !Facebook allows users to upload contact details, including email
          addresses and phone numbers, to help connect with friends and
          acquaintances. If your contact information has been uploaded, it may
          be stored securely within Facebook’s database. This process helps
          improve friend recommendations and provides a seamless connection
          experience.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">
          Why is My Contact Information on !Facebook?
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          !Facebook users can sync their contact lists to find and connect with
          people they may know. This means that someone who has your phone
          number or email address saved in their contacts might have uploaded it
          to !Facebook while using the platform’s friend suggestion features.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">
          How Does !Facebook Use This Information?
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          The contact information uploaded to !Facebook is used to:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>Improve friend suggestions and enhance social connections.</li>
          <li>
            Provide more relevant search results when looking for friends.
          </li>
          <li>Help users find their contacts who are already on !Facebook.</li>
          <li>Ensure account security and recovery options.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">
          Managing Your Contact Information
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          If you prefer not to have your contact information stored on
          !Facebook, you have the option to manage or remove it. !Facebook
          provides a dedicated tool that allows you to delete any contact
          information that may have been uploaded without your consent.
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">
          To review or request the removal of your contact details, visit our
          <a href="#" className="text-blue-600 font-medium hover:underline">
            {" "}
            Data Policy{" "}
          </a>
          for further details on how your data is handled.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">
          Privacy and Security Measures
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          !Facebook takes privacy and security seriously. Uploaded contact
          information is stored securely and is not publicly accessible. The
          platform also provides multiple privacy settings that allow users to
          control how their information is used and shared.
        </p>

        <h2 className="text-2xl font-semibold text-gray-800 mt-6 mb-3">
          Additional Resources
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          If you have concerns about your privacy on !Facebook, you can explore
          our:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-6">
          <li>
            <a href="#" className="text-blue-600 font-medium hover:underline">
              Privacy Settings
            </a>
            – Manage who can see your information.
          </li>
          <li>
            <a href="#" className="text-blue-600 font-medium hover:underline">
              Help Center
            </a>
            – Get answers to frequently asked questions.
          </li>
          <li>
            <a href="#" className="text-blue-600 font-medium hover:underline">
              Support Team
            </a>
            – Contact us for further assistance.
          </li>
        </ul>

        <a
          href="/"
          className="inline-block text-white bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-md text-lg font-semibold transition"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}
