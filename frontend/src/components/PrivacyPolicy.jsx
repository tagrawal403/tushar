import React from "react";
import { Shield, Lock, Eye, UserCheck, Globe, Mail } from "lucide-react";

const PrivacyPolicy = () => {
  const sections = [
    {
      id: "information-collection",
      title: "Information We Collect",
      icon: UserCheck,
      content: [
        "Personal information you provide (name, email, phone number, shipping address)",
        "Account information (username, password, preferences)",
        "Payment information (processed securely through our payment partners)",
        "Device and usage information (IP address, browser type, pages visited)",
        "Communication history with our support team"
      ]
    },
    {
      id: "information-use", 
      title: "How We Use Your Information",
      icon: Globe,
      content: [
        "Process and fulfill your orders and transactions",
        "Provide customer support and respond to inquiries",
        "Send order confirmations, shipping updates, and account notifications",
        "Improve our website, products, and services",
        "Personalize your shopping experience",
        "Comply with legal obligations and prevent fraud"
      ]
    },
    {
      id: "information-sharing",
      title: "Information Sharing",
      icon: Shield,
      content: [
        "We do not sell, trade, or rent your personal information to third parties",
        "We may share information with trusted service providers who assist us in operations",
        "Information may be disclosed if required by law or to protect our rights",
        "Anonymous, aggregated data may be used for analytics and improvements"
      ]
    },
    {
      id: "data-security",
      title: "Data Security",
      icon: Lock,
      content: [
        "We implement industry-standard security measures to protect your data",
        "Payment information is encrypted and processed by PCI-compliant providers",
        "Access to personal information is restricted to authorized personnel only",
        "Regular security audits and updates to maintain data protection",
        "Secure data transmission using SSL/TLS encryption"
      ]
    },
    {
      id: "cookies-tracking",
      title: "Cookies and Tracking",
      icon: Eye,
      content: [
        "We use cookies to enhance your browsing experience",
        "Essential cookies are required for website functionality",
        "Analytics cookies help us understand user behavior and improve our site",
        "You can manage cookie preferences through your browser settings",
        "Third-party cookies may be used for advertising and social media features"
      ]
    },
    {
      id: "user-rights",
      title: "Your Rights",
      icon: UserCheck,
      content: [
        "Access and review your personal information",
        "Request correction of inaccurate or incomplete data", 
        "Delete your account and associated personal information",
        "Opt-out of marketing communications at any time",
        "Data portability - receive a copy of your data in a structured format",
        "File complaints with relevant data protection authorities"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <Shield className="text-orange-600" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4" data-testid="privacy-policy-title">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how THRYNN collects, uses, and protects your personal information.
          </p>
          <div className="mt-6 text-sm text-gray-500">
            Last updated: October 2024
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Commitment to Privacy</h2>
          <p className="text-gray-600 leading-relaxed">
            At THRYNN, we are committed to protecting your privacy and ensuring the security of your personal information. 
            This Privacy Policy describes how we collect, use, share, and protect information about you when you use our 
            website, mobile applications, and services. By using our services, you agree to the collection and use of 
            information in accordance with this policy.
          </p>
        </div>

        {/* Policy Sections */}
        <div className="space-y-8">
          {sections.map((section) => {
            const IconComponent = section.icon;
            return (
              <div key={section.id} className="bg-white rounded-lg shadow-sm p-6" data-testid={`section-${section.id}`}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <IconComponent className="text-orange-600" size={24} />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {section.title}
                  </h2>
                </div>
                
                <ul className="space-y-3">
                  {section.content.map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-600 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Third Party Services */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Third-Party Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Payment Processing</h3>
              <p className="text-sm text-gray-600">
                We use secure payment processors like Razorpay to handle transactions. 
                These services have their own privacy policies governing the use of your information.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Analytics</h3>
              <p className="text-sm text-gray-600">
                We may use analytics services to understand how our website is used and to improve our services. 
                These tools collect information about your usage patterns.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-sm p-6 mt-8 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <Mail size={24} />
            <h2 className="text-xl font-semibold">Questions About Privacy?</h2>
          </div>
          <p className="mb-4">
            If you have any questions about this Privacy Policy or how we handle your personal information, 
            please don't hesitate to contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="mailto:privacy@thrynn.com" 
              className="bg-white text-orange-600 px-6 py-2 rounded-lg font-medium hover:bg-orange-50 transition-colors"
              data-testid="privacy-contact-email"
            >
              Email: privacy@thrynn.com
            </a>
            <a 
              href="tel:+91-9876543210" 
              className="bg-white/10 border border-white/20 px-6 py-2 rounded-lg font-medium hover:bg-white/20 transition-colors"
              data-testid="privacy-contact-phone"
            >
              Phone: +91-9876543210
            </a>
          </div>
        </div>

        {/* Policy Updates */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Policy Updates</h2>
          <p className="text-gray-700 text-sm">
            We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. 
            We will notify you of any material changes by posting the updated policy on our website and updating the 
            "Last updated" date. Your continued use of our services after such changes constitutes acceptance of the updated policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;