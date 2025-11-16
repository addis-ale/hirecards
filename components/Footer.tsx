import Link from "next/link";
import { Sparkles, Twitter, Linkedin, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 md:py-16">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">HireCards</span>
            </Link>
            <p className="text-gray-400 mb-4 max-w-sm">
              Turn hiring chaos into battle-ready cards. Or keep drowning in
              Google Docs. Your call.
            </p>
            <div className="flex items-center space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-bold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/#features"
                  className="hover:text-primary-400 transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/#how-it-works"
                  className="hover:text-primary-400 transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/create"
                  className="hover:text-primary-400 transition-colors"
                >
                  Create Deck
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-primary-400 transition-colors"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="hover:text-primary-400 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-primary-400 transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-primary-400 transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-primary-400 transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-400 mb-4 md:mb-0">
            © 2025 HireCards™ | Not liable for suddenly good hiring decisions
          </p>
          <div className="flex items-center space-x-6 text-sm">
            <Link href="#" className="hover:text-primary-400 transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-primary-400 transition-colors">
              Terms
            </Link>
            <Link href="#" className="hover:text-primary-400 transition-colors">
              Why This?
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
