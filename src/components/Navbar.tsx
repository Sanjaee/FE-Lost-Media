import {
  Bell,
  Home,
  MessageCircle,
  MessageSquare,
  Plus,
  Search,
  Settings,
  User,
  Users,
} from "lucide-react";
import React from "react";

const Navbar = () => {
  return (
    <header className="bg-gray-800 border-b border-gray-700 px-4 py-2 w-full fixed sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo & Search */}
        <div className="flex items-center space-x-4">
          <div className="text-2xl font-bold text-blue-500">facebook</div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search Facebook"
              className="bg-gray-700 text-white placeholder-gray-400 pl-10 pr-4 py-2 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Middle Section - New User Status */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center px-4 py-1 bg-gray-700 rounded-full">
          <span className="text-gray-300 text-sm mr-2">New User</span>
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        </div>

        {/* Navigation Icons */}
        <div className="flex items-center space-x-2">
          <button className="p-3 hover:bg-gray-700 rounded-full transition-colors">
            <Home className="w-6 h-6" />
          </button>
          <button className="p-3 hover:bg-gray-700 rounded-full transition-colors">
            <Users className="w-6 h-6" />
          </button>
          <button className="p-3 hover:bg-gray-700 rounded-full transition-colors">
            <MessageCircle className="w-6 h-6" />
          </button>
          <button className="p-3 hover:bg-gray-700 rounded-full transition-colors">
            <Bell className="w-6 h-6" />
          </button>
        </div>

        {/* Profile & Menu */}
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-700 rounded-full transition-colors">
            <Plus className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-700 rounded-full transition-colors">
            <MessageSquare className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-gray-700 rounded-full transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
