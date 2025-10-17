import React, { useState, useEffect } from "react";
import { CreditCard, CheckCircle, XCircle, Clock, RefreshCw, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminPaymentDashboard = () => {
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState([]);
  const [recentFailures, setRecentFailures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentData();
    
    // Refresh every 10 seconds for real-time updates
    const interval = setInterval(fetchPaymentData, 10000);
    return () => clearInterval(interval);
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return { Authorization: `Bearer ${token}` };
  };

  const fetchPaymentData = async () => {
    try {
      const [paymentsResponse, statsResponse] = await Promise.all([
        axios.get(`${API}/admin/payments`, { headers: getAuthHeaders() }),
        axios.get(`${API}/admin/payment-stats`, { headers: getAuthHeaders() })
      ]);
      
      setPayments(paymentsResponse.data);
      setStats(statsResponse.data.stats);
      setRecentFailures(statsResponse.data.recent_failures);
    } catch (error) {
      console.error('Failed to fetch payment data:', error);
      toast.error("Failed to load payment data");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="text-green-500" size={20} />;
      case "failed":
        return <XCircle className="text-red-500" size={20} />;
      case "processing":
        return <RefreshCw className="text-blue-500 animate-spin" size={20} />;
      default:
        return <Clock className="text-yellow-500" size={20} />;
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      processing: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      created: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[status] || colors.pending}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" data-testid="payment-dashboard-title">
            Payment Dashboard
          </h1>
          <p className="text-gray-600">Real-time payment monitoring and analytics</p>
        </div>
        <button
          onClick={fetchPaymentData}
          className="btn-secondary flex items-center space-x-2"
          data-testid="refresh-payments"
        >
          <RefreshCw size={16} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 capitalize">
                  {stat._id || 'Unknown'} Payments
                </p>
                <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                <p className="text-sm text-gray-500">
                  ₹{stat.total_amount?.toLocaleString() || 0}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <CreditCard className="text-orange-600" size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Failures Alert */}
      {recentFailures.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="text-red-500" size={24} />
            <h3 className="text-lg font-semibold text-red-800">Recent Payment Failures</h3>
          </div>
          <div className="space-y-2">
            {recentFailures.slice(0, 3).map((failure) => (
              <div key={failure.id} className="flex justify-between items-center text-sm">
                <span className="text-red-700">
                  Order {failure.order_id?.slice(-8)} - ₹{failure.amount}
                </span>
                <span className="text-red-600">{failure.failure_reason}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Payments</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.id} data-testid={`payment-row-${payment.id}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(payment.payment_status)}
                      <span className="text-sm font-mono text-gray-900">
                        {payment.id.slice(-8)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono text-gray-600">
                      {payment.order_id?.slice(-8)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">
                      ₹{payment.amount?.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(payment.payment_status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {payment.order_details?.user_id ? 'Registered' : 'Guest'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {payment.order_details?.items_count} items
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(payment.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {payments.length === 0 && (
          <div className="text-center py-12" data-testid="no-payments">
            <CreditCard size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No payments found</p>
            <p className="text-gray-400">Payments will appear here as they are processed</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPaymentDashboard;