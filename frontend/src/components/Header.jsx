import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../App";
import { ShoppingCart, User, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const { user, logout, cartCount } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl font-bold text-gradient"
            data-testid="logo-link"
          >
            THRYNN
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`font-medium transition-colors ${
                isActive('/') ? 'text-orange-500' : 'text-gray-700 hover:text-orange-500'
              }`}
              data-testid="home-nav-link"
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`font-medium transition-colors ${
                isActive('/products') ? 'text-orange-500' : 'text-gray-700 hover:text-orange-500'
              }`}
              data-testid="products-nav-link"
            >
              Products
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart is always visible */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-orange-500 transition-colors"
              data-testid="cart-link"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="cart-badge" data-testid="cart-count">
                  {cartCount}
                </span>
              )}
            </Link>
            
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="p-2 text-gray-700 hover:text-orange-500 transition-colors"
                  data-testid="profile-link"
                >
                  <User size={24} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-700 hover:text-red-500 transition-colors"
                  data-testid="logout-button"
                >
                  <LogOut size={24} />
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="btn-primary"
                data-testid="login-button"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="mobile-menu-button"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className={`font-medium ${
                  isActive('/') ? 'text-orange-500' : 'text-gray-700'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid="mobile-home-link"
              >
                Home
              </Link>
              <Link
                to="/products"
                className={`font-medium ${
                  isActive('/products') ? 'text-orange-500' : 'text-gray-700'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid="mobile-products-link"
              >
                Products
              </Link>
              
              {user ? (
                <>
                  <Link
                    to="/cart"
                    className="flex items-center space-x-2 text-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                    data-testid="mobile-cart-link"
                  >
                    <ShoppingCart size={20} />
                    <span>Cart ({cartCount})</span>
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 text-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                    data-testid="mobile-profile-link"
                  >
                    <User size={20} />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 text-red-500"
                    data-testid="mobile-logout-button"
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="btn-primary inline-block text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                  data-testid="mobile-login-button"
                >
                  Login
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;