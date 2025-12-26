// src/components/layout/Footer.tsx
import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-emerald-900 text-white">
            <div className="container mx-auto px-4 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Home Sweet Home</h3>
                        <p className="text-emerald-200 mb-6">
                            Premium furniture for every home. Crafted with care, designed for comfort.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-emerald-200 hover:text-white transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-emerald-200 hover:text-white transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-emerald-200 hover:text-white transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold mb-4">Shop</h4>
                        <ul className="space-y-2">
                            <li><Link href="/shop/living-room" className="text-emerald-200 hover:text-white transition-colors">Living Room</Link></li>
                            <li><Link href="/shop/bedroom" className="text-emerald-200 hover:text-white transition-colors">Bedroom</Link></li>
                            <li><Link href="/shop/dining" className="text-emerald-200 hover:text-white transition-colors">Dining</Link></li>
                            <li><Link href="/shop/office" className="text-emerald-200 hover:text-white transition-colors">Office</Link></li>
                            <li><Link href="/shop" className="text-emerald-200 hover:text-white transition-colors">All Collections</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-semibold mb-4">Support</h4>
                        <ul className="space-y-2">
                            <li><Link href="/faq" className="text-emerald-200 hover:text-white transition-colors">FAQ</Link></li>
                            <li><Link href="/shipping" className="text-emerald-200 hover:text-white transition-colors">Shipping</Link></li>
                            <li><Link href="/returns" className="text-emerald-200 hover:text-white transition-colors">Returns</Link></li>
                            <li><Link href="/contact" className="text-emerald-200 hover:text-white transition-colors">Contact Us</Link></li>
                            <li><Link href="/warranty" className="text-emerald-200 hover:text-white transition-colors">Warranty</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-semibold mb-4">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-center space-x-3">
                                <Phone className="h-5 w-5 text-emerald-300" />
                                <span className="text-emerald-200">+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail className="h-5 w-5 text-emerald-300" />
                                <span className="text-emerald-200">hello@homesweethome.com</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <MapPin className="h-5 w-5 text-emerald-300" />
                                <span className="text-emerald-200">123 Design Street, New York</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-emerald-800 pt-8">
                    {/* Trust Badges */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                        <div className="text-center">
                            <div className="text-sm font-medium mb-1">Free Shipping</div>
                            <div className="text-xs text-emerald-300">Over $500</div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm font-medium mb-1">2-Year Warranty</div>
                            <div className="text-xs text-emerald-300">Quality Guaranteed</div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm font-medium mb-1">Secure Payment</div>
                            <div className="text-xs text-emerald-300">100% Secure</div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm font-medium mb-1">14-Day Returns</div>
                            <div className="text-xs text-emerald-300">Easy Returns</div>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="text-center">
                        <p className="text-emerald-300 text-sm">
                            © {currentYear} Home Sweet Home. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}