import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, CreditCard, AlertTriangle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PaymentTracker = ({ paymentId, orderId, onPaymentComplete, onPaymentFailed }) => {
  const [paymentStatus, setPaymentStatus] = useState({
    status: "pending",
    payment_status: "pending"
  });
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(true);

  useEffect(() => {
    if (paymentId) {
      startPaymentTracking();
    }
  }, [paymentId]);

  const startPaymentTracking = () => {
    // Initial status check
    checkPaymentStatus();
    
    // Poll every 2 seconds for real-time updates
    const pollInterval = setInterval(() => {
      if (polling) {
        checkPaymentStatus();
      } else {
        clearInterval(pollInterval);
      }
    }, 2000);

    // Stop polling after 5 minutes (payment timeout)
    setTimeout(() => {
      setPolling(false);
      clearInterval(pollInterval);
      if (paymentStatus.payment_status === "pending" || paymentStatus.payment_status === "processing") {
        handlePaymentTimeout();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => {
      clearInterval(pollInterval);
    };
  };

  const checkPaymentStatus = async () => {
    try {
      const response = await axios.get(`${API}/payments/${paymentId}/status`);
      const status = response.data;
      
      setPaymentStatus(status);
      setLoading(false);

      // Handle status changes
      if (status.payment_status === "completed") {
        setPolling(false);
        toast.success("Payment completed successfully!");
        if (onPaymentComplete) {
          onPaymentComplete(status);
        }
      } else if (status.payment_status === "failed") {
        setPolling(false);
        toast.error(`Payment failed: ${status.failure_reason || "Unknown error"}`);
        if (onPaymentFailed) {
          onPaymentFailed(status);
        }
      }
    } catch (error) {
      console.error("Failed to check payment status:", error);
      setLoading(false);
    }
  };

  const handlePaymentTimeout = () => {
    toast.error("Payment timed out. Please try again.");
    if (onPaymentFailed) {
      onPaymentFailed({ 
        payment_status: "failed", 
        failure_reason: "Payment timeout" 
      });
    }
  };

  const simulatePaymentResult = async (resultType) => {
    try {
      await axios.post(`${API}/payments/${paymentId}/simulate-result?result_type=${resultType}`);
      // Status will be updated by the polling mechanism
      toast.info(`Simulating ${resultType}...`);
    } catch (error) {
      console.error("Failed to simulate payment:", error);
      toast.error("Failed to simulate payment");
    }
  };

  const getStatusIcon = () => {
    switch (paymentStatus.payment_status) {
      case "completed":
        return <CheckCircle className="text-green-500" size={48} />;
      case "failed":
        return <XCircle className="text-red-500" size={48} />;
      case "processing":
        return <RefreshCw className="text-blue-500 animate-spin" size={48} />;
      default:
        return <Clock className="text-yellow-500" size={48} />;
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus.payment_status) {
      case "completed":
        return {
          title: "Payment Successful!",
          description: "Your payment has been processed successfully. Your order is confirmed.",
          className: "text-green-600"
        };
      case "failed":
        return {
          title: "Payment Failed",
          description: `Payment could not be processed. ${paymentStatus.failure_reason || "Please try again."}`,
          className: "text-red-600"
        };
      case "processing":
        return {
          title: "Processing Payment...",
          description: "Please wait while we process your payment. Do not refresh or close this page.",
          className: "text-blue-600"
        };
      default:
        return {
          title: "Waiting for Payment...",
          description: "Please complete the payment process to confirm your order.",
          className: "text-yellow-600"
        };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const statusInfo = getStatusMessage();

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center" data-testid="payment-tracker">
      {/* Status Icon */}
      <div className="mb-6 flex justify-center">
        {getStatusIcon()}
      </div>

      {/* Status Message */}
      <h2 className={`text-2xl font-bold mb-3 ${statusInfo.className}`} data-testid="payment-status-title">
        {statusInfo.title}
      </h2>
      <p className="text-gray-600 mb-6" data-testid="payment-status-description">
        {statusInfo.description}
      </p>

      {/* Payment Details */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Payment ID:</span>
            <p className="font-mono text-xs" data-testid="payment-id">{paymentId?.slice(-8)}</p>
          </div>
          <div>
            <span className="text-gray-500">Amount:</span>
            <p className="font-semibold" data-testid="payment-amount">₹{paymentStatus.amount?.toLocaleString()}</p>
          </div>
          <div>
            <span className="text-gray-500">Status:</span>
            <p className={`font-semibold capitalize ${statusInfo.className}`} data-testid="payment-status">
              {paymentStatus.payment_status}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Order ID:</span>
            <p className="font-mono text-xs" data-testid="order-id">{orderId?.slice(-8)}</p>
          </div>
        </div>
      </div>

      {/* Real-time Updates Indicator */}
      {polling && paymentStatus.payment_status === "processing" && (
        <div className="flex items-center justify-center space-x-2 text-sm text-blue-600 mb-6">
          <RefreshCw className="animate-spin" size={16} />
          <span>Checking status in real-time...</span>
        </div>
      )}

      {/* Testing Controls (Development Only) */}
      {process.env.NODE_ENV === 'development' && paymentStatus.payment_status === "processing" && (
        <div className="border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-500 mb-4">Testing Controls (Dev Only)</p>
          <div className="flex space-x-3">
            <button
              onClick={() => simulatePaymentResult("success")}
              className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
              data-testid="simulate-success"
            >
              Simulate Success
            </button>
            <button
              onClick={() => simulatePaymentResult("failure")}
              className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
              data-testid="simulate-failure"
            >
              Simulate Failure
            </button>
          </div>
        </div>
      )}

      {/* Retry Button for Failed Payments */}
      {paymentStatus.payment_status === "failed" && (
        <button
          onClick={() => window.location.reload()}
          className="btn-primary w-full"
          data-testid="retry-payment"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default PaymentTracker;