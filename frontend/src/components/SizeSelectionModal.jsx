import React, { useState } from "react";
import { X, ShoppingCart, Package } from "lucide-react";

const SizeSelectionModal = ({ 
  product, 
  isOpen, 
  onClose, 
  onAddToCart,
  isLoading = false 
}) => {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    
    onAddToCart({
      product,
      selectedSize,
      selectedColor: selectedColor || product.available_colors?.[0],
      quantity
    });
  };

  const isSizeOutOfStock = (size) => {
    return product.size_stock && product.size_stock[size] === 0;
  };

  const getSizeStock = (size) => {
    return product.size_stock ? product.size_stock[size] || 0 : 999;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" data-testid="size-selection-modal">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Select Options</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            data-testid="close-modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Product Info */}
          <div className="flex space-x-4 mb-6">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div>
              <h3 className="font-semibold text-gray-900" data-testid="modal-product-name">
                {product.name}
              </h3>
              <p className="text-gold-200 font-bold text-lg" data-testid="modal-product-price">
                ₹{product.price.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900">Size</h3>
              <span className="text-sm text-gray-500">Size Guide</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {product.available_sizes?.map((size) => {
                const isOutOfStock = isSizeOutOfStock(size);
                const stock = getSizeStock(size);
                
                return (
                  <button
                    key={size}
                    onClick={() => !isOutOfStock && setSelectedSize(size)}
                    disabled={isOutOfStock}
                    className={`p-3 border-2 rounded-lg font-medium transition-all relative ${
                      selectedSize === size
                        ? 'border-orange-500 bg-orange-50 text-orange-600'
                        : isOutOfStock
                        ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    data-testid={`size-option-${size}`}
                  >
                    {size}
                    {isOutOfStock && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-0.5 bg-red-500 rotate-45"></div>
                      </div>
                    )}
                    {stock <= 5 && stock > 0 && (
                      <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-1 rounded-full">
                        {stock}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {selectedSize && (
              <p className="text-sm text-gray-600 mt-2">
                {getSizeStock(selectedSize)} items available
              </p>
            )}
          </div>

          {/* Color Selection */}
          {product.available_colors && product.available_colors.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Color</h3>
              <div className="flex space-x-3">
                {product.available_colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border-2 rounded-lg font-medium transition-all ${
                      selectedColor === color || (!selectedColor && color === product.available_colors[0])
                        ? 'border-orange-500 bg-orange-50 text-orange-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    data-testid={`color-option-${color}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selection */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Quantity</h3>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                data-testid="decrease-quantity"
              >
                -
              </button>
              <span className="text-lg font-semibold min-w-[3rem] text-center" data-testid="modal-quantity">
                {quantity}
              </span>
              <button
                onClick={() => {
                  const maxStock = selectedSize ? getSizeStock(selectedSize) : 99;
                  setQuantity(Math.min(maxStock, quantity + 1));
                }}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                data-testid="increase-quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* Stock Warning */}
          {selectedSize && getSizeStock(selectedSize) <= 5 && getSizeStock(selectedSize) > 0 && (
            <div className="mb-6 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Package size={16} className="text-orange-600" />
                <span className="text-sm text-orange-700">
                  Only {getSizeStock(selectedSize)} items left in stock!
                </span>
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!selectedSize || isLoading}
            className="w-full btn-primary py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            data-testid="modal-add-to-cart"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <ShoppingCart size={20} />
                <span>Add to Cart - ₹{(product.price * quantity).toLocaleString()}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SizeSelectionModal;