import {
  Heart,
  MessageCircle,
  Hash,
  User,
  Calendar,
  MapPin,
  ExternalLink,
  Code,
  Play,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import ImageLightbox from "@/components/ImageLightbox";
import Navbar from "@/components/Navbar";
import ProfileSidebar from "@/components/ProfileSidebar";
import React from "react";

// Types for API response
interface Author {
  userId: string;
  username: string;
  profilePic: string;
  createdAt: string | Date;
}

interface ContentSection {
  sectionId: string;
  type: "text" | "code" | "html" | "image" | "video" | "link";
  content: string | null;
  src: string | null;
  order: number;
  postId: string;
  createdAt: string;
  updatedAt: string;
}

interface Post {
  postId: string;
  userId: string;
  title: string;
  description: string;
  content: string;
  category: string;
  mediaUrl: string | null;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  author: Author;
  sections: ContentSection[];
  _count: {
    comments: number;
    likes: number;
  };
}

const PostContent = ({ post }: { post: Post }) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked((prev) => !prev);
  };

  const likeCount = post.likesCount + (isLiked ? 1 : 0);

  // Sort sections by order
  const sortedSections = post.sections
    ? [...post.sections].sort((a, b) => a.order - b.order)
    : [];

  const renderSection = (section: ContentSection) => {
    switch (section.type) {
      case "text":
        return (
          <div key={section.sectionId} className="mb-6">
            <div className="text-white leading-relaxed">
              <div className="mt-2 whitespace-pre-wrap">{section.content}</div>
            </div>
          </div>
        );

      case "code":
        return (
          <div key={section.sectionId} className="mb-6">
            <div className="bg-neutral-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-green-400 text-sm whitespace-pre-wrap break-words">
                <code>
                  {section.content?.split("\n").map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {"\n"}
                    </React.Fragment>
                  ))}
                </code>
              </pre>
            </div>
          </div>
        );

      case "html":
        return (
          <div key={section.sectionId} className="mb-6">
            <div className="flex items-center mb-2">
              <Code className="w-4 h-4 text-orange-400 mr-2" />
              <span className="text-orange-400 font-bold text-sm">
                {section.order}. HTML Content
              </span>
            </div>
            <div className="bg-neutral-900 rounded-lg p-4">
              <div
                className="text-white"
                dangerouslySetInnerHTML={{ __html: section.content || "" }}
              />
            </div>
          </div>
        );

      case "image":
        return (
          <div key={section.sectionId} className="mb-6">
            <div className="flex items-center mb-2">
              <span className="text-purple-400 font-bold text-sm">
                {section.order}. Image
              </span>
            </div>
            {section.src && (
              <div className="rounded-lg overflow-hidden">
                <Image
                  width={800}
                  height={400}
                  src={section.src}
                  alt={`Image ${section.order}`}
                  className="w-full h-auto max-w-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://via.placeholder.com/400x200?text=Image+Not+Found";
                  }}
                />
              </div>
            )}
            {section.content && (
              <p className="text-gray-300 text-sm mt-2">{section.content}</p>
            )}
          </div>
        );

      case "video":
        return (
          <div key={section.sectionId} className="mb-6">
            <div className="flex items-center mb-2">
              <Play className="w-4 h-4 text-red-400 mr-2" />
              <span className="text-red-400 font-bold text-sm">
                {section.order}. Video
              </span>
            </div>
            {section.src && (
              <div className="rounded-lg overflow-hidden bg-neutral-900">
                <video controls className="w-full h-auto" preload="metadata">
                  <source src={section.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
            {section.content && (
              <p className="text-gray-300 text-sm mt-2">{section.content}</p>
            )}
          </div>
        );

      case "link":
        return (
          <div key={section.sectionId} className="mb-6">
            <div className="flex items-center mb-2">
              <ExternalLink className="w-4 h-4 text-blue-400 mr-2" />
              <span className="text-blue-400 font-bold text-sm">
                {section.order}. Link
              </span>
            </div>
            <div className="bg-neutral-900 rounded-lg p-4">
              {section.src && (
                <a
                  href={section.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline break-all"
                >
                  {section.src}
                </a>
              )}
              {section.content && (
                <p className="text-gray-300 text-sm mt-2">{section.content}</p>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div key={section.sectionId} className="mb-6">
            <div className="text-gray-400 text-sm">
              Unknown section type: {section.type}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-neutral-950 p-4 min-h-screen">
      <div className="border-b border-neutral-800 pb-8 last:border-b-0">
        <div className="mb-4">
          <div className="flex items-center space-x-3 mb-6">
            <Image
              width={40}
              height={40}
              src={post.author.profilePic || "https://via.placeholder.com/40"}
              alt={post.author.username}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3>
                <span className="rf_owner "></span>
                <span className="owner">{post.author.username}</span>
              </h3>
              <div className="flex items-center space-x-2">
                <Calendar className="w-3 h-3 text-gray-400" />
                <span className="text-gray-400 text-xs">
                  {new Date(post.createdAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>
          <h2 className="text-xl font-bold text-[#e7e7e7] mb-2">{post.title}</h2>
          <p className="text-[#e7e7e7] text-sm mb-4">{post.description}</p>
        </div>

        {/* Main media image */}
        {post.mediaUrl && (
          <div className="mb-8 flex justify-center">
            <ImageLightbox
              width={1000}
              height={1000}
              src={post.mediaUrl}
              alt={post.title}
              className="w-full h-full shadow-md "
            />
          </div>
        )}

        {/* Dynamic content sections */}
        {sortedSections.length > 0 ? (
          <div className="mb-6">{sortedSections.map(renderSection)}</div>
        ) : (
          <div className="mb-6">
            <p className="text-gray-400 italic">
              No content sections available
            </p>
          </div>
        )}

        {/* Post stats and actions */}
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
              <span>{post.commentsCount} Comments</span>
            </button>
          </div>
          <div className="text-gray-400 text-xs">
            <Hash className="w-3 h-3 inline mr-1" />
            {post.postId.slice(0, 8)}...
          </div>
        </div>
      </div>
    </div>
  );
};

const ForumLayout = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const postRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Fetch posts from API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/posts");
        const result = await response.json();

        if (result.success && result.data) {
          setPosts(result.data);
          if (result.data.length > 0) {
            setCurrentPost(result.data[0]);
          }
        } else {
          setError("Failed to fetch posts");
        }
      } catch (err) {
        setError("Error connecting to API: " + (err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Intersection Observer for tracking current post
  useEffect(() => {
    if (posts.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.postIndex || "0", 10);
            if (posts[index]) {
              setCurrentPost(posts[index]);
            }
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
  }, [posts]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-white text-lg">Loading posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-red-400 text-lg">{error}</div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-gray-400 text-lg">No posts available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 w-full">
      <Navbar currentPost={currentPost} />
      <div className="px-2">
        {posts.map((post, index) => (
          <div
            key={post.postId}
            ref={(el) => (postRefs.current[index] = el)}
            data-post-index={index}
            className="flex relative"
          >
            <div className="w-80 flex-shrink-0">
              <div className="sticky top-20">
                <ProfileSidebar post={post} />
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
