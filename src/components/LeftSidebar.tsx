import { Heart, Star } from "lucide-react";
import React from "react";

// Character Card Component
const CharacterCard = () => {
  return (
    <div className="w-80 bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-700">
      {/* Header with heart icon */}
      <div className="relative">
        <div className="absolute top-3 left-3 flex items-center space-x-1 text-red-500">
          <Heart className="w-4 h-4 fill-current" />
          <span className="text-sm font-medium">Bjørka</span>
        </div>
        
        {/* Character Image */}
        <div className="h-80 bg-gradient-to-b from-orange-400 to-orange-600 flex items-center justify-center">
          <div className="w-48 h-48 rounded-full bg-orange-300 flex items-center justify-center overflow-hidden">
            <div className="text-6xl">👤</div>
          </div>
        </div>
      </div>

      {/* Star Rating */}
      <div className="px-6 py-4 bg-gray-800">
        <div className="flex justify-center space-x-1 mb-2">
          {[...Array(6)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500">
        <h2 className="text-2xl font-bold text-center text-black">GOD</h2>
      </div>

      {/* Stats */}
      <div className="px-6 py-6 bg-gray-900 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Points</span>
          <span className="text-white font-semibold">4</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Threads</span>
          <span className="text-white font-semibold">1</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Joined</span>
          <span className="text-white font-semibold">Aug 2022</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Reputation</span>
          <span className="text-green-500 font-semibold">324</span>
        </div>
      </div>
    </div>
  );
};

// Left Sidebar Component
const LeftSidebar = () => {
  return (
    <div className="w-80 p-4 sticky top-20 h-screen overflow-y-auto bg-gray-900">
      {/* Character Card */}
      <div>
        <CharacterCard />
      </div>
    </div>
  );
};

export default LeftSidebar;