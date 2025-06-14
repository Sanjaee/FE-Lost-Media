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

// Types for API response
interface Author {
  userId: string;
  username: string;
  profilePic: string;
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

const Navbar = ({ currentPost }: { currentPost: Post | null }) => {
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
            by {currentPost?.author?.username || "Unknown"} •{" "}
            {currentPost?.createdAt ? new Date(currentPost.createdAt).toLocaleDateString() : "Recently"}
          </span>
        </div>
      </div>
    </nav>
  );
};

const ProfileSidebar = ({ post }: { post: Post }) => {
  console.log(post);
  return (
    <div className="p-3 space-y-4">
      <div className="bg-neutral-900 rounded p-3 pb-6 mb-2">
        <div className="text-center mb-3">
          <h3 className=" flex justify-center items-center">
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

      <div className="flex items-center justify-between px-2 py-1 mb-2">
        <div className="flex-1"></div>
        <span className="text-gray-400 text-sm">Member</span>
        <div className="flex-1 flex justify-end">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
        </div>
      </div>

      <div className="bg-neutral-900 rounded p-5">
        <div className="flex justify-center mb-4">
          <div className="flex items-center justify-center">
             <Image
              width={150}
              height={150}
              src="/god.png"
              alt="Profile"
            />
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
            <span className="text-white">{new Date(post.author.createdAt).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Reputation</span>
            <span className="text-white">{post._count.likes}</span>
          </div>
        </div>

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
              <div className="mt-2 whitespace-pre-wrap">
                {section.content}
              </div>
            </div>
          </div>
        );

      case "code":
        return (
          <div key={section.sectionId} className="mb-6">
            <div className="flex items-center mb-2">
              <Code className="w-4 h-4 text-cyan-400 mr-2" />
            </div>
            <div className="bg-neutral-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-green-400 text-sm">
                <code>{section.content}</code>
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
                    target.src = "https://via.placeholder.com/400x200?text=Image+Not+Found";
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
                <video
                  controls
                  className="w-full h-auto"
                  preload="metadata"
                >
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
          <div className="flex items-center space-x-3 mb-2">
            <Image
              width={40}
              height={40}
              src={post.author.profilePic || "https://via.placeholder.com/40"}
              alt={post.author.username}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="text-cyan-400 font-semibold">{post.author.username}</h3>
              <div className="flex items-center space-x-2">
                <Calendar className="w-3 h-3 text-gray-400" />
                <span className="text-gray-400 text-xs">
                  {new Date(post.createdAt).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">{post.title}</h2>
          <p className="text-gray-300 text-sm mb-4">{post.description}</p>
        </div>

        {/* Main media image */}
        {post.mediaUrl && (
          <div className="mb-8">
            <ImageLightbox
              width={800}
              height={400}
              src={post.mediaUrl}
              alt={post.title}
              className="w-full h-auto rounded-lg shadow-md object-cover max-h-96"
            />
          </div>
        )}

        {/* Dynamic content sections */}
        {sortedSections.length > 0 ? (
          <div className="mb-6">
            {sortedSections.map(renderSection)}
          </div>
        ) : (
          <div className="mb-6">
            <p className="text-gray-400 italic">No content sections available</p>
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
        const response = await fetch('http://localhost:5000/api/posts');
        const result = await response.json();
        
        if (result.success && result.data) {
          setPosts(result.data);
          if (result.data.length > 0) {
            setCurrentPost(result.data[0]);
          }
        } else {
          setError('Failed to fetch posts');
        }
      } catch (err) {
        setError('Error connecting to API: ' + (err as Error).message);
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
            const index = parseInt(entry.target.dataset.postIndex || '0', 10);
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