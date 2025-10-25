import React from "react";
import { Link } from "react-router-dom";
import { Store, MapPin, Mail, Bell } from "lucide-react";

const StoreLocator = () => {
  return (
    <div className="min-h-screen bg-transparent">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold-200/10 border-2 border-gold-200 mb-6">
            <Store className="text-gold-200" size={40} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 luxury-heading">
            Store Locator
          </h1>
          <p className="text-xl text-gray-300">
            Find a Thrynn store near you
          </p>
        </div>

        {/* Coming Soon Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/40 rounded-3xl p-8 md:p-12 border border-gold-200/20 text-center">
            <div className="mb-8">
              <MapPin className="text-gold-200 mx-auto mb-4" size={64} />
              <h2 className="text-3xl font-bold text-white mb-4 luxury-heading">
                Physical Stores Coming Soon
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                We're currently an online-only brand, but we're working on bringing 
                the Thrynn experience to physical locations. Our goal is to open 
                flagship stores where you can touch, feel, and experience our premium 
                streetwear collection in person.
              </p>
            </div>

            {/* What to Expect */}
            <div className="bg-black/30 rounded-2xl p-6 mb-8 text-left">
              <h3 className="text-xl font-bold text-gold-200 mb-4">What to Expect:</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start space-x-3">
                  <span className="text-gold-200 mt-1">✓</span>
                  <span>Immersive brand experience with curated collections</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-gold-200 mt-1">✓</span>
                  <span>Exclusive in-store only drops and collaborations</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-gold-200 mt-1">✓</span>
                  <span>Personal styling consultations</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-gold-200 mt-1">✓</span>
                  <span>Community events and meetups</span>
                </li>
              </ul>
            </div>

            {/* Newsletter CTA */}
            <div className="border-t border-gold-200/20 pt-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Bell className="text-gold-200" size={24} />
                <h3 className="text-xl font-bold text-white">Stay Updated</h3>
              </div>
              <p className="text-gray-300 mb-6">
                Be the first to know when we open our doors. 
                Subscribe to our newsletter for updates on store launches in your city.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-gold-200 text-white"
                />
                <button className="px-6 py-3 bg-gold-200 hover:bg-gold-100 text-black rounded-lg font-medium transition-colors whitespace-nowrap">
                  Notify Me
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* In the Meantime */}
        <div className="max-w-2xl mx-auto mt-12 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">In the Meantime...</h3>
          <p className="text-gray-300 mb-6">
            Shop our full collection online with free shipping and easy returns
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="btn-primary"
            >
              Browse Collection
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors border border-gray-700"
            >
              <Mail className="inline mr-2" size={18} />
              Contact Us
            </Link>
          </div>
        </div>

        {/* Follow Us */}
        <div className="max-w-2xl mx-auto mt-16 text-center p-6 bg-black/20 rounded-2xl border border-gray-800">
          <p className="text-gray-300 mb-4">
            Follow us on social media for sneak peeks of upcoming store designs
          </p>
          <div className="flex justify-center space-x-4">
            <a href="https://instagram.com/thrynn" target="_blank" rel="noopener noreferrer" className="text-gold-200 hover:text-gold-100 transition-colors">
              Instagram
            </a>
            <span className="text-gray-600">•</span>
            <a href="https://twitter.com/thrynn" target="_blank" rel="noopener noreferrer" className="text-gold-200 hover:text-gold-100 transition-colors">
              Twitter
            </a>
            <span className="text-gray-600">•</span>
            <a href="https://facebook.com/thrynn" target="_blank" rel="noopener noreferrer" className="text-gold-200 hover:text-gold-100 transition-colors">
              Facebook
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreLocator;
