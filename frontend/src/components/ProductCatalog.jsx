import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../App";
import { ShoppingCart, Heart, Search, Filter } from "lucide-react";
import { toast } from "sonner";
import SizeSelectionModal from "./SizeSelectionModal";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProductCatalog = ({ limit = null, showViewAll = false }) => {
  const { user, setCartCount, guestId } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  const categories = [
    { id: "all", name: "All" },
    { id: "hoodies", name: "Hoodies" },
    { id: "tshirts", name: "T-Shirts" },
    { id: "pants", name: "Pants" },
    { id: "jackets", name: "Jackets" },
    { id: "sweaters", name: "Sweaters" },
    { id: "jeans", name: "Jeans" }
  ];

  useEffect(() => {
    fetchProducts();
    initializeSampleData();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory]);

  const initializeSampleData = async () => {
    try {
      await axios.post(`${API}/init-data`);
    } catch (error) {
      console.log('Sample data already exists or error initializing:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    // Limit results if specified
    if (limit) {
      filtered = filtered.slice(0, limit);
    }
    
    setFilteredProducts(filtered);
  };

  const handleQuickAdd = (product) => {
    setSelectedProduct(product);
    setShowSizeModal(true);
  };

  const addToCart = async ({ product, selectedSize, selectedColor, quantity }) => {
    setAddingToCart(true);
    
    try {
      const cartData = {
        product_id: product.id,
        quantity,
        selected_size: selectedSize,
        selected_color: selectedColor,
        guest_id: user ? null : guestId
      };

      if (user) {
        const token = localStorage.getItem('token');
        await axios.post(`${API}/cart/add`, cartData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Update cart count for authenticated users
        const cartResponse = await axios.get(`${API}/cart`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCartCount(cartResponse.data.items.length);
      } else {
        // Guest user
        await axios.post(`${API}/cart/add`, cartData);
        
        // Update cart count for guest users
        const cartResponse = await axios.get(`${API}/cart?guest_id=${guestId}`);
        setCartCount(cartResponse.data.items.length);
      }
      
      setShowSizeModal(false);
      toast.success(`${product.name} (${selectedSize}) added to cart!`);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      const errorMessage = error.response?.data?.detail || "Failed to add item to cart";
      toast.error(errorMessage);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <section className="section-padding">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="loading-shimmer h-96 rounded-12"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding" data-testid="product-catalog">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white luxury-heading" data-testid="catalog-title">
            {showViewAll ? "Featured" : "Our"} Collection
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover our curated selection of premium streetwear pieces
          </p>
        </div>

        {/* Filters - Only show on full catalog page */}
        {!showViewAll && (
          <div className="mb-12 space-y-6">
            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                className="form-input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-testid="search-input"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-2 rounded-full font-medium transition-all ${
                    selectedCategory === category.id
                      ? 'bg-gold text-black'
                      : 'bg-gray-800 text-gray-200 hover:bg-gray-700 border border-gray-700'
                  }`}
                  data-testid={`category-${category.id}`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card fade-in" data-testid={`product-${product.id}`}>
              <div className="relative overflow-hidden group">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="product-image"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                  <div className="flex space-x-4 pointer-events-auto">
                    <button
                      onClick={() => handleQuickAdd(product)}
                      className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110"
                      data-testid={`add-to-cart-${product.id}`}
                    >
                      <ShoppingCart size={20} className="text-gray-800" />
                    </button>
                    <button className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110">
                      <Heart size={20} className="text-gray-800" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-white" data-testid={`product-name-${product.id}`}>
                    {product.name}
                  </h3>
                  <span className="text-xl font-bold text-gold-200" data-testid={`product-price-${product.id}`}>
                    ₹{product.price.toLocaleString()}
                  </span>
                </div>
                
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between relative z-10">
                  <Link
                    to={`/products/${product.id}`}
                    className="text-gold-200 font-semibold hover:text-gold-100 transition-colors underline decoration-gold-200/50 hover:decoration-gold-100 cursor-pointer"
                    data-testid={`view-details-${product.id}`}
                  >
                    View Details →
                  </Link>
                  <span className={`text-xs px-2 py-1 rounded ${product.in_stock ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                    {product.in_stock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        {showViewAll && (
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="btn-primary inline-flex items-center space-x-2"
              data-testid="view-all-button"
            >
              <span>View All Products</span>
              <Filter size={20} />
            </Link>
          </div>
        )}

        {/* Empty State */}
        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-12" data-testid="empty-state">
            <p className="text-xl text-gray-300">No products found</p>
            <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Size Selection Modal */}
      <SizeSelectionModal
        product={selectedProduct}
        isOpen={showSizeModal}
        onClose={() => setShowSizeModal(false)}
        onAddToCart={addToCart}
        isLoading={addingToCart}
      />
    </section>
  );
};

export default ProductCatalog;