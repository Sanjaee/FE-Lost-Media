import React, { useState } from "react";
import {
  Search,
  Award,
  MessageCircle,
  Users,
  Calendar,
  Clock,
  User,
} from "lucide-react";
import { useSession, signOut, signIn } from "next-auth/react";
import Image from "next/image";

export default function ForumProfile() {
  const { data: session } = useSession();
  console.log("Session:", session);
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="bg-slate-800 border border-slate-600 p-8 rounded-lg shadow-lg w-full max-w-sm text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome to Lost Media
          </h1>
          <p className="text-center text-gray-400 mb-6">
            Please sign in to continue
          </p>
          <button
            onClick={() => signIn("google", { callbackUrl: "/profile" })}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-gray-300">
      <div className="p-4 w-full">
        {/* Header Profile */}
        <div className="bg-slate-800 border border-slate-600 rounded-lg mb-6 overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start p-6">
            <div className="flex items-center mb-4 lg:mb-0">
              <Image
                width={100}
                height={100}
                src={session.user?.image || "/default-avatar.png"}
                alt="User Avatar"
                className="w-20 h-20 rounded-lg border-2 border-gray-600 mr-4"
              />
              <div>
                <h1 className="text-2xl font-bold mb-1">
                  <span className="text-red-400 font-bold">[Owner]</span>{" "}
                  {session.user?.name}
                </h1>
                <p className="text-gray-400 text-lg mb-1">Bossman</p>
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
                  <span>
                    Status: Offline (Last Visit: March 15, 2023, 03:53 PM)
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="ml-auto bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Forum Info */}
            <div className="bg-slate-800 border border-slate-600 rounded-lg overflow-hidden">
              <h2 className="bg-blue-800 text-white text-lg font-semibold p-4 flex items-center">
                <User className="mr-2 h-5 w-5" />
                {session.user?.name}'s Forum Info
              </h2>
              <div className="p-4">
                <div className="bg-purple-900 border-2 border-purple-500 shadow-lg shadow-purple-500/30 text-purple-100 text-center py-3 px-4 rounded-lg font-bold tracking-widest mb-6 text-sm">
                  ADMINISTRATOR
                </div>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-400 flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      Joined:
                    </span>
                    <span>March 4, 2022</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-400 flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      Time Spent Online:
                    </span>
                    <span>2 Months, 1 Week</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-400">
                      Username Changes:
                    </span>
                    <span>1</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-400 flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      Members Referred:
                    </span>
                    <span>426</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-slate-800 border border-slate-600 rounded-lg overflow-hidden">
              <h2 className="bg-blue-800 text-white text-lg font-semibold p-4">
                Additional Info About {session.user?.name}
              </h2>
              <div className="p-4 space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-400">Bio:</span>
                  <span>😊</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-400">Gender:</span>
                  <span>Undisclosed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Forum Statistics */}
            <div className="bg-slate-800 border border-slate-600 rounded-lg overflow-hidden">
              <h2 className="bg-blue-800 text-white text-lg font-semibold p-4 flex items-center">
                <MessageCircle className="mr-2 h-5 w-5" />
                {session.user?.name}'s Forum Statistics
              </h2>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="font-semibold text-gray-400">
                      Total Threads:
                    </p>
                    <p className="text-lg">
                      314{" "}
                      <span className="text-sm text-gray-500">
                        (0.83 threads per day | 0.66 percent of total threads)
                      </span>
                    </p>
                    <a
                      href="#"
                      className="flex items-center text-blue-400 hover:text-blue-300 text-sm transition-colors"
                    >
                      <Search className="mr-1 h-4 w-4" />
                      Find All Threads
                    </a>
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-gray-400">Total Posts:</p>
                    <p className="text-lg">
                      4,182{" "}
                      <span className="text-sm text-gray-500">
                        (11.04 posts per day | 0.43 percent of total posts)
                      </span>
                    </p>
                    <a
                      href="#"
                      className="flex items-center text-blue-400 hover:text-blue-300 text-sm transition-colors"
                    >
                      <Search className="mr-1 h-4 w-4" />
                      Find All Posts
                    </a>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <p className="font-semibold text-gray-400">Reputation:</p>
                    <p className="text-lg text-green-400 font-bold">4,492</p>
                    <a
                      href="#"
                      className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                    >
                      Details
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Signature */}
            <div className="bg-slate-800 border border-slate-600 rounded-lg overflow-hidden">
              <h2 className="bg-blue-800 text-white text-lg font-semibold p-4">
                {session.user?.name}'s Signature
              </h2>
              <div className="p-6 text-center"></div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 border border-slate-600 rounded-lg overflow-hidden">
              <h2 className="bg-blue-800 text-white text-lg font-semibold p-4 flex items-center">
                <Award className="mr-2 h-5 w-5" />
                {session.user?.name}'s awards.
              </h2>
              <div className="p-4">
                <p className="text-sm text-gray-400 text-center">
                  This user has no awards at this time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
