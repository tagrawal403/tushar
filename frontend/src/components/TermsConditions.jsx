import React from "react";
import { FileText, Shield, Users, CreditCard, Gavel, AlertCircle } from "lucide-react";

const TermsConditions = () => {
  const sections = [
    {
      id: "acceptance-terms",
      title: "Acceptance of Terms", 
      icon: FileText,
      content: [
        "By accessing and using the THRYNN website and services, you accept and agree to be bound by these terms",
        "If you do not agree to these terms, please do not use our website or services",
        "We reserve the right to modify these terms at any time with reasonable notice",
        "Continued use of our services after changes constitutes acceptance of new terms"
      ]
    },
    {
      id: "user-accounts",
      title: "User Accounts & Registration",
      icon: Users,
      content: [
        "You must provide accurate and complete information when creating an account",
        "You are responsible for maintaining the security of your account and password",
        "You must be at least 18 years old or have parental consent to create an account", 
        "One person or entity may not maintain multiple accounts",
        "We reserve the right to suspend or terminate accounts for violations"
      ]
    },
    {
      id: "orders-payments",
      title: "Orders & Payments",
      icon: CreditCard,
      content: [
        "All orders are subject to acceptance and product availability",
        "Prices are subject to change without notice until order confirmation",
        "Payment must be received in full before order processing",
        "We accept major credit cards, debit cards, UPI, and digital wallets",
        "Order cancellation is permitted before shipment with full refund"
      ]
    },
    {
      id: "product-information",
      title: "Product Information & Availability",
      icon: Shield,
      content: [
        "We strive to provide accurate product descriptions and images",
        "Colors may vary slightly due to monitor settings and lighting",
        "Product availability is subject to change without notice",
        "We reserve the right to limit quantities purchased per customer",
        "Discontinued items will be clearly marked on the website"
      ]
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property Rights",
      icon: Gavel,
      content: [
        "All content on this website is owned by THRYNN or licensed partners",
        "You may not copy, distribute, or reproduce any content without permission",
        "Product images and descriptions are protected by copyright",
        "THRYNN trademarks and logos may not be used without authorization",
        "User-generated content may be used by THRYNN for marketing purposes"
      ]
    },
    {
      id: "prohibited-uses",
      title: "Prohibited Uses",
      icon: AlertCircle,
      content: [
        "Using our services for any unlawful or fraudulent purpose",
        "Attempting to gain unauthorized access to our systems",
        "Posting or transmitting harmful, offensive, or inappropriate content",
        "Interfering with or disrupting our website or servers",
        "Using automated systems to access or scrape our website"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <FileText className="text-orange-600" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4" data-testid="terms-conditions-title">
            Terms & Conditions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Please read these terms and conditions carefully before using the THRYNN website and services.
          </p>
          <div className="mt-6 text-sm text-gray-500">
            Last updated: October 2024
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Welcome to THRYNN</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            These Terms and Conditions ("Terms") govern your use of the THRYNN website, mobile applications, 
            and related services. These Terms constitute a legally binding agreement between you and THRYNN 
            regarding your use of our services.
          </p>
          <p className="text-gray-600 leading-relaxed">
            By accessing or using our services, you agree to comply with and be bound by these Terms. 
            If you do not agree with any part of these terms, you should not use our services.
          </p>
        </div>

        {/* Terms Sections */}
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

        {/* Liability & Disclaimers */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              THRYNN shall not be liable for any indirect, incidental, special, consequential, or punitive damages, 
              including but not limited to loss of profits, data, or other intangible losses resulting from your use 
              of our services.
            </p>
            <p>
              Our total liability to you for all damages, losses, and causes of action shall not exceed the amount 
              paid by you, if any, for accessing our services during the twelve (12) months immediately preceding 
              the date of the claim.
            </p>
            <p>
              We make no warranties or representations about the accuracy, reliability, completeness, or timeliness 
              of the content, services, software, text, graphics, and links on our website.
            </p>
          </div>
        </div>

        {/* Indemnification */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Indemnification</h2>
          <p className="text-gray-600 leading-relaxed">
            You agree to indemnify, defend, and hold harmless THRYNN, its officers, directors, employees, 
            agents, and affiliates from and against any and all claims, damages, obligations, losses, 
            liabilities, costs, or debt, and expenses (including attorney's fees) arising from your use 
            of our services, your violation of these Terms, or your violation of any third-party rights.
          </p>
        </div>

        {/* Governing Law */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Governing Law & Dispute Resolution</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Applicable Law</h3>
              <p className="text-sm text-gray-600">
                These Terms shall be governed by and construed in accordance with the laws of India, 
                without regard to its conflict of law provisions. Any legal action or proceeding arising 
                under these Terms will be brought exclusively in courts located in Mumbai, Maharashtra.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Dispute Resolution</h3>
              <p className="text-sm text-gray-600">
                We encourage resolving disputes through direct communication. If unsuccessful, 
                disputes will be resolved through binding arbitration in accordance with the 
                Arbitration and Conciliation Act, 2015.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
          <p className="text-gray-600 mb-4">
            If you have any questions about these Terms and Conditions, please contact us:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Legal Department</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Email: legal@thrynn.com</p>
                <p>Phone: +91-9876543210</p>
                <p>Address: THRYNN Pvt Ltd, Mumbai, Maharashtra, India</p>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Customer Support</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Email: support@thrynn.com</p>
                <p>Phone: +91-9876543211</p>
                <p>Hours: Mon-Sat, 9:00 AM - 8:00 PM IST</p>
              </div>
            </div>
          </div>
        </div>

        {/* Severability & Amendments */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Important Notes</h2>
          <div className="space-y-3 text-sm text-gray-700">
            <div>
              <h3 className="font-medium">Severability</h3>
              <p>If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.</p>
            </div>
            <div>
              <h3 className="font-medium">Amendments</h3>
              <p>We reserve the right to modify these Terms at any time. Changes will be posted on this page with an updated revision date.</p>
            </div>
            <div>
              <h3 className="font-medium">Waiver</h3>
              <p>No waiver of any term or condition shall be deemed a further or continuing waiver of such term or any other term.</p>
            </div>
          </div>
        </div>

        {/* Acknowledgment */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-sm p-6 mt-8 text-white text-center">
          <h2 className="text-xl font-semibold mb-2">Acknowledgment</h2>
          <p className="mb-4">
            By using THRYNN services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
          </p>
          <p className="text-sm text-orange-100">
            For questions or clarifications regarding these terms, please don't hesitate to contact our legal team.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;