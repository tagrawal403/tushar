import React from "react";
import { Truck, Clock, MapPin, Package, IndianRupee, Globe } from "lucide-react";

const ShippingPolicy = () => {
  const shippingZones = [
    {
      zone: "Metro Cities",
      cities: "Mumbai, Delhi, Bangalore, Chennai, Kolkata, Hyderabad, Pune, Ahmedabad",
      standardTime: "1-2 business days",
      expressTime: "Same day/Next day",
      standardCost: "Free on orders ₹999+",
      expressCost: "₹199"
    },
    {
      zone: "Tier 1 Cities", 
      cities: "Jaipur, Lucknow, Kanpur, Nagpur, Indore, Bhopal, Coimbatore, Kochi",
      standardTime: "2-3 business days",
      expressTime: "1-2 business days",
      standardCost: "Free on orders ₹1,499+",
      expressCost: "₹299"
    },
    {
      zone: "Tier 2/3 Cities",
      cities: "Other cities and towns across India",
      standardTime: "3-5 business days",
      expressTime: "2-4 business days", 
      standardCost: "Free on orders ₹1,999+",
      expressCost: "₹399"
    }
  ];

  const shippingMethods = [
    {
      name: "Standard Shipping",
      icon: Package,
      description: "Reliable delivery with tracking",
      timeframe: "1-5 business days",
      cost: "Free on qualifying orders",
      features: ["Free packaging", "SMS & email updates", "Tracking included", "Signature on delivery"]
    },
    {
      name: "Express Shipping",
      icon: Truck, 
      description: "Faster delivery for urgent orders",
      timeframe: "Same day - 4 business days",
      cost: "₹199 - ₹399",
      features: ["Priority handling", "Real-time tracking", "Secure packaging", "Flexible delivery slots"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <Truck className="text-orange-600" size={32} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4" data-testid="shipping-policy-title">
            Shipping Policy
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Fast, reliable, and secure shipping across India. We're committed to getting your THRYNN orders to you quickly and safely.
          </p>
        </div>

        {/* Quick Overview */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-sm p-6 mb-8 text-white">
          <h2 className="text-2xl font-semibold mb-6">Shipping at a Glance</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Clock className="mx-auto mb-2" size={24} />
              <p className="font-medium">1-5 Days</p>
              <p className="text-sm text-blue-100">Delivery time</p>
            </div>
            <div className="text-center">
              <IndianRupee className="mx-auto mb-2" size={24} />
              <p className="font-medium">Free Shipping</p>
              <p className="text-sm text-blue-100">On orders ₹999+</p>
            </div>
            <div className="text-center">
              <Globe className="mx-auto mb-2" size={24} />
              <p className="font-medium">Pan-India</p>
              <p className="text-sm text-blue-100">Delivery available</p>
            </div>
            <div className="text-center">
              <Package className="mx-auto mb-2" size={24} />
              <p className="font-medium">Tracking</p>
              <p className="text-sm text-blue-100">On all orders</p>
            </div>
          </div>
        </div>

        {/* Shipping Methods */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6" data-testid="shipping-methods-title">
            Shipping Methods
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {shippingMethods.map((method) => {
              const IconComponent = method.icon;
              return (
                <div key={method.name} className="border border-gray-200 rounded-lg p-6" data-testid={`method-${method.name.toLowerCase().replace(/\s+/g, '-')}`}>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <IconComponent className="text-orange-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{method.name}</h3>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Time:</span>
                      <span className="font-medium">{method.timeframe}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cost:</span>
                      <span className="font-medium text-green-600">{method.cost}</span>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium text-gray-900 mb-2">Features:</p>
                    <ul className="space-y-1">
                      {method.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shipping Zones */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6" data-testid="shipping-zones-title">
            Delivery Timeline by Location
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Standard Shipping</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Express Shipping</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Free Shipping</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {shippingZones.map((zone, index) => (
                  <tr key={zone.zone} data-testid={`zone-${index}`}>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{zone.zone}</p>
                        <p className="text-sm text-gray-600">{zone.cities}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{zone.standardTime}</p>
                        <p className="text-sm text-gray-600">{zone.standardCost}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{zone.expressTime}</p>
                        <p className="text-sm text-gray-600">{zone.expressCost}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-green-600 font-medium">{zone.standardCost}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Processing & Shipping Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Package className="text-orange-600" size={24} />
              <h3 className="text-xl font-semibold text-gray-900">Order Processing</h3>
            </div>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <p className="font-medium text-gray-900">Processing Time</p>
                <p>Orders are processed within 1-2 business days (Monday-Friday)</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Order Cutoff</p>
                <p>Orders placed before 2:00 PM are processed the same day</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Weekend Orders</p>
                <p>Orders placed on weekends are processed on the next business day</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Holidays</p>
                <p>Processing may be delayed during national holidays</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <MapPin className="text-orange-600" size={24} />
              <h3 className="text-xl font-semibold text-gray-900">Delivery Details</h3>
            </div>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <p className="font-medium text-gray-900">Delivery Attempts</p>
                <p>Up to 3 delivery attempts will be made</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Address Requirements</p>
                <p>Complete address with landmark and phone number required</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Signature Required</p>
                <p>Adult signature required for orders above ₹5,000</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Undelivered Packages</p>
                <p>Returned to sender after failed delivery attempts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Special Circumstances */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Special Circumstances</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Delays & Exceptions</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Weather-related delays may occur during monsoons</li>
                <li>• Festival seasons may extend delivery times</li>
                <li>• Remote locations may require additional 1-2 days</li>
                <li>• COVID-19 restrictions may affect delivery schedules</li>
                <li>• Strike or bandh may cause temporary delays</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Additional Services</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Gift wrapping available for ₹49</li>
                <li>• Personal message cards included for free</li>
                <li>• Scheduled delivery dates (premium service)</li>
                <li>• Installation services for applicable products</li>
                <li>• White glove delivery for premium orders</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tracking Information */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Tracking</h2>
          <p className="text-gray-700 mb-4">
            Stay updated on your order status with our comprehensive tracking system:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm">Real-time SMS and email notifications</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm">Detailed tracking page with live updates</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm">Delivery partner contact details</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm">Estimated delivery time updates</span>
            </div>
          </div>
          <div className="mt-4">
            <a href="/track-order" className="btn-primary inline-block">
              Track Your Order
            </a>
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Need Help with Shipping?</h2>
          <p className="text-gray-600 mb-6">
            Our customer support team is here to help with any shipping-related questions or concerns.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Package size={20} className="text-orange-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Track Order</h3>
              <p className="text-sm text-gray-600 mb-3">Check your order status</p>
              <a href="/track-order" className="text-orange-500 hover:text-orange-600 text-sm font-medium">
                Track Now →
              </a>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Truck size={20} className="text-orange-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Delivery Issues</h3>
              <p className="text-sm text-gray-600 mb-3">Report delivery problems</p>
              <a href="mailto:delivery@thrynn.com" className="text-orange-500 hover:text-orange-600 text-sm font-medium">
                Report Issue →
              </a>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin size={20} className="text-orange-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Address Changes</h3>
              <p className="text-sm text-gray-600 mb-3">Update delivery address</p>
              <a href="mailto:support@thrynn.com" className="text-orange-500 hover:text-orange-600 text-sm font-medium">
                Contact Support →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;