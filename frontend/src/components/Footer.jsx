import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook, Youtube } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = {
    customer: [
      { label: "Track Your Order", href: "/track-order" },
      { label: "Returns & Refunds", href: "/returns-policy" },
      { label: "Request Return", href: "/returns/request" },
      { label: "Shipping Policy", href: "/shipping-policy" },
      { label: "Size Guide", href: "/size-guide" }
    ],
    company: [
      { label: "About Us", href: "/about" },
      { label: "Store Locator", href: "/stores" }
    ],
    legal: [
      { label: "Terms & Conditions", href: "/terms-conditions" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Cookie Policy", href: "/cookie-policy" }
    ]
  };

  const socialLinks = [
    { icon: Instagram, href: "https://instagram.com/thrynn", label: "Instagram" },
    { icon: Facebook, href: "https://facebook.com/thrynn", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com/thrynn", label: "Twitter" },
    { icon: Youtube, href: "https://youtube.com/thrynn", label: "YouTube" }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Signup */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4" data-testid="newsletter-title">
              Stay in the Loop
            </h2>
            <p className="text-gray-400 mb-6">
              Be the first to know about new drops, exclusive offers, and streetwear trends
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-gold-200 text-white"
                data-testid="newsletter-email"
              />
              <button 
                className="px-6 py-3 bg-gold-200 hover:bg-gold-100 text-black rounded-lg font-medium transition-colors"
                data-testid="newsletter-subscribe"
              >
                Subscribe
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              By subscribing, you agree to our privacy policy and terms of service
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-4" data-testid="footer-logo">
              <img 
                src="/thrynn-logo.jpg" 
                alt="Thrynn Logo" 
                className="h-8 w-8 object-contain filter brightness-110"
              />
              <span className="text-2xl font-bold text-gold-200">THRYNN</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm">
              Elevating streetwear culture with premium designs that define modern urban style. 
              Where authenticity meets innovation.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-gold-200" />
                <a href="mailto:hello@thrynn.com" className="text-gray-400 hover:text-white transition-colors">
                  hello@thrynn.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-gold-200" />
                <a href="tel:+919876543210" className="text-gray-400 hover:text-white transition-colors">
                  +91-9876543210
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin size={16} className="text-gold-200 mt-1" />
                <span className="text-gray-400">
                  Mumbai, Maharashtra<br />
                  India - 400001
                </span>
              </div>
            </div>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="font-semibold text-white mb-4">Customer Care</h3>
            <ul className="space-y-3">
              {footerSections.customer.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href} 
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                    data-testid={`footer-link-${link.href.replace(/\//g, '-')}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3">
              {footerSections.company.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href} 
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                    data-testid={`footer-link-${link.href.replace(/\//g, '-')}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerSections.legal.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href} 
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                    data-testid={`footer-link-${link.href.replace(/\//g, '-')}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="font-semibold text-white mb-3">Follow Us</h3>
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-800 hover:bg-orange-500 rounded-lg transition-colors"
                      data-testid={`social-${social.label.toLowerCase()}`}
                      aria-label={social.label}
                    >
                      <IconComponent size={20} />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="text-center md:text-right">
              <h3 className="font-semibold text-white mb-3">We Accept</h3>
              <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                {["Visa", "Mastercard", "RuPay", "UPI", "Paytm", "PhonePe"].map((method) => (
                  <span 
                    key={method}
                    className="px-3 py-1 bg-gray-800 text-xs rounded text-gray-300"
                    data-testid={`payment-${method.toLowerCase()}`}
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between text-center md:text-left">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} THRYNN. All rights reserved. | Made with ❤️ in India
            </p>
            <div className="flex flex-wrap justify-center md:justify-end gap-6 text-xs text-gray-500">
              <span>GST: 27ABCDE1234F1Z5</span>
              <span>CIN: U74999MH2023PTC123456</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;