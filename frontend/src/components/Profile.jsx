import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../App";
import { User, Mail, Calendar, ShoppingBag, Heart, Settings, LogOut } from "lucide-react";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8" data-testid="profile-title">
          My Profile
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium text-gray-900" data-testid="user-name">
                      {user?.full_name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900" data-testid="user-email">
                      {user?.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-medium text-gray-900" data-testid="member-since">
                      {new Date(user?.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button className="btn-primary">
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Account Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Overview</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-orange-100 p-3 rounded-full w-fit mx-auto mb-2">
                    <ShoppingBag className="text-orange-600" size={24} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900" data-testid="total-orders">12</p>
                  <p className="text-sm text-gray-600">Total Orders</p>
                </div>

                <div className="text-center">
                  <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-2">
                    <Heart className="text-blue-600" size={24} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900" data-testid="wishlist-items">5</p>
                  <p className="text-sm text-gray-600">Wishlist Items</p>
                </div>

                <div className="text-center">
                  <div className="bg-green-100 p-3 rounded-full w-fit mx-auto mb-2">
                    <Settings className="text-green-600" size={24} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">Premium</p>
                  <p className="text-sm text-gray-600">Account Type</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <Link
                  to="/orders"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  data-testid="view-orders-link"
                >
                  <ShoppingBag className="text-gray-400" size={20} />
                  <span className="text-gray-700">View Orders</span>
                </Link>

                <Link
                  to="/cart"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  data-testid="view-cart-link"
                >
                  <ShoppingBag className="text-gray-400" size={20} />
                  <span className="text-gray-700">View Cart</span>
                </Link>

                <button className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors w-full text-left">
                  <Heart className="text-gray-400" size={20} />
                  <span className="text-gray-700">Wishlist</span>
                </button>

                <button className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors w-full text-left">
                  <Settings className="text-gray-400" size={20} />
                  <span className="text-gray-700">Account Settings</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 transition-colors w-full text-left text-red-600"
                  data-testid="logout-button"
                >
                  <LogOut className="text-red-500" size={20} />
                  <span>Logout</span>
                </button>
              </div>
            </div>

            {/* Loyalty Card */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-sm p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">THRYNN Rewards</h3>
              <p className="text-orange-100 text-sm mb-4">
                Collect points with every purchase and unlock exclusive rewards
              </p>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold" data-testid="rewards-points">2,450</p>
                  <p className="text-xs text-orange-100">Points Available</p>
                </div>
                <button className="bg-white text-orange-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-50 transition-colors">
                  Redeem
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;