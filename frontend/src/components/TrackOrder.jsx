import React, { useState, useContext } from "react";
import { AuthContext } from "../App";
import { Search, Package, Truck, CheckCircle, MapPin, Calendar } from "lucide-react";
import { toast } from "sonner";

const TrackOrder = () => {
  const { user } = useContext(AuthContext);
  const [orderNumber, setOrderNumber] = useState("");
  const [trackingResult, setTrackingResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock tracking data
  const mockTrackingData = {
    orderId: "THRYNN123456",
    status: "shipped",
    estimatedDelivery: "Oct 12, 2024",
    currentLocation: "Delhi Sorting Facility",
    trackingSteps: [
      {
        status: "Order Confirmed",
        date: "Oct 9, 2024",
        time: "2:30 PM",
        completed: true,
        icon: CheckCircle,
        description: "Your order has been confirmed and payment received"
      },
      {
        status: "Processing",
        date: "Oct 9, 2024", 
        time: "6:45 PM",
        completed: true,
        icon: Package,
        description: "Order is being prepared for shipment"
      },
      {
        status: "Shipped",
        date: "Oct 10, 2024",
        time: "11:20 AM", 
        completed: true,
        icon: Truck,
        description: "Package has been shipped and is on its way"
      },
      {
        status: "Out for Delivery",
        date: "Oct 12, 2024",
        time: "Expected",
        completed: false,
        icon: MapPin,
        description: "Package will be delivered today"
      }
    ]
  };

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    
    if (!orderNumber.trim()) {
      toast.error("Please enter an order number");
      return;
    }

    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setTrackingResult(mockTrackingData);
      setLoading(false);
      toast.success("Order tracking information retrieved");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4" data-testid="track-order-title">
            Track Your Order
          </h1>
          <p className="text-xl text-gray-600">
            Enter your order number to get real-time tracking updates
          </p>
        </div>

        {/* Track Order Form */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <form onSubmit={handleTrackOrder} className="max-w-md mx-auto" data-testid="track-order-form">
            <div className="mb-4">
              <label className="form-label">Order Number</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="form-input pl-10"
                  placeholder="Enter your order number (e.g., THRYNN123456)"
                  data-testid="order-number-input"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="track-button"
            >
              {loading ? "Tracking..." : "Track Order"}
            </button>
          </form>
        </div>

        {/* Tracking Results */}
        {trackingResult && (
          <div className="bg-white rounded-lg shadow-sm p-6" data-testid="tracking-results">
            {/* Order Header */}
            <div className="border-b border-gray-200 pb-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900" data-testid="tracked-order-id">
                    Order #{trackingResult.orderId}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Status: <span className={`font-medium ${trackingResult.status === 'shipped' ? 'text-blue-600' : 'text-green-600'}`}>
                      {trackingResult.status.charAt(0).toUpperCase() + trackingResult.status.slice(1)}
                    </span>
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="bg-orange-100 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Calendar className="text-orange-600" size={20} />
                      <div>
                        <p className="text-sm text-orange-600 font-medium">Estimated Delivery</p>
                        <p className="text-lg font-semibold text-gray-900" data-testid="estimated-delivery">
                          {trackingResult.estimatedDelivery}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Location */}
            <div className="mb-6">
              <div className="flex items-center space-x-3">
                <MapPin className="text-orange-500" size={24} />
                <div>
                  <p className="text-sm text-gray-600">Current Location</p>
                  <p className="text-lg font-medium text-gray-900" data-testid="current-location">
                    {trackingResult.currentLocation}
                  </p>
                </div>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tracking Timeline</h3>
              <div className="space-y-4">
                {trackingResult.trackingSteps.map((step, index) => {
                  const IconComponent = step.icon;
                  return (
                    <div key={index} className="flex items-start space-x-4" data-testid={`tracking-step-${index}`}>
                      <div className={`p-2 rounded-full ${step.completed ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <IconComponent 
                          size={20} 
                          className={step.completed ? 'text-green-600' : 'text-gray-400'} 
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <h4 className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                            {step.status}
                          </h4>
                          <div className="text-sm text-gray-500 mt-1 md:mt-0">
                            {step.date} • {step.time}
                          </div>
                        </div>
                        <p className={`text-sm mt-1 ${step.completed ? 'text-gray-600' : 'text-gray-400'}`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="btn-primary flex-1">
                  Contact Support
                </button>
                <button className="btn-secondary flex-1">
                  View Order Details
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Can't find your order number?</h4>
              <p className="text-sm text-gray-600 mb-3">
                Check your email confirmation or SMS for the order number. It starts with "THRYNN" followed by numbers.
              </p>
              {user && (
                <a href="/orders" className="text-orange-500 hover:text-orange-600 text-sm font-medium">
                  View your order history →
                </a>
              )}
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Delivery Issues?</h4>
              <p className="text-sm text-gray-600 mb-3">
                If your package is delayed or you have delivery concerns, our support team is here to help.
              </p>
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

export default TrackOrder;