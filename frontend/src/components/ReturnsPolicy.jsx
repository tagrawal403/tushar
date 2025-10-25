import React from "react";
import { RotateCcw, Package, Clock, CheckCircle, AlertTriangle, Truck } from "lucide-react";

const ReturnsPolicy = () => {
  const returnSteps = [
    {
      step: 1,
      title: "Place Return Request",
      description: "Log into your account and select the item you want to return from your order history. Submit the return request with the reason.",
      icon: RotateCcw,
      timeframe: "Within 30 days"
    },
    {
      step: 2, 
      title: "Pickup Arranged",
      description: "We will arrange for a pickup from your address. No need to ship it yourself! Our team will coordinate the pickup time with you.",
      icon: Truck,
      timeframe: "1-2 business days"
    },
    {
      step: 3,
      title: "Quality Check",
      description: "Once we receive the item, our quality team will inspect it to ensure it meets our return criteria.",
      icon: Package,
      timeframe: "2-3 business days"
    },
    {
      step: 4,
      title: "Refund Initiated",
      description: "After successful quality check, we'll process your refund to the original payment method.",
      icon: CheckCircle,
      timeframe: "3-5 business days"
    }
  ];

  const eligibilityCriteria = [
    "Item must be returned within 30 days of delivery",
    "Product must be in original condition with tags attached",
    "Original packaging must be included",
    "Proof of purchase required (order confirmation)",
    "Items must be unwashed and unworn (except for trying on)",
    "Custom or personalized items are not eligible for returns"
  ];

  const nonReturnableItems = [
    "Underwear and intimate apparel",
    "Custom or personalized items", 
    "Items marked as 'Final Sale'",
    "Damaged items due to misuse",
    "Items without original tags or packaging"
  ];

  return (
    <div className="min-h-screen bg-transparent py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-200/10 rounded-full mb-4 border-2 border-gold-200">
            <RotateCcw className="text-gold-200" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 luxury-heading" data-testid="returns-policy-title">
            Returns & Refunds Policy
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            We want you to love your THRYNN purchase. If you're not completely satisfied, 
            we've made returns and exchanges simple and hassle-free with free pickup!
          </p>
        </div>

        {/* Policy Overview */}
        <div className="bg-gradient-to-r from-gold-200/20 to-gold-100/20 rounded-lg border border-gold-200/30 p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle size={32} className="text-gold-200" />
            <div>
              <h2 className="text-2xl font-semibold text-white">30-Day Return Policy</h2>
              <p className="text-gray-300">Free pickup arranged at your doorstep for all eligible items</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <Clock className="mx-auto mb-2 text-gold-200" size={24} />
              <p className="font-medium text-white">30 Days</p>
              <p className="text-sm text-gray-300">Return window</p>
            </div>
            <div className="text-center">
              <Truck className="mx-auto mb-2 text-gold-200" size={24} />
              <p className="font-medium text-white">Free Pickup</p>
              <p className="text-sm text-gray-300">We arrange pickup</p>
            </div>
            <div className="text-center">
              <CheckCircle className="mx-auto mb-2 text-gold-200" size={24} />
              <p className="font-medium text-white">Easy Process</p>
              <p className="text-sm text-gray-300">Online return portal</p>
            </div>
          </div>
        </div>

        {/* Return Process */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6" data-testid="return-process-title">
            How to Return an Item
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {returnSteps.map((step) => {
              const IconComponent = step.icon;
              return (
                <div key={step.step} className="text-center" data-testid={`return-step-${step.step}`}>
                  <div className="relative mb-4">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                      <IconComponent className="text-orange-600" size={24} />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                  <div className="text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded-full inline-block">
                    {step.timeframe}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-8 text-center">
            <a 
              href="/returns/request" 
              className="btn-primary inline-flex items-center space-x-2"
              data-testid="start-return-button"
            >
              <RotateCcw size={20} />
              <span>Start a Return</span>
            </a>
          </div>
        </div>

        {/* Eligibility Criteria */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="text-green-500" size={24} />
              <h3 className="text-xl font-semibold text-gray-900">Eligible for Returns</h3>
            </div>
            <ul className="space-y-3">
              {eligibilityCriteria.map((criteria, index) => (
                <li key={index} className="flex items-start space-x-3" data-testid={`eligible-criteria-${index}`}>
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-600 text-sm">{criteria}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="text-red-500" size={24} />
              <h3 className="text-xl font-semibold text-gray-900">Not Eligible</h3>
            </div>
            <ul className="space-y-3">
              {nonReturnableItems.map((item, index) => (
                <li key={index} className="flex items-start space-x-3" data-testid={`non-returnable-${index}`}>
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-600 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Refund Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Refund Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Processing Time</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Inspection & Approval:</span>
                  <span className="font-medium">1-2 business days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Credit Card Refund:</span>
                  <span className="font-medium">3-5 business days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">UPI/Wallet Refund:</span>
                  <span className="font-medium">1-2 business days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bank Transfer:</span>
                  <span className="font-medium">5-7 business days</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Refund Method</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• Refunds will be processed to the original payment method</p>
                <p>• Store credit is available for faster processing</p>
                <p>• Exchanges have priority over refunds</p>
                <p>• Shipping charges are non-refundable (except for defective items)</p>
                <p>• You'll receive email confirmation once refund is processed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Exchanges */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Exchanges</h2>
          <p className="text-gray-700 mb-4">
            Need a different size or color? Exchanges are processed faster than returns and refunds. 
            Simply select "Exchange" when initiating your return request.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="text-green-500" size={20} />
              <span className="text-sm">Free exchange shipping</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="text-green-500" size={20} />
              <span className="text-sm">Priority processing</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="text-green-500" size={20} />
              <span className="text-sm">Same return policy applies</span>
            </div>
            <div className="flex items-center space-x-3">
              <CheckCircle className="text-green-500" size={20} />
              <span className="text-sm">Multiple exchanges allowed</span>
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Need Help with Returns?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Package size={20} className="text-orange-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Return Portal</h3>
              <p className="text-sm text-gray-600 mb-3">Manage your returns online</p>
              <a href="/returns/request" className="text-orange-500 hover:text-orange-600 text-sm font-medium">
                Start Return →
              </a>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle size={20} className="text-orange-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Track Return</h3>
              <p className="text-sm text-gray-600 mb-3">Check your return status</p>
              <a href="/track-order" className="text-orange-500 hover:text-orange-600 text-sm font-medium">
                Track Return →
              </a>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle size={20} className="text-orange-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Contact Support</h3>
              <p className="text-sm text-gray-600 mb-3">Get help from our team</p>
              <a href="mailto:returns@thrynn.com" className="text-orange-500 hover:text-orange-600 text-sm font-medium">
                Email Support →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnsPolicy;