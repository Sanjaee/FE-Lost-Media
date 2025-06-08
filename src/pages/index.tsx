import {
  Heart,
  MessageCircle,
  Hash,
  User,
  Calendar,
  MapPin,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

const dummyPosts = [
  {
    id: 1,
    title: "Premium Database Collection - 50M+ Records Available",
    author: "DataMaster",
    timestamp: "June 7, 2025, 09:30 AM",
    content:
      "High-quality database collection with comprehensive user information. Perfect for research and analytics purposes.",
    sampleData: {
      structure: [
        { field: "USER_ID", example: "12345678" },
        { field: "USERNAME", example: "john_doe" },
        { field: "EMAIL", example: "user@example.com" },
        { field: "LOCATION", example: "Jakarta, Indonesia" },
        { field: "SIGNUP_DATE", example: "2023-01-15" },
      ],
      downloadLinks: [
        "https://example.com/sample1.zip",
        "https://example.com/sample2.zip",
        "https://example.com/sample3.zip",
      ],
    },
    contact: "telegram:datamaster123",
    stats: { likes: 24, replies: 8 },
  },
  {
    id: 2,
    title: "E-commerce User Analytics Dataset - 25M Records",
    author: "AnalyticsGuru",
    timestamp: "June 6, 2025, 02:15 PM",
    content:
      "Comprehensive e-commerce user behavior dataset. Includes purchase history, browsing patterns, and demographic information.",
    sampleData: {
      structure: [
        { field: "CUSTOMER_ID", example: "CUST_001" },
        { field: "PURCHASE_AMOUNT", example: "$150.00" },
        { field: "CATEGORY", example: "Electronics" },
        { field: "DEVICE_TYPE", example: "Mobile" },
        { field: "SESSION_TIME", example: "45 minutes" },
      ],
      downloadLinks: [
        "https://example.com/ecommerce_sample.zip",
        "https://example.com/behavior_data.zip",
      ],
    },
    contact: "telegram:analytics_pro",
    stats: { likes: 156, replies: 23 },
  },
  {
    id: 3,
    title: "Social Media Engagement Dataset - 10M Posts",
    author: "SocialDataHub",
    timestamp: "June 5, 2025, 11:45 AM",
    content:
      "Rich social media engagement dataset with post interactions, user demographics, and trending topics analysis.",
    sampleData: {
      structure: [
        { field: "POST_ID", example: "POST_789" },
        { field: "ENGAGEMENT_RATE", example: "4.2%" },
        { field: "HASHTAGS", example: "#trending #viral" },
        { field: "SENTIMENT", example: "Positive" },
        { field: "REACH", example: "50,000" },
      ],
      downloadLinks: ["https://example.com/social_sample.zip"],
    },
    contact: "telegram:social_data_hub",
    stats: { likes: 89, replies: 15 },
  },
];

const dummyUsers = [
  {
    username: "DataMaster",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    status: "Premium Member",
    badge: "DATA EXPERT",
    stats: { posts: 127, threads: 34, reputation: 856, joined: "Jan 2023" },
    serviceYears: 2,
  },
  {
    username: "AnalyticsGuru",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    status: "Elite Member",
    badge: "ANALYTICS PRO",
    stats: { posts: 89, threads: 22, reputation: 654, joined: "Mar 2023" },
    serviceYears: 1,
  },
  {
    username: "SocialDataHub",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    status: "New User",
    badge: "MEMBER",
    stats: { posts: 45, threads: 12, reputation: 234, joined: "May 2024" },
    serviceYears: 1,
  },
];

const Navbar = ({ currentPost }) => {
  return (
    <nav className="px-4 py-2 border-b border-neutral-800 sticky top-0 bg-neutral-950 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-bold text-white truncate max-w-2xl">
            {currentPost?.title || "Forum Post"}
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-400 text-xs">
            by {currentPost?.author || "Unknown"} •{" "}
            {currentPost?.timestamp || "Recently"}
          </span>
        </div>
      </div>
    </nav>
  );
};

const ProfileSidebar = ({ post, activePostId }) => {
  const user = dummyUsers.find((u) => u.username === post.author);

  return (
    <div className="p-3 space-y-4">
      <div className="bg-neutral-900 rounded p-3 pb-6 mb-2">
        <div className="text-center mb-3">
          <h3 className="text-cyan-400 font-semibold text-base">
            {user?.username}
          </h3>
        </div>

        <div className="flex justify-center">
          <div className="w-28 h-28 rounded overflow-hidden">
            <img
              src={user?.avatar}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-2 py-1 mb-2">
        <div className="flex-1"></div>
        <span className="text-gray-400 text-sm">{user?.status}</span>
        <div className="flex-1 flex justify-end">
          <div
            className={`w-2 h-2 rounded-full ${
              user?.status === "New User"
                ? "bg-red-500"
                : user?.status === "Premium Member"
                ? "bg-green-500"
                : "bg-yellow-500"
            }`}
          ></div>
        </div>
      </div>

      <div className="bg-neutral-900 rounded p-5">
        <div className="flex justify-center mb-4">
          <div className="border-2 border-cyan-400 text-cyan-400 px-4 py-1 rounded text-sm font-medium bg-transparent">
            {user?.badge}
          </div>
        </div>

        <div className="space-y-1 mb-4 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Posts</span>
            <span className="text-white">{user?.stats.posts}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Threads</span>
            <span className="text-white">{user?.stats.threads}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Joined</span>
            <span className="text-white">{user?.stats.joined}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Reputation</span>
            <span className="text-white">{user?.stats.reputation}</span>
          </div>
        </div>

        <div className="text-center pt-2">
          <div className="text-green-400 text-xs font-medium">
            {user?.serviceYears} YEAR{user?.serviceYears > 1 ? "S" : ""} OF
            SERVICE
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-neutral-700">
          <div className="text-xs text-gray-400 mb-1">Current Post:</div>
          <div className="text-sm text-white font-medium leading-tight">
            {post.title}
          </div>
          <div className="text-xs text-gray-400 mt-1">{post.timestamp}</div>
        </div>
      </div>
    </div>
  );
};

const PostContent = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const user = dummyUsers.find((u) => u.username === post.author);

  const handleLike = () => {
    setIsLiked((prev) => !prev);
  };
  
  const likeCount = post.stats.likes + (isLiked ? 1 : 0);

  return (
    <div className="bg-neutral-950 p-4 min-h-screen">
      <div className="border-b border-neutral-800 pb-8 last:border-b-0">
        <div className="mb-4">
          <div className="flex items-center space-x-3 mb-2">
            <img
              src={user?.avatar}
              alt={post.author}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h3 className="text-cyan-400 font-semibold">{post.author}</h3>
              <div className="flex items-center space-x-2">
                <Calendar className="w-3 h-3 text-gray-400" />
                <span className="text-gray-400 text-xs">{post.timestamp}</span>
              </div>
            </div>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">{post.title}</h2>
        </div>

        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300 mb-4">{post.content}</p>

          <div className="text-gray-300 mb-4 font-mono text-sm bg-neutral-900 p-3 rounded">
            {post.sampleData.downloadLinks.map((link, linkIndex) => (
              <p key={linkIndex} className="mb-1">
                sample address {linkIndex + 1}: {link} password:samplepass
              </p>
            ))}
          </div>

          <p className="text-gray-300 mb-4">Contact: {post.contact}</p>

          <div className="text-gray-300 mb-4 font-mono text-sm">
            <p className="mb-2">Data structure:</p>
            <div className="bg-neutral-800 p-3 rounded">
              {post.sampleData.structure.map((item, structIndex) => (
                <p key={structIndex}>
                  "{item.field}": "{item.example}",
                </p>
              ))}
            </div>
          </div>
          
           <div className="text-gray-300 mb-4 space-y-4">
             <p>
               This dataset provides comprehensive insights into user behavior patterns and can be utilized for various analytical purposes. The data has been carefully curated and anonymized to ensure privacy compliance while maintaining statistical relevance.
             </p>
             <p>
               Key features include temporal analysis capabilities, demographic segmentation, and behavioral clustering. The dataset is regularly updated and maintained to ensure data quality and relevance for modern analytics requirements.
             </p>
              <p>
               For enterprise users, we also provide additional metadata, data lineage information, and quality metrics. Custom export formats and API access are available for premium subscribers.
             </p>
           </div>
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-800">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 transition-colors text-sm ${
                isLiked ? "text-red-400" : "text-gray-400 hover:text-white"
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
              <span>
                {likeCount} Like{likeCount !== 1 ? "s" : ""}
              </span>
            </button>
            <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-sm">
              <MessageCircle className="w-4 h-4" />
              <span>{post.stats.replies} Replies</span>
            </button>
          </div>
          <div className="text-gray-400 text-xs">
            <Hash className="w-3 h-3 inline mr-1" />
            {post.id}
          </div>
        </div>
      </div>
    </div>
  );
};

const ForumLayout = () => {
  const [currentPost, setCurrentPost] = useState(dummyPosts[0]);
  const postRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.postIndex, 10);
            setCurrentPost(dummyPosts[index]);
          }
        });
      },
      {
        rootMargin: "-40% 0px -60% 0px",
        threshold: 0,
      }
    );

    postRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
        postRefs.current.forEach((ref) => {
            if (ref) observer.unobserve(ref);
        });
    };
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 w-full">
      <Navbar currentPost={currentPost} />
      <div className="px-2">
        {dummyPosts.map((post, index) => (
          <div
            key={post.id}
            ref={(el) => (postRefs.current[index] = el)}
            data-post-index={index}
            className="flex relative"
          >
            <div className="w-80 flex-shrink-0">
              <div className="sticky top-20">
                <ProfileSidebar post={post} activePostId={currentPost.id} />
              </div>
            </div>
            <div className="flex-1">
              <PostContent post={post} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForumLayout;
