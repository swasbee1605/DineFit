// src/components/Footer.jsx
import React from "react";
import { FaGithub, FaTwitter, FaLinkedin, FaDev, FaInstagram, FaYoutube } from "react-icons/fa";
import { SiNetlify } from "react-icons/si";

export default function Footer() {
    return (
        <footer className="mt-10 bg-white/10 backdrop-blur-lg border-t border-white/20 shadow-lg">
            <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">

                {/* Branding */}
                <div>
                    <h2 className="text-2xl font-bold text-teal-600">DineFit</h2>
                    <p className="text-gray-700 dark:text-gray-500 mt-2">
                        Plan delicious meals with ease.
                        Smart, fast, and personalized recipe discovery.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-800 mb-3">Quick Links</h3>
                    <ul className="space-y-2 text-gray-700 dark:text-gray-500">
                        <li><a href="/" className="hover:text-teal-500">Home</a></li>
                        <li><a href="/dashboard" className="hover:text-teal-500">Dashboard</a></li>
                        <li><a href="/recipes" className="hover:text-teal-500">Recipes</a></li>
                        <li><a href="/favorites" className="hover:text-teal-500">Favorites</a></li>
                    </ul>
                </div>

                {/* Social Links */}
                <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-800 mb-3">Follow Me</h3>
                    <div className="flex justify-center md:justify-start gap-6 text-2xl">
                        <a href="https://krishnasarathi.netlify.app" target="_blank" rel="noopener noreferrer" className="hover:text-teal-500">
                            <SiNetlify />
                        </a>
                        <a href="https://github.com/imkrishnasarathi" target="_blank" rel="noopener noreferrer" className="hover:text-teal-500">
                            <FaGithub />
                        </a>
                        <a href="https://dev.to/krishnasarathi" target="_blank" rel="noopener noreferrer" className="hover:text-teal-500">
                            <FaDev />
                        </a>
                        <a href="https://x.com/CodesKae" target="_blank" rel="noopener noreferrer" className="hover:text-teal-500">
                            <FaTwitter />
                        </a>
                        <a href="https://instagram.com/imkrishnasarathi" target="_blank" rel="noopener noreferrer" className="hover:text-teal-500">
                            <FaInstagram />
                        </a>
                        <a href="https://www.youtube.com/@krishcodes" target="_blank" rel="noopener noreferrer" className="hover:text-teal-500">
                            <FaYoutube />
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/20 text-center py-4 text-gray-600 dark:text-gray-400 text-sm">
                © {new Date().getFullYear()} DineFit. All rights reserved. | Built with ❤️ by Krishnasarathi
            </div>
        </footer>
    );
}
