import React from "react";
import Image from "next/image";

interface Post {
  title: string;
  createdAt: string | Date;
  category: string;
  author: {
    username: string;
    profilePic?: string;
    createdAt: string | Date;
  };
  _count: {
    comments: number;
    likes: number;
  };
}

interface ProfileSidebarProps {
  post: Post;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ post }) => {
  console.log(post);
  return (
    <div className="p-3 space-y-4">
      {/* Profile Card */}
      <div className="bg-neutral-900 rounded p-3 pb-6 mb-2">
        <div className="text-center mb-3">
          <h3 className="flex justify-center items-center">
            <span className="rf_owner mr-1"></span>
            <span className="owner">{post.author.username}</span>
          </h3>
        </div>

        <div className="flex justify-center">
          <div className="w-28 h-28 rounded overflow-hidden">
            <Image
              width={150}
              height={150}
              src={post.author.profilePic || "https://via.placeholder.com/150"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Status Row */}
      <div className="flex items-center justify-between px-2 py-1 mb-2">
        <div className="flex-1"></div>
        <span className="text-gray-400 text-sm">Member</span>
        <div className="flex-1 flex justify-end">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-neutral-900 rounded p-5">
        <div className="flex justify-center mb-5">
          <div className="flex items-center justify-center">
            <Image width={150} height={150} src="/god.png" alt="Profile" />
          </div>
        </div>

        <div className="space-y-1 mb-4 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Category</span>
            <span className="text-white">{post.category}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Threads</span>
            <span className="text-white">{post._count.comments}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Joined</span>
            <span className="text-white">
              {new Date(post.author.createdAt).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Reputation</span>
            <span className="text-white">{post._count.likes}</span>
          </div>
        </div>

        {/* Current Post */}
        <div className="mt-4 pt-4 border-t border-neutral-700">
          <div className="text-xs text-gray-400 mb-1">Current Post:</div>
          <div className="text-sm text-white font-medium leading-tight">
            {post.title}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {new Date(post.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;
