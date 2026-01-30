'use client';

import {
    FaFacebookF,
    FaTwitter,
    FaLinkedinIn,
    FaInstagram,
} from 'react-icons/fa';
import Link from 'next/link';
import { ArrowUp } from 'lucide-react';

const Footer = () => {
    const scrollToTop = () => {
        const hero = document.getElementById('hero-section');
        if (hero) {
            hero.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    };
    return (
        <footer className="bg-gray-900 text-gray-300 py-16">
            <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-8">
                {/* Company Info */}
                <div>
                    <h3 className="text-white text-xl font-bold mb-4">
                        CheFu Academy
                    </h3>
                    <p className="text-gray-400">
                        Learn, grow, and achieve your goals with our expertly
                        curated courses. Join a community of learners worldwide.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="text-white font-semibold mb-4">
                        Quick Links
                    </h4>
                    <ul className="space-y-2">
                        <li>
                            <Link href="/" className="hover:text-white">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href="/courses" className="hover:text-white">
                                Courses
                            </Link>
                        </li>
                        <li>
                            <Link href="about" className="hover:text-white">
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="mailto:chefu.inc@gmail.com"
                                className="hover:text-white"
                            >
                                Contact
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Resources */}
                <div>
                    <h4 className="text-white font-semibold mb-4">Resources</h4>
                    <ul className="space-y-2">
                        <li>
                            <Link href="/support" className="hover:text-white">
                                FAQ
                            </Link>
                        </li>
                        <li>
                            <Link href="/support" className="hover:text-white">
                                Support
                            </Link>
                        </li>

                        <li>
                            <Link
                                href="/privacy-policy"
                                className="hover:text-white"
                            >
                                Privacy Policy
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/terms-service"
                                className="hover:text-white"
                            >
                                Terms of Service
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Social Media */}
                <div>
                    <h4 className="text-white font-semibold mb-4">Follow Us</h4>
                    <div className="flex space-x-4">
                        <a
                            href="https://www.facebook.com/CheFu.Inc"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-500"
                        >
                            <FaFacebookF size={20} />
                        </a>
                        <a href="#" className="hover:text-primary">
                            <FaTwitter size={20} />
                        </a>
                        <a href="#" className="hover:text-indigo-500">
                            <FaLinkedinIn size={20} />
                        </a>
                        <a href="#" className="hover:text-pink-600">
                            <FaInstagram size={20} />
                        </a>
                    </div>
                </div>
            </div>

            <button
                onClick={scrollToTop}
                className="absolute right-5 bg-indigo-600 p-2 cursor-pointer rounded-full hover:bg-indigo-500 transition"
                aria-label="Back to Top"
            >
                <ArrowUp size={22} />
            </button>

            <div className="border-t border-gray-700 mt-12 pt-6 text-center text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} CheFu Academy. All rights
                reserved.
            </div>
        </footer>
    );
};

export default Footer;
