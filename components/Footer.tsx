"use client";

import Link from "next/link";
import { Sparkles, Twitter, Linkedin, Github } from "lucide-react";
import { useChatbot } from "./ChatbotProvider";

export default function Footer() {
  const { openChatbot } = useChatbot();
  return (
    <footer
      className="text-gray-300 py-8 md:py-10"
      style={{ backgroundColor: "#0B1E3F" }}
    >
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-3">
              <div className="w-10 h-10 bg-[#3B7CFF] rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">HireCards</span>
            </Link>
            <p className="text-gray-400 mb-3 max-w-sm text-sm">
              Turn hiring chaos into battle-ready cards. Or keep drowning in
              Google Docs. Your call.
            </p>
            <div className="flex items-center space-x-3">
              <a
                href="#"
                className="w-9 h-9 bg-indigo-900/50 rounded-lg flex items-center justify-center hover:bg-[#3B7CFF] transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-indigo-900/50 rounded-lg flex items-center justify-center hover:bg-[#3B7CFF] transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-indigo-900/50 rounded-lg flex items-center justify-center hover:bg-[#3B7CFF] transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-bold mb-3 text-sm">Product</h3>
            <ul className="space-y-1.5 text-sm">
              <li>
                <Link
                  href="/#features"
                  className="hover:text-[#3B7CFF] transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/#how-it-works"
                  className="hover:text-[#3B7CFF] transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <button
                  onClick={() => openChatbot()}
                  className="hover:text-[#3B7CFF] transition-colors text-left"
                >
                  Create Deck
                </button>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-bold mb-3 text-sm">Company</h3>
            <ul className="space-y-1.5 text-sm">
              <li>
                <Link
                  href="#"
                  className="hover:text-[#3B7CFF] transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-[#3B7CFF] transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="border-t pt-6 flex flex-col md:flex-row items-center justify-between"
          style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
        >
          <p className="text-sm text-gray-400 mb-3 md:mb-0">
            © 2025 HireCards™ | Not liable for suddenly good hiring decisions
          </p>
          <div className="flex items-center space-x-6 text-sm">
            <Link href="#" className="hover:text-green-400 transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-green-400 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
