import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../App";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Cart = () => {
  const { user, setCartCount, guestId } = useContext(AuthContext);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, [user, guestId]);

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
        setCart({ items: [], total: 0 });
        setLoading(false);
        return;
      }
      
      setCart(response.data);
      setCartCount(response.data.items.length);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      // For simplicity, we'll remove and re-add with new quantity
      await axios.delete(`${API}/cart/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const item = cart.items.find(item => item.id === itemId);
      await axios.post(`${API}/cart/add`, {
        product_id: item.product_id,
        quantity: newQuantity
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      fetchCart();
      toast.success("Cart updated");
    } catch (error) {
      console.error('Failed to update quantity:', error);
      toast.error("Failed to update cart");
    }
  };

  const removeItem = async (itemId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API}/cart/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCart();
      toast.success("Item removed from cart");
    } catch (error) {
      console.error('Failed to remove item:', error);
      toast.error("Failed to remove item");
    }
  };

  const proceedToCheckout = () => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      navigate('/checkout');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center" data-testid="empty-cart">
          <ShoppingBag size={64} className="text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet</p>
          <Link
            to="/products"
            className="btn-primary inline-flex items-center space-x-2"
            data-testid="continue-shopping-button"
          >
            <ArrowLeft size={20} />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900" data-testid="cart-title">
            Shopping Cart
          </h1>
          <Link
            to="/products"
            className="flex items-center space-x-2 text-orange-500 hover:text-orange-600 transition-colors"
            data-testid="continue-shopping-link"
          >
            <ArrowLeft size={20} />
            <span>Continue Shopping</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm p-6" data-testid={`cart-item-${item.id}`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                  {/* Product Image */}
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-lg"
                    data-testid={`item-image-${item.id}`}
                  />
                  
                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900" data-testid={`item-name-${item.id}`}>
                      {item.product.name}
                    </h3>
                    <div className="flex items-center space-x-4 mt-1">
                      {item.selected_size && (
                        <span className="text-sm text-gray-600">
                          Size: <span className="font-medium">{item.selected_size}</span>
                        </span>
                      )}
                      {item.selected_color && (
                        <span className="text-sm text-gray-600">
                          Color: <span className="font-medium">{item.selected_color}</span>
                        </span>
                      )}
                    </div>
                    <p className="text-orange-500 font-semibold mt-2" data-testid={`item-price-${item.id}`}>
                      ₹{item.product.price.toLocaleString()}
                    </p>
                  </div>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                      data-testid={`decrease-quantity-${item.id}`}
                    >
                      <Minus size={16} />
                    </button>
                    
                    <span className="text-lg font-semibold min-w-[2rem] text-center" data-testid={`item-quantity-${item.id}`}>
                      {item.quantity}
                    </span>
                    
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                      data-testid={`increase-quantity-${item.id}`}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  {/* Item Total */}
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900" data-testid={`item-total-${item.id}`}>
                      ₹{item.item_total.toLocaleString()}
                    </p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors mt-2"
                      data-testid={`remove-item-${item.id}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6 h-fit sticky top-24" data-testid="order-summary">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cart.items.length} items)</span>
                <span data-testid="subtotal">₹{cart.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span data-testid="total-amount">₹{cart.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button
              onClick={proceedToCheckout}
              className="w-full btn-primary py-3 text-base font-medium"
              data-testid="proceed-to-checkout"
            >
              Proceed to Checkout
            </button>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                Free shipping on orders over ₹2000
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal for Guest Checkout */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose an Option</h2>
            <p className="text-gray-600 mb-6">
              To proceed with checkout, you can either continue as a guest or create an account for faster future checkouts.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowAuthModal(false);
                  navigate('/checkout');
                }}
                className="w-full btn-primary py-3"
                data-testid="guest-checkout-button"
              >
                Continue as Guest
              </button>
              
              <button
                onClick={() => {
                  setShowAuthModal(false);
                  navigate('/auth');
                }}
                className="w-full btn-secondary py-3"
                data-testid="login-signup-button"
              >
                Login / Sign Up
              </button>
              
              <button
                onClick={() => setShowAuthModal(false)}
                className="w-full text-gray-500 hover:text-gray-700 py-2"
                data-testid="cancel-checkout-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;