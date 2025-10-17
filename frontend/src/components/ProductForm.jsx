import React, { useState, useEffect } from "react";
import { X, Package, Upload, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ProductForm = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    category: "tshirts",
    in_stock: true,
    available_sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    available_colors: ["Black", "White", "Gray"],
    size_stock: {}
  });
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    { value: "hoodies", label: "Hoodies" },
    { value: "tshirts", label: "T-Shirts" },
    { value: "pants", label: "Pants" },
    { value: "jackets", label: "Jackets" },
    { value: "sweaters", label: "Sweaters" },
    { value: "jeans", label: "Jeans" }
  ];

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        image_url: product.image_url || "",
        category: product.category || "tshirts",
        in_stock: product.in_stock !== undefined ? product.in_stock : true,
        available_sizes: product.available_sizes || ["XS", "S", "M", "L", "XL", "XXL"],
        available_colors: product.available_colors || ["Black", "White", "Gray"],
        size_stock: product.size_stock || {}
      });
    }
  }, [product]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return { Authorization: `Bearer ${token}` };
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSizeToggle = (size) => {
    setFormData(prev => ({
      ...prev,
      available_sizes: prev.available_sizes.includes(size)
        ? prev.available_sizes.filter(s => s !== size)
        : [...prev.available_sizes, size]
    }));
  };

  const handleColorChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      available_colors: prev.available_colors.map((color, i) => 
        i === index ? value : color
      )
    }));
  };

  const addColor = () => {
    setFormData(prev => ({
      ...prev,
      available_colors: [...prev.available_colors, ""]
    }));
  };

  const removeColor = (index) => {
    setFormData(prev => ({
      ...prev,
      available_colors: prev.available_colors.filter((_, i) => i !== index)
    }));
  };

  const handleStockChange = (size, value) => {
    setFormData(prev => ({
      ...prev,
      size_stock: {
        ...prev.size_stock,
        [size]: parseInt(value) || 0
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        available_colors: formData.available_colors.filter(color => color.trim() !== "")
      };

      if (product) {
        // Update existing product
        await axios.put(`${API}/admin/products/${product.id}`, submitData, {
          headers: getAuthHeaders()
        });
        toast.success("Product updated successfully!");
      } else {
        // Create new product
        await axios.post(`${API}/admin/products`, submitData, {
          headers: getAuthHeaders()
        });
        toast.success("Product created successfully!");
      }

      onSave();
    } catch (error) {
      console.error('Failed to save product:', error);
      toast.error(error.response?.data?.detail || "Failed to save product");
    } finally {
      setIsLoading(false);
    }
  };

  const allSizes = ["XS", "S", "M", "L", "XL", "XXL", "2XL", "3XL"];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Package className="text-orange-500" size={24} />
            <h2 className="text-xl font-semibold text-gray-900" data-testid="product-form-title">
              {product ? "Edit Product" : "Add New Product"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            data-testid="close-product-form"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="form-label">Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="e.g., Premium Cotton T-Shirt"
                      required
                      data-testid="product-name-input"
                    />
                  </div>

                  <div>
                    <label className="form-label">Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="form-input"
                      rows="3"
                      placeholder="Describe the product features, materials, etc."
                      required
                      data-testid="product-description-input"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Price (₹) *</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="2999"
                        min="0"
                        step="0.01"
                        required
                        data-testid="product-price-input"
                      />
                    </div>

                    <div>
                      <label className="form-label">Category *</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="form-input"
                        required
                        data-testid="product-category-select"
                      >
                        {categories.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Product Image URL *</label>
                    <input
                      type="url"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="https://images.unsplash.com/..."
                      required
                      data-testid="product-image-input"
                    />
                    {formData.image_url && (
                      <img
                        src={formData.image_url}
                        alt="Preview"
                        className="mt-2 w-20 h-20 object-cover rounded border"
                      />
                    )}
                  </div>

                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="in_stock"
                        checked={formData.in_stock}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                        data-testid="product-in-stock-checkbox"
                      />
                      <span className="form-label mb-0">Product is in stock</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Sizes */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Available Sizes</h3>
                <div className="grid grid-cols-4 gap-3">
                  {allSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeToggle(size)}
                      className={`p-3 border-2 rounded-lg font-medium transition-all ${
                        formData.available_sizes.includes(size)
                          ? 'border-orange-500 bg-orange-50 text-orange-600'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      data-testid={`size-toggle-${size}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock Management */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Stock by Size</h3>
                <div className="space-y-3">
                  {formData.available_sizes.map((size) => (
                    <div key={size} className="flex items-center space-x-3">
                      <span className="w-8 text-sm font-medium text-gray-700">{size}:</span>
                      <input
                        type="number"
                        value={formData.size_stock[size] || 0}
                        onChange={(e) => handleStockChange(size, e.target.value)}
                        className="form-input w-20"
                        min="0"
                        placeholder="0"
                        data-testid={`stock-${size}`}
                      />
                      <span className="text-sm text-gray-500">units</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Available Colors</h3>
                <div className="space-y-3">
                  {formData.available_colors.map((color, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <input
                        type="text"
                        value={color}
                        onChange={(e) => handleColorChange(index, e.target.value)}
                        className="form-input flex-1"
                        placeholder="e.g., Black, Navy Blue, etc."
                        data-testid={`color-${index}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeColor(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                        data-testid={`remove-color-${index}`}
                      >
                        <Minus size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addColor}
                    className="flex items-center space-x-2 text-orange-500 hover:text-orange-600 transition-colors"
                    data-testid="add-color-button"
                  >
                    <Plus size={16} />
                    <span>Add Color</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              data-testid="cancel-product-form"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="save-product-button"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{product ? "Updating..." : "Creating..."}</span>
                </div>
              ) : (
                product ? "Update Product" : "Create Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;