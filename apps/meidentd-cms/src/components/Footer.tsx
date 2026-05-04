'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, ExternalLink, Linkedin, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="w-full bg-white text-gray-700 font-sans">

            {/* CTA Section */}
            {/* <div className="border-b border-gray-300 bg-gray-50">
                <div className="container mx-auto px-6 md:px-12 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-2xl text-gray-900 font-bold tracking-tight mb-2">
                            Ready to electrify the future?
                        </h3>
                        <p className="text-sm text-gray-600">
                            Contact our engineering team for custom T&D solutions.
                        </p>
                    </div>
                    <Link href="/contact-us">
                        <button className="px-6 py-3 bg-gray-900 hover:bg-blue-700 text-white text-xs font-medium tracking-wide uppercase transition-colors">
                            Get in Touch
                        </button>
                    </Link>
                </div>
            </div> */}

            {/* Main Footer Content */}
            <div className="container mx-auto px-6 md:px-12 py-16 lg:py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">

                    {/* Company Info */}
                    <div className="lg:col-span-4 space-y-8">
                        <Link href='/' className="block relative w-48 h-12">
                            <Image
                                src="/images/cmn_logo01.svg"
                                alt="Meiden T&D India Logo"
                                fill
                                className="object-contain object-left"
                            />
                        </Link>

                        <p className="text-sm leading-relaxed max-w-sm font-light text-gray-600">
                            A strategic subsidiary of Meidensha Corporation, Japan. Delivering world-class power transmission and distribution technology to India's industrial core since 2008.
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center gap-4">
                            <SocialLink href="#" icon={<Linkedin size={18} />} label="LinkedIn" />
                            <SocialLink href="#" icon={<Twitter size={18} />} label="Twitter" />
                            <SocialLink href="#" icon={<Facebook size={18} />} label="Facebook" />
                        </div>
                    </div>

                    {/* Company Links */}
                    <div className="lg:col-span-2 lg:col-start-6">
                        <FooterHeader>Company</FooterHeader>
                        <ul className="space-y-3">
                            <FooterLink href="/about-us">About Us</FooterLink>
                            <FooterLink href="/products">Products & Solutions</FooterLink>
                            <FooterLink href="/quality-policy">Quality Policy</FooterLink>
                            <FooterLink href="https://meidensha.zohorecruit.in/jobs/Careers" external>Careers</FooterLink>
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div className="lg:col-span-2">
                        <FooterHeader>Legal</FooterHeader>
                        <ul className="space-y-3">
                            <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
                            <FooterLink href="/terms">Terms of Use</FooterLink>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="lg:col-span-3">
                        <FooterHeader>Headquarters</FooterHeader>
                        <div className="space-y-4 text-sm font-light">
                            <div className="flex items-start gap-3">
                                <MapPin className="text-blue-700 mt-1 shrink-0" size={16} />
                                <span className="text-gray-700">
                  Unit No. 01, 12th Floor,<br />
                  Building No. 9B, DLF Cyber City,<br />
                  Phase III, Gurgaon - 122002, India
                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="text-blue-700 shrink-0" size={16} />
                                <a href="tel:+911244389600" className="text-gray-700 hover:text-blue-700 transition-colors">+91 124 438 9600</a>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="text-blue-700 shrink-0" size={16} />
                                <a href="mailto:info@meidensha.com" className="text-gray-700 hover:text-blue-700 transition-colors">info@meidensha.com</a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-gray-300" style={{ backgroundColor: '#113388' }}>
                <div className="container mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4">

                    <div className="flex flex-col md:flex-row items-center gap-4 text-xs font-medium text-gray-100 uppercase tracking-wide">
                        <span>&copy; {currentYear} Meiden T&D (India) Ltd.</span>
                        <span className="hidden md:block text-gray-400">|</span>
                        <span>All Rights Reserved.</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <a
                            href="https://www.meidensha.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-blue-700 transition-colors"
                        >
                            <span className="uppercase tracking-widest">Meidensha Global</span>
                            <ExternalLink size={12} className="opacity-50 group-hover:opacity-100" />
                        </a>

                        <button
                            onClick={scrollToTop}
                            className="p-2 bg-gray-300 hover:bg-blue-700 text-gray-900 hover:text-white rounded transition-colors"
                            aria-label="Scroll to top"
                        >
                            ⇧
                        </button>
                    </div>

                </div>
            </div>

        </footer>
    );
}

function FooterHeader({ children }: { children: React.ReactNode }) {
    return (
        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-6">
            {children}
        </h4>
    );
}

function FooterLink({ href, children, external }: { href: string, children: React.ReactNode, external?: boolean }) {
    return (
        <li>
            <Link
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="text-sm text-gray-600 hover:text-blue-700 transition-colors"
            >
                {children}
            </Link>
        </li>
    );
}

function SocialLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
    return (
        <a
            href={href}
            aria-label={label}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 border border-gray-300 text-gray-700 hover:border-blue-700 hover:bg-blue-700 hover:text-white transition-all duration-300"
        >
            {icon}
        </a>
    );
}