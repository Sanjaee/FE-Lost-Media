import { Search, Settings, User, Users } from "lucide-react";
import React from "react";

const RightSidebar = () => {
  return (
    <div className="w-80 p-4 sticky top-20 h-screen overflow-y-auto">
      {/* Contacts */}
      <div className="mb-6">
        <h3 className="text-gray-400 font-semibold mb-3 flex items-center justify-between">
          Contacts
          <div className="flex space-x-2">
            <button className="text-gray-400 hover:text-white transition-colors">
              <Search className="w-4 h-4" />
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </h3>
        <div className="space-y-2">
          {[
            "Alice Johnson",
            "Bob Wilson",
            "Carol Davis",
            "David Brown",
            "Emma Taylor",
          ].map((name, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors"
            >
              <div className="relative">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
              </div>
              <span className="text-sm">{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Group Conversations */}
      <div>
        <h3 className="text-gray-400 font-semibold mb-3">
          Group Conversations
        </h3>
        <div className="space-y-2">
          {["Work Team", "Family Group", "College Friends"].map(
            (group, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors"
              >
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-sm">{group}</span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
