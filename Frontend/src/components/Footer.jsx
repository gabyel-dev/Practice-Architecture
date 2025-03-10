export default function Footer() {
  return (
    <footer className="bg-white text-gray-600 text-sm border-t border-gray-300 mt-10">
      <div className="max-w-4xl mx-auto py-4 flex flex-col items-center">
        {/* Footer Links */}
        <div className="flex space-x-4 mb-2">
          <a href="#" className="hover:underline">
            About
          </a>
          <a href="#" className="hover:underline">
            Privacy
          </a>
          <a href="#" className="hover:underline">
            Terms
          </a>
          <a href="#" className="hover:underline">
            Help
          </a>
        </div>

        {/* Copyright */}
        <p>© {new Date().getFullYear()} !Facebook. All rights reserved.</p>
      </div>
    </footer>
  );
}
