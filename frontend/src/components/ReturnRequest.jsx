import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import { Package, RotateCcw, Upload, CheckCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const ReturnRequest = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [returnData, setReturnData] = useState({
    orderId: "",
    items: [],
    reason: "",
    condition: "",
    comments: "",
    refundMethod: "original"
  });

  // Mock order data
  const mockOrders = [
    {
      id: "THRYNN123456",
      date: "Oct 5, 2024",
      total: 6798,
      status: "delivered",
      items: [
        {
          id: "item1",
          name: "Oversized Street Hoodie",
          price: 2499,
          image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400",
          size: "L",
          color: "Gray",
          quantity: 1
        },
        {
          id: "item2", 
          name: "Cargo Utility Pants",
          price: 3499,
          image: "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400", 
          size: "32",
          color: "Black",
          quantity: 1
        }
      ]
    }
  ];

  const returnReasons = [
    "Doesn't fit as expected",
    "Different from description", 
    "Quality issues",
    "Damaged during shipping",
    "Wrong item received",
    "Changed my mind",
    "Other"
  ];

  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
    setReturnData({ ...returnData, orderId: order.id });
    setCurrentStep(2);
  };

  const handleItemSelect = (item) => {
    const updatedItems = returnData.items.includes(item.id)
      ? returnData.items.filter(id => id !== item.id)
      : [...returnData.items, item.id];
    
    setReturnData({ ...returnData, items: updatedItems });
  };

  const handleSubmitReturn = async (e) => {
    e.preventDefault();
    
    if (returnData.items.length === 0) {
      toast.error("Please select at least one item to return");
      return;
    }

    if (!returnData.reason) {
      toast.error("Please select a return reason");
      return;
    }

    // Simulate API call
    setTimeout(() => {
      toast.success("Return request submitted successfully!");
      navigate("/track-order");
    }, 1500);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Please login to request a return</h2>
          <button
            onClick={() => navigate("/auth")}
            className="btn-primary"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            data-testid="back-button"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900" data-testid="return-request-title">
              Request Return
            </h1>
            <p className="text-gray-600">Follow the steps below to return your items</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-20 h-1 mx-4 ${
                    currentStep > step ? 'bg-orange-500' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between max-w-2xl mx-auto mt-2 text-sm text-gray-600">
            <span>Select Order</span>
            <span>Choose Items</span>
            <span>Return Details</span>
          </div>
        </div>

        {/* Step 1: Select Order */}
        {currentStep === 1 && (
          <div className="bg-white rounded-lg shadow-sm p-6" data-testid="select-order-step">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Select an Order</h2>
            <div className="space-y-4">
              {mockOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => handleOrderSelect(order)}
                  className="border border-gray-200 rounded-lg p-4 hover:border-orange-500 cursor-pointer transition-colors"
                  data-testid={`order-${order.id}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">Order #{order.id}</h3>
                      <p className="text-gray-600 text-sm">Ordered on {order.date}</p>
                      <p className="text-sm text-green-600 mt-1">Status: {order.status}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{order.total.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">{order.items.length} items</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Select Items */}
        {currentStep === 2 && selectedOrder && (
          <div className="bg-white rounded-lg shadow-sm p-6" data-testid="select-items-step">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Select Items to Return
            </h2>
            <div className="space-y-4">
              {selectedOrder.items.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-4"
                  data-testid={`item-${item.id}`}
                >
                  <div className="flex items-start space-x-4">
                    <input
                      type="checkbox"
                      checked={returnData.items.includes(item.id)}
                      onChange={() => handleItemSelect(item)}
                      className="mt-4 w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                      data-testid={`checkbox-${item.id}`}
                    />
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-gray-600 text-sm">Size: {item.size} • Color: {item.color}</p>
                      <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{item.price.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="btn-secondary"
                data-testid="back-to-orders"
              >
                Back to Orders
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                disabled={returnData.items.length === 0}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="continue-to-details"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Return Details */}
        {currentStep === 3 && (
          <form onSubmit={handleSubmitReturn} className="bg-white rounded-lg shadow-sm p-6" data-testid="return-details-step">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Return Details</h2>
            
            <div className="space-y-6">
              {/* Return Reason */}
              <div>
                <label className="form-label">Reason for Return *</label>
                <select
                  value={returnData.reason}
                  onChange={(e) => setReturnData({ ...returnData, reason: e.target.value })}
                  className="form-input"
                  required
                  data-testid="return-reason-select"
                >
                  <option value="">Select a reason</option>
                  {returnReasons.map((reason) => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
              </div>

              {/* Item Condition */}
              <div>
                <label className="form-label">Item Condition *</label>
                <div className="space-y-2">
                  {["New with tags", "Like new", "Good condition", "Fair condition"].map((condition) => (
                    <label key={condition} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="condition"
                        value={condition}
                        checked={returnData.condition === condition}
                        onChange={(e) => setReturnData({ ...returnData, condition: e.target.value })}
                        className="text-orange-500 focus:ring-orange-500"
                        data-testid={`condition-${condition.replace(/\s+/g, '-').toLowerCase()}`}
                      />
                      <span className="text-gray-700">{condition}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Additional Comments */}
              <div>
                <label className="form-label">Additional Comments (Optional)</label>
                <textarea
                  value={returnData.comments}
                  onChange={(e) => setReturnData({ ...returnData, comments: e.target.value })}
                  className="form-input"
                  rows="4"
                  placeholder="Any additional details about the return..."
                  data-testid="return-comments"
                />
              </div>

              {/* Refund Method */}
              <div>
                <label className="form-label">Preferred Refund Method</label>
                <div className="space-y-2">
                  {[
                    { value: "original", label: "Original payment method", desc: "3-5 business days" },
                    { value: "store-credit", label: "Store credit", desc: "Instant credit" },
                    { value: "exchange", label: "Exchange for different item", desc: "Subject to availability" }
                  ].map((method) => (
                    <label key={method.value} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:border-orange-500 cursor-pointer">
                      <input
                        type="radio"
                        name="refundMethod"
                        value={method.value}
                        checked={returnData.refundMethod === method.value}
                        onChange={(e) => setReturnData({ ...returnData, refundMethod: e.target.value })}
                        className="mt-1 text-orange-500 focus:ring-orange-500"
                        data-testid={`refund-${method.value}`}
                      />
                      <div>
                        <p className="font-medium text-gray-900">{method.label}</p>
                        <p className="text-sm text-gray-600">{method.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="btn-secondary"
                data-testid="back-to-items"
              >
                Back to Items
              </button>
              <button
                type="submit"
                className="btn-primary"
                data-testid="submit-return-request"
              >
                Submit Return Request
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReturnRequest;