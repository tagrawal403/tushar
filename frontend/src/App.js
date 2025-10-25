import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

// Components
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductCatalog from "./components/ProductCatalog";
import ProductDetail from "./components/ProductDetail";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import Auth from "./components/Auth";
import Profile from "./components/Profile";
import Orders from "./components/Orders";
import TrackOrder from "./components/TrackOrder";
import PrivacyPolicy from "./components/PrivacyPolicy";
import ReturnsPolicy from "./components/ReturnsPolicy";
import ReturnRequest from "./components/ReturnRequest";
import ShippingPolicy from "./components/ShippingPolicy";
import TermsConditions from "./components/TermsConditions";
import AboutUs from "./components/AboutUs";
import StoreLocator from "./components/StoreLocator";
import Footer from "./components/Footer";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import ScrollToTop from "./components/ScrollToTop";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Auth Context
export const AuthContext = React.createContext();

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [guestId, setGuestId] = useState(null);
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const adminToken = localStorage.getItem('adminToken');
    const storedGuestId = localStorage.getItem('guestId');
    
    if (adminToken) {
      setAdminUser({ token: adminToken });
      setIsLoading(false);
    } else if (token) {
      fetchUser(token);
    } else {
      // Generate guest ID if doesn't exist
      if (!storedGuestId) {
        const newGuestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('guestId', newGuestId);
        setGuestId(newGuestId);
      } else {
        setGuestId(storedGuestId);
      }
      fetchGuestCart(storedGuestId);
      setIsLoading(false);
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      const response = await axios.get(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      fetchCartCount(token);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      localStorage.removeItem('token');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCartCount = async (token) => {
    try {
      const response = await axios.get(`${API}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartCount(response.data.items.length);
    } catch (error) {
      console.error('Failed to fetch cart count:', error);
    }
  };

  const fetchGuestCart = async (guestId) => {
    if (!guestId) return;
    try {
      const response = await axios.get(`${API}/cart?guest_id=${guestId}`);
      setCartCount(response.data.items.length);
    } catch (error) {
      console.error('Failed to fetch guest cart:', error);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API}/auth/login`, { email, password });
      const { access_token } = response.data;
      
      localStorage.setItem('token', access_token);
      await fetchUser(access_token);
      
      toast.success("Login successful!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.detail || "Login failed");
      return false;
    }
  };

  const register = async (email, password, fullName) => {
    try {
      const response = await axios.post(`${API}/auth/register`, {
        email,
        password,
        full_name: fullName
      });
      const { access_token } = response.data;
      
      localStorage.setItem('token', access_token);
      await fetchUser(access_token);
      
      toast.success("Registration successful!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.detail || "Registration failed");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    
    // Generate new guest ID and fetch guest cart
    const newGuestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('guestId', newGuestId);
    setGuestId(newGuestId);
    fetchGuestCart(newGuestId);
    
    toast.success("Logged out successfully");
  };

  const handleAdminLogin = (token) => {
    setAdminUser({ token });
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    setAdminUser(null);
  };

  const authContextValue = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    cartCount,
    setCartCount,
    guestId
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      <div className="App">
        <BrowserRouter>
          <ScrollToTop />
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductCatalog />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/auth" element={
              user ? <Navigate to="/" replace /> : <Auth />
            } />
            <Route path="/profile" element={
              user ? <Profile /> : <Navigate to="/auth" replace />
            } />
            <Route path="/orders" element={
              user ? <Orders /> : <Navigate to="/auth" replace />
            } />
            <Route path="/track-order" element={<TrackOrder />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/returns-policy" element={<ReturnsPolicy />} />
            <Route path="/returns/request" element={
              user ? <ReturnRequest /> : <Navigate to="/auth" replace />
            } />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/stores" element={<StoreLocator />} />
            <Route path="/admin" element={
              adminUser ? <Navigate to="/admin/dashboard" replace /> : <AdminLogin onLogin={handleAdminLogin} />
            } />
            <Route path="/admin/dashboard" element={
              adminUser ? <AdminDashboard onLogout={handleAdminLogout} /> : <Navigate to="/admin" replace />
            } />
          </Routes>
          {!adminUser && <Footer />}
          <Toaster position="top-right" />
        </BrowserRouter>
      </div>
    </AuthContext.Provider>
  );
}

const HomePage = () => {
  return (
    <div>
      <Hero />
      <ProductCatalog limit={6} showViewAll={true} />
    </div>
  );
};

export default App;