import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../App";
import { CreditCard, MapPin, User, Phone, Mail, Lock, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Checkout = () => {
  const { user, setCartCount, guestId } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState("");
  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.full_name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India"
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      let response;
      
      if (user) {
        const token = localStorage.getItem('token');
        response = await axios.get(`${API}/cart`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else if (guestId) {
        response = await axios.get(`${API}/cart?guest_id=${guestId}`);
      } else {
        navigate('/cart');
        return;
      }
      
      setCart(response.data);
      
      if (response.data.items.length === 0) {
        navigate('/cart');
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      toast.error("Failed to load cart");
      navigate('/cart');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const requiredFields = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
    for (const field of requiredFields) {
      if (!shippingInfo[field]) {
        toast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    return true;
  };

  const processPayment = async (orderData) => {
    try {
      // Create mock payment order
      const paymentResponse = await axios.post(`${API}/payments/create-order`, {
        order_id: orderData.id,
        amount: orderData.total_amount
      });

      // Simulate Razorpay payment flow
      return new Promise((resolve) => {
        // Mock payment success after 2 seconds
        setTimeout(() => {
          const mockPaymentId = `pay_mock_${Date.now()}`;
          resolve({
            razorpay_payment_id: mockPaymentId,
            razorpay_order_id: paymentResponse.data.id
          });
        }, 2000);
      });
    } catch (error) {
      throw new Error('Payment processing failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setProcessing(true);
    
    try {
      const token = localStorage.getItem('token');
      
      // Create order
      const orderData = {
        items: cart.items,
        total_amount: cart.total,
        shipping_address: shippingInfo
      };
      
      const orderResponse = await axios.post(`${API}/orders`, orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Process payment (mock)
      const paymentResult = await processPayment(orderResponse.data);
      
      // Verify payment
      await axios.post(`${API}/payments/verify`, {
        payment_id: paymentResult.razorpay_payment_id,
        order_id: orderResponse.data.id
      });
      
      // Update cart count
      setCartCount(0);
      setOrderId(orderResponse.data.id);
      setOrderComplete(true);
      
      toast.success("Order placed successfully!");
      
    } catch (error) {
      console.error('Checkout failed:', error);
      toast.error("Failed to process order. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center" data-testid="order-success">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. Your order has been confirmed and will be shipped soon.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Order ID</p>
            <p className="font-mono text-lg font-semibold" data-testid="order-id">{orderId}</p>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/orders')}
              className="w-full btn-primary"
              data-testid="view-orders-button"
            >
              View My Orders
            </button>
            <button
              onClick={() => navigate('/products')}
              className="w-full btn-secondary"
              data-testid="continue-shopping-button"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center" data-testid="checkout-title">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8" data-testid="checkout-form">
              {/* Shipping Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <MapPin className="text-orange-500" size={24} />
                  <h3 className="text-xl font-semibold text-gray-900">Shipping Information</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        name="fullName"
                        value={shippingInfo.fullName}
                        onChange={handleInputChange}
                        className="form-input pl-10"
                        placeholder="Enter your full name"
                        required
                        data-testid="fullName-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="email"
                        name="email"
                        value={shippingInfo.email}
                        onChange={handleInputChange}
                        className="form-input pl-10"
                        placeholder="Enter your email"
                        required
                        data-testid="email-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="tel"
                        name="phone"
                        value={shippingInfo.phone}
                        onChange={handleInputChange}
                        className="form-input pl-10"
                        placeholder="Enter your phone number"
                        required
                        data-testid="phone-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={shippingInfo.pincode}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter pincode"
                      required
                      data-testid="pincode-input"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="form-label">Address</label>
                    <textarea
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleInputChange}
                      className="form-input"
                      rows="3"
                      placeholder="Enter your complete address"
                      required
                      data-testid="address-input"
                    />
                  </div>

                  <div>
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter city"
                      required
                      data-testid="city-input"
                    />
                  </div>

                  <div>
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Enter state"
                      required
                      data-testid="state-input"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <CreditCard className="text-orange-500" size={24} />
                  <h3 className="text-xl font-semibold text-gray-900">Payment Method</h3>
                </div>
                
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <Lock className="text-orange-500" size={20} />
                    <div>
                      <p className="font-medium text-gray-900">Mock Payment (Development)</p>
                      <p className="text-sm text-gray-600">Payment will be simulated for testing purposes</p>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6 h-fit sticky top-24" data-testid="checkout-summary">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h3>
            
            {/* Items */}
            <div className="space-y-3 mb-6">
              {cart.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-3" data-testid={`summary-item-${item.id}`}>
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.product.name}</p>
                    <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold">₹{item.item_total.toLocaleString()}</p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-3 mb-6 border-t border-gray-200 pt-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span data-testid="summary-subtotal">₹{cart.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-lg font-semibold text-gray-900 border-t border-gray-200 pt-3">
                <span>Total</span>
                <span data-testid="summary-total">₹{cart.total.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={processing}
              className="w-full btn-primary py-3 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              data-testid="place-order-button"
            >
              {processing ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;