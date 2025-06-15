import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Upload,
  ImageIcon,
  Trash2,
  Heart,
  MessageCircle,
  Eye,
  Plus,
  X,
} from "lucide-react";
import { toast } from "react-hot-toast";

// Types
interface ContentSection {
  id?: number;
  type: "text" | "image" | "code" | "video" | "link" | "html";
  content?: string | null;
  src?: string | null;
  imageDetail?: string[]; // Array of additional image URLs
  order: number;
}

interface PostData {
  postId?: number;
  title: string;
  description: string;
  category: string;
  mediaUrl?: string;
  sections: ContentSection[];
  author?: {
    userId: string;
    username: string;
    profilePic?: string;
  };
  likesCount?: number;
  commentsCount?: number;
  viewsCount?: number;
  createdAt?: string;
  isLiked?: boolean;
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

// BlogPostPreview Component
const BlogPostPreview: React.FC<{ postData: PostData }> = ({ postData }) => {
  const renderSection = (section: ContentSection) => {
    switch (section.type) {
      case "text":
        return (
          <div className="mb-4">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {section.content}
            </p>
          </div>
        );
      case "image":
        return (
          <div className="mb-4">
            {/* Main image */}
            {section.src && (
              <div className="mb-4">
                <img
                  src={section.src}
                  alt="Main image"
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>
            )}
            {/* Additional images from imageDetail */}
            {section.imageDetail && section.imageDetail.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  Additional Images (
                  {
                    section.imageDetail.filter(
                      (url) => url && url.trim() !== ""
                    ).length
                  }
                  ):
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {section.imageDetail
                    .filter((url) => url && url.trim() !== "") // Filter empty URLs
                    .map((imageUrl, index) => (
                      <div key={index} className="relative">
                        <img
                          src={imageUrl}
                          alt={`Additional image ${index + 1}`}
                          className="w-full h-auto rounded-lg shadow-md hover:shadow-lg transition-shadow"
                          onError={(e) => {
                            // Hide broken images
                            e.currentTarget.style.display = "none";
                          }}
                        />
                        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        );
      case "code":
        return (
          <div className="mb-4">
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
              <code className="text-sm whitespace-pre-wrap break-words">
                {section.content?.split("\n").map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {"\n"}
                  </React.Fragment>
                ))}
              </code>
            </pre>
          </div>
        );
      case "video":
        return section.src ? (
          <div className="mb-4">
            <video controls className="w-full rounded-lg">
              <source src={section.src} />
              Your browser does not support the video tag.
            </video>
          </div>
        ) : null;
      case "link":
        return section.src ? (
          <div className="mb-4">
            <a
              href={section.src}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline break-all"
            >
              {section.src}
            </a>
          </div>
        ) : null;
      case "html":
        return (
          <div className="mb-4">
            <div dangerouslySetInnerHTML={{ __html: section.content || "" }} />
          </div>
        );
      default:
        return null;
    }
  };

  const sortedSections = [...postData.sections].sort(
    (a, b) => a.order - b.order
  );

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
        {postData.title || "Untitled Post"}
      </h1>

      {postData.mediaUrl && (
        <img
          src={postData.mediaUrl}
          alt={postData.title}
          className="w-full h-64 object-cover rounded-lg mb-4"
        />
      )}

      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {postData.description || "No description provided"}
      </p>

      {postData.category && (
        <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mb-4">
          {postData.category}
        </span>
      )}

      <div className="prose max-w-none">
        {sortedSections.map((section, index) => (
          <div key={index}>{renderSection(section)}</div>
        ))}
      </div>
    </div>
  );
};

// PostCard Component for listing posts
const PostCard: React.FC<{
  post: PostData;
  onLike: (postId: number) => void;
  onDelete?: (postId: number) => void;
  showActions?: boolean;
}> = ({ post, onLike, onDelete, showActions = true }) => {
  const { data: session } = useSession();
  const isOwner = session?.user?.id === post.author?.userId;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {post.mediaUrl && (
        <img
          src={post.mediaUrl}
          alt={post.title}
          className="w-full h-48 object-cover"
        />
      )}

      <div className="p-6">
        <div className="flex items-center mb-4">
          {post.author?.profilePic && (
            <Image
              width={40}
              height={40}
              src={post.author.profilePic}
              alt={post.author.username}
              className="w-8 h-8 rounded-full mr-3"
            />
          )}
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">
              {post.author?.username}
            </p>
            {post.createdAt && (
              <p className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
          {post.title}
        </h3>

        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {post.description}
        </p>

        {post.category && (
          <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm mb-4">
            {post.category}
          </span>
        )}

        {showActions && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => post.postId && onLike(post.postId)}
                className={`flex items-center space-x-1 ${
                  post.isLiked ? "text-red-500" : "text-gray-500"
                } hover:text-red-500 transition-colors`}
              >
                <Heart
                  className={`w-5 h-5 ${post.isLiked ? "fill-current" : ""}`}
                />
                <span>{post.likesCount || 0}</span>
              </button>

              <div className="flex items-center space-x-1 text-gray-500">
                <MessageCircle className="w-5 h-5" />
                <span>{post.commentsCount || 0}</span>
              </div>

              <div className="flex items-center space-x-1 text-gray-500">
                <Eye className="w-5 h-5" />
                <span>{post.viewsCount || 0}</span>
              </div>
            </div>

            {isOwner && onDelete && (
              <Button
                onClick={() => post.postId && onDelete(post.postId)}
                variant="destructive"
                size="sm"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Main Post Component
const Post: React.FC<{
  mode?: "create" | "edit" | "list";
  postId?: number;
}> = ({ mode = "create", postId }) => {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [contentSections, setContentSections] = useState<ContentSection[]>([]);

  // Helper function to get JWT token from session
  const getJWTToken = () => {
    if (session?.user?.jwtToken) {
      return session.user.jwtToken;
    }
    return null;
  };

  // API Functions with JWT Bearer token
  const postAPI = {
    createPost: async (postData: Omit<PostData, "postId">) => {
      const jwtToken = getJWTToken();
      if (!jwtToken) {
        throw new Error("JWT token not available. Please login again.");
      }

      const response = await fetch(`${BACKEND_URL}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        credentials: "include",
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create post");
      }
      return response.json();
    },

    updatePost: async (postId: number, postData: Partial<PostData>) => {
      const jwtToken = getJWTToken();
      if (!jwtToken) {
        throw new Error("JWT token not available. Please login again.");
      }

      const response = await fetch(`${BACKEND_URL}/api/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        credentials: "include",
        body: JSON.stringify(postData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update post");
      }
      return response.json();
    },

    deletePost: async (postId: number) => {
      const jwtToken = getJWTToken();
      if (!jwtToken) {
        throw new Error("JWT token not available. Please login again.");
      }

      const response = await fetch(`${BACKEND_URL}/api/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete post");
      }
      return response.json();
    },

    getPost: async (postId: number) => {
      const response = await fetch(`${BACKEND_URL}/api/posts/${postId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch post");
      }
      return response.json();
    },

    getAllPosts: async () => {
      const response = await fetch(`${BACKEND_URL}/api/posts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch posts");
      }
      return response.json();
    },

    likePost: async (postId: number) => {
      const jwtToken = getJWTToken();
      if (!jwtToken) {
        throw new Error("JWT token not available. Please login again.");
      }

      const response = await fetch(`${BACKEND_URL}/api/posts/${postId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to like post");
      }
      return response.json();
    },
  };

  // Load post data for edit mode
  useEffect(() => {
    if (mode === "edit" && postId) {
      loadPostForEdit();
    } else if (mode === "list") {
      loadAllPosts();
    }
  }, [mode, postId]);

  const loadPostForEdit = async () => {
    if (!postId) return;

    setLoading(true);
    try {
      const response = await postAPI.getPost(postId);
      if (response.success && response.post) {
        const post = response.post;
        setTitle(post.title || "");
        setDescription(post.description || "");
        setCategory(post.category || "");
        setMediaUrl(post.mediaUrl || "");
        setContentSections(post.sections || []);
      }
    } catch (error) {
      console.error("Error loading post:", error);
      toast.error("Failed to load post for editing");
    } finally {
      setLoading(false);
    }
  };

  const loadAllPosts = async () => {
    setLoading(true);
    try {
      const response = await postAPI.getAllPosts();
      if (response.success && response.posts) {
        setPosts(response.posts);
      }
    } catch (error) {
      console.error("Error loading posts:", error);
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  // Content section handlers
  const addContentSection = (type: ContentSection["type"]) => {
    const newSection: ContentSection = {
      type,
      content:
        type === "text" || type === "code" || type === "html" ? "" : undefined,
      src:
        type === "image" || type === "video" || type === "link"
          ? ""
          : undefined,
      imageDetail: type === "image" ? [""] : undefined, // Initialize with one empty URL for images
      order: contentSections.length,
    };
    setContentSections([...contentSections, newSection]);
  };

  // Helper functions for managing image details
  const addImageDetail = (sectionIndex: number) => {
    const updatedSections = contentSections.map((section, i) => {
      if (i === sectionIndex && section.type === "image") {
        return {
          ...section,
          imageDetail: [...(section.imageDetail || []), ""],
        };
      }
      return section;
    });
    setContentSections(updatedSections);
  };

  const updateImageDetail = (
    sectionIndex: number,
    imageIndex: number,
    value: string
  ) => {
    const updatedSections = contentSections.map((section, i) => {
      if (i === sectionIndex && section.type === "image") {
        const newImageDetail = [...(section.imageDetail || [])];
        newImageDetail[imageIndex] = value;
        return {
          ...section,
          imageDetail: newImageDetail,
        };
      }
      return section;
    });
    setContentSections(updatedSections);
  };

  const removeImageDetail = (sectionIndex: number, imageIndex: number) => {
    const updatedSections = contentSections.map((section, i) => {
      if (i === sectionIndex && section.type === "image") {
        const newImageDetail =
          section.imageDetail?.filter((_, idx) => idx !== imageIndex) || [];
        return {
          ...section,
          imageDetail: newImageDetail,
        };
      }
      return section;
    });
    setContentSections(updatedSections);
  };

  const updateContentSection = (
    index: number,
    updates: Partial<ContentSection>
  ) => {
    const updatedSections = contentSections.map((section, i) =>
      i === index ? { ...section, ...updates } : section
    );
    setContentSections(updatedSections);
  };

  const removeContentSection = (index: number) => {
    const updatedSections = contentSections
      .filter((_, i) => i !== index)
      .map((section, i) => ({ ...section, order: i }));
    setContentSections(updatedSections);
  };

  const moveContentSection = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === contentSections.length - 1)
    ) {
      return;
    }

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const updatedSections = [...contentSections];
    const temp = updatedSections[index];
    updatedSections[index] = updatedSections[newIndex];
    updatedSections[newIndex] = temp;

    // Update order values
    updatedSections.forEach((section, i) => {
      section.order = i;
    });

    setContentSections(updatedSections);
  };

  // Form submission handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session) {
      toast.error("Please sign in to create a post");
      return;
    }

    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    setLoading(true);
    try {
      const postData: Omit<PostData, "postId"> = {
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        mediaUrl: mediaUrl.trim() || undefined,
        sections: contentSections.map((section, index) => ({
          type: section.type,
          content: section.content || null,
          src: section.src || null,
          imageDetail:
            section.imageDetail?.filter((url) => url.trim() !== "") || [],
          order: section.order || index + 1,
        })),
        author: {
          userId: session.user.id!,
          username: session.user.username!,
          profilePic: session.user.image || undefined,
        },
      };

      let response;
      if (mode === "edit" && postId) {
        response = await postAPI.updatePost(postId, postData);
        toast.success("Post updated successfully!");
      } else {
        response = await postAPI.createPost(postData);
        toast.success("Post created successfully!");
      }

      // Reset form after successful creation
      if (mode === "create") {
        setTitle("");
        setDescription("");
        setCategory("");
        setMediaUrl("");
        setContentSections([]);
      }
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save post"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: number) => {
    if (!session) {
      toast.error("Please sign in to like posts");
      return;
    }

    try {
      await postAPI.likePost(postId);
      // Refresh posts to get updated like counts
      if (mode === "list") {
        loadAllPosts();
      }
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error("Failed to like post");
    }
  };

  const handleDelete = async (postId: number) => {
    if (!confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      await postAPI.deletePost(postId);
      toast.success("Post deleted successfully!");
      if (mode === "list") {
        loadAllPosts();
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    }
  };

  // Render content section editor
  const renderContentSectionEditor = (
    section: ContentSection,
    index: number
  ) => {
    return (
      <div
        key={index}
        className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 mb-4 bg-gray-50 dark:bg-gray-700"
      >
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2">
            <h4 className="font-semibold text-gray-700 dark:text-gray-300">
              {section.type.charAt(0).toUpperCase() + section.type.slice(1)}{" "}
              Section
            </h4>
            {section.type === "image" && section.imageDetail && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {section.imageDetail.filter((url) => url.trim() !== "").length}{" "}
                additional images
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            <Button
              type="button"
              onClick={() => moveContentSection(index, "up")}
              disabled={index === 0}
              variant="outline"
              size="sm"
              title="Move up"
            >
              ↑
            </Button>
            <Button
              type="button"
              onClick={() => moveContentSection(index, "down")}
              disabled={index === contentSections.length - 1}
              variant="outline"
              size="sm"
              title="Move down"
            >
              ↓
            </Button>
            <Button
              type="button"
              onClick={() => removeContentSection(index)}
              variant="destructive"
              size="sm"
              title="Remove section"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {(section.type === "text" ||
          section.type === "code" ||
          section.type === "html") && (
          <textarea
            value={section.content || ""}
            onChange={(e) =>
              updateContentSection(index, { content: e.target.value })
            }
            placeholder={`Enter ${section.type} content...`}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-vertical min-h-[100px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={section.type === "code" ? 8 : 4}
          />
        )}

        {section.type === "image" && (
          <div className="space-y-4">
            {/* Additional images */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Additional Images (
                  {section.imageDetail?.filter((url) => url.trim() !== "")
                    .length || 0}
                  )
                </label>
                <Button
                  type="button"
                  onClick={() => addImageDetail(index)}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Image</span>
                </Button>
              </div>

              <div className="space-y-2">
                {section.imageDetail &&
                  section.imageDetail.map((imageUrl, imageIndex) => (
                    <div key={imageIndex} className="flex gap-2 items-center">
                      <span className="text-sm text-gray-500 w-8 text-center">
                        {imageIndex + 1}.
                      </span>
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) =>
                          updateImageDetail(index, imageIndex, e.target.value)
                        }
                        placeholder={`Additional image ${
                          imageIndex + 1
                        } URL...`}
                        className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <Button
                        type="button"
                        onClick={() => removeImageDetail(index, imageIndex)}
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        title="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
              </div>

              {(!section.imageDetail || section.imageDetail.length === 0) && (
                <div className="text-center py-4 text-gray-500 text-sm border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                  No additional images added yet. Click "Add Image" to start.
                </div>
              )}
            </div>
          </div>
        )}

        {(section.type === "video" || section.type === "link") && (
          <input
            type="url"
            value={section.src || ""}
            onChange={(e) =>
              updateContentSection(index, { src: e.target.value })
            }
            placeholder={`Enter ${section.type} URL...`}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        )}
      </div>
    );
  };

  // List mode rendering
  if (mode === "list") {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          All Posts
        </h1>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              Loading posts...
            </p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">No posts found</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard
                key={post.postId}
                post={post}
                onLike={handleLike}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Create/Edit form rendering
  const currentPostData: PostData = {
    title,
    description,
    category,
    mediaUrl: mediaUrl || undefined,
    sections: contentSections,
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {mode === "edit" ? "Edit Post" : "Create New Post"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Basic Information
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter post title..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter post description..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-vertical min-h-[100px] bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Enter category..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Featured Image URL
                </label>
                <input
                  type="url"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="Enter featured image URL..."
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Content Sections */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Content Sections
                </h2>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    onClick={() => addContentSection("text")}
                    variant="outline"
                    size="sm"
                  >
                    + Text
                  </Button>
                  <Button
                    type="button"
                    onClick={() => addContentSection("image")}
                    variant="outline"
                    size="sm"
                  >
                    <ImageIcon className="w-4 h-4 mr-1" />
                    Image
                  </Button>
                  <Button
                    type="button"
                    onClick={() => addContentSection("code")}
                    variant="outline"
                    size="sm"
                  >
                    + Code
                  </Button>
                  <Button
                    type="button"
                    onClick={() => addContentSection("video")}
                    variant="outline"
                    size="sm"
                  >
                    + Video
                  </Button>
                  <Button
                    type="button"
                    onClick={() => addContentSection("link")}
                    variant="outline"
                    size="sm"
                  >
                    + Link
                  </Button>
                  <Button
                    type="button"
                    onClick={() => addContentSection("html")}
                    variant="outline"
                    size="sm"
                  >
                    + HTML
                  </Button>
                </div>
              </div>

              {contentSections.length === 0 ? (
                <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                  No content sections added yet. Click the buttons above to add
                  content.
                </div>
              ) : (
                <div className="space-y-4">
                  {contentSections.map((section, index) =>
                    renderContentSectionEditor(section, index)
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={loading || !title.trim()}
                className="px-8 py-3"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {mode === "edit" ? "Updating..." : "Creating..."}
                  </div>
                ) : (
                  <>{mode === "edit" ? "Update Post" : "Create Post"}</>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Preview Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Live Preview
          </h2>
          <div className="sticky top-6">
            <BlogPostPreview postData={currentPostData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
