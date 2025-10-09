import React from "react";
import { RotateCcw, Package, Clock, CheckCircle, AlertTriangle, Truck } from "lucide-react";

const ReturnsPolicy = () => {
  const returnSteps = [
    {
      step: 1,
      title: "Initiate Return",
      description: "Log into your account and select the item you want to return from your order history.",
      icon: RotateCcw,
      timeframe: "Within 30 days"
    },
    {
      step: 2, 
      title: "Print Return Label",
      description: "Download and print the prepaid return shipping label we'll email to you.",
      icon: Package,
      timeframe: "Instant"
    },
    {
      step: 3,
      title: "Pack & Ship",
      description: "Pack the item in original packaging with tags attached and drop off at any courier location.",
      icon: Truck,
      timeframe: "Same day"
    },
    {
      step: 4,
      title: "Processing",
      description: "We'll inspect the returned item and process your refund or exchange.",
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <RotateCcw className="text-orange-600" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4" data-testid="returns-policy-title">
            Returns & Refunds Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We want you to love your THRYNN purchase. If you're not completely satisfied, 
            we've made returns and exchanges simple and hassle-free.
          </p>
        </div>

        {/* Policy Overview */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-sm p-6 mb-8 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle size={32} />
            <div>
              <h2 className="text-2xl font-semibold">30-Day Return Policy</h2>
              <p className="text-green-100">Free returns and exchanges on all eligible items</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <Clock className="mx-auto mb-2" size={24} />
              <p className="font-medium">30 Days</p>
              <p className="text-sm text-green-100">Return window</p>
            </div>
            <div className="text-center">
              <Truck className="mx-auto mb-2" size={24} />
              <p className="font-medium">Free Shipping</p>
              <p className="text-sm text-green-100">On returns & exchanges</p>
            </div>
            <div className="text-center">
              <CheckCircle className="mx-auto mb-2" size={24} />
              <p className="font-medium">Easy Process</p>
              <p className="text-sm text-green-100">Online return portal</p>
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