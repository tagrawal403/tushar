import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../App";
import { Package, Calendar, MapPin, CreditCard } from "lucide-react";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Orders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'status-badge status-pending',
      paid: 'status-badge status-paid',
      shipped: 'status-badge status-shipped',
      delivered: 'status-badge status-paid'
    };
    
    return (
      <span className={statusClasses[status] || 'status-badge status-pending'}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8" data-testid="orders-title">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className="text-center py-12" data-testid="no-orders">
            <Package size={64} className="text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-8">Start shopping to see your orders here</p>
            <a href="/products" className="btn-primary">
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden" data-testid={`order-${order.id}`}>
                {/* Order Header */}
                <div className="border-b border-gray-200 p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div className="flex items-center space-x-4">
                      <Package className="text-orange-500" size={24} />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900" data-testid={`order-id-${order.id}`}>
                          Order #{order.id.slice(-8).toUpperCase()}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <div className="flex items-center space-x-1">
                            <Calendar size={14} />
                            <span data-testid={`order-date-${order.id}`}>
                              {new Date(order.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <CreditCard size={14} />
                            <span>₹{order.total_amount.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {getStatusBadge(order.status)}
                      <button className="btn-secondary text-sm px-4 py-2">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <h4 className="font-medium text-gray-900 mb-3">Items ({order.items.length})</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg" data-testid={`order-item-${index}`}>
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            Qty: {item.quantity} • ₹{item.item_total.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                  <div className="flex items-start space-x-3">
                    <MapPin className="text-gray-400 mt-1" size={16} />
                    <div>
                      <p className="font-medium text-gray-900 mb-1">Shipping Address</p>
                      <p className="text-sm text-gray-600">
                        {order.shipping_address.fullName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.shipping_address.address}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.pincode}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.shipping_address.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;