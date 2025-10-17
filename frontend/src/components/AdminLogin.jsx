import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff, Lock, User } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminLogin = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(`${API}/admin/login`, credentials);
      const { access_token } = response.data;
      
      localStorage.setItem('adminToken', access_token);
      onLogin(access_token);
      toast.success("Admin login successful!");
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Admin login error:', error);
      toast.error(error.response?.data?.detail || "Invalid admin credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
            <Shield className="text-orange-600" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900" data-testid="admin-login-title">
            THRYNN Admin
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Access the admin dashboard to manage products and inventory
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit} data-testid="admin-login-form">
            {/* Username */}
            <div>
              <label htmlFor="username" className="form-label">
                Admin Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="form-input pl-10"
                  placeholder="Enter admin username"
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  data-testid="admin-username-input"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="form-input pl-10 pr-10"
                  placeholder="Enter admin password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  data-testid="admin-password-input"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                  data-testid="toggle-password"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="admin-login-submit"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Logging in...</span>
                </div>
              ) : (
                "Access Admin Dashboard"
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h3 className="font-medium text-orange-800 mb-2">Demo Admin Credentials</h3>
            <div className="text-sm text-orange-700 space-y-1">
              <p><strong>Username:</strong> admin</p>
              <p><strong>Password:</strong> admin123</p>
            </div>
          </div>
        </div>

        {/* Back to Store */}
        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
            data-testid="back-to-store"
          >
            ← Back to Store
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;