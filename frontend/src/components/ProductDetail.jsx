import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../App";
import { ShoppingCart, Heart, ArrowLeft, Star, Truck, Shield, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, setCartCount } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API}/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      toast.error("Product not found");
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      navigate('/auth');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API}/cart/add`,
        { product_id: product.id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update cart count
      const cartResponse = await axios.get(`${API}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartCount(cartResponse.data.items.length);
      
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error("Failed to add item to cart");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Product not found</h2>
          <button
            onClick={() => navigate('/products')}
            className="btn-primary"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate('/products')}
          className="flex items-center space-x-2 text-gray-200 hover:text-white transition-colors mb-8"
          data-testid="back-button"
        >
          <ArrowLeft size={20} />
          <span>Back to Products</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-96 lg:h-[600px] object-cover"
                data-testid="product-image"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm text-orange-500 font-medium uppercase tracking-wider">
                  {product.category}
                </span>
                <span className={`px-2 py-1 text-xs rounded ${product.in_stock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {product.in_stock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4" data-testid="product-name">
                {product.name}
              </h1>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-gray-600 text-sm">(4.8) • 156 reviews</span>
              </div>
              <p className="text-4xl font-bold text-orange-500 mb-6" data-testid="product-price">
                ₹{product.price.toLocaleString()}
              </p>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed" data-testid="product-description">
                {product.description}
              </p>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Size</h3>
              <div className="flex flex-wrap gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-lg font-medium transition-all ${
                      selectedSize === size
                        ? 'border-orange-500 bg-orange-50 text-orange-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    data-testid={`size-${size}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  data-testid="decrease-quantity"
                >
                  -
                </button>
                <span className="text-lg font-semibold min-w-[3rem] text-center" data-testid="quantity-value">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                  data-testid="increase-quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <button
                onClick={addToCart}
                disabled={!product.in_stock}
                className="w-full btn-primary py-4 text-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                data-testid="add-to-cart-button"
              >
                <ShoppingCart size={20} />
                <span>{product.in_stock ? 'Add to Cart' : 'Out of Stock'}</span>
              </button>
              
              <button className="w-full btn-secondary py-4 text-lg font-medium flex items-center justify-center space-x-2">
                <Heart size={20} />
                <span>Add to Wishlist</span>
              </button>
            </div>

            {/* Features */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <Truck size={20} className="text-orange-500" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <Shield size={20} className="text-orange-500" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <RotateCcw size={20} className="text-orange-500" />
                  <span>Easy Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;