import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useSession, signOut, signIn } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from "./ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";

interface Post {
  title: string;
  createdAt: string | Date;
  author?: {
    username?: string;
  };
}

interface NavbarProps {
  currentPost: Post | null;
}

const Navbar: React.FC<NavbarProps> = ({ currentPost }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const { data: session } = useSession();

  const handleGoogleLogin = async () => {
    try {
      await signIn("google", { callbackUrl: "/" });
      setIsLoginOpen(false);
      setIsRegisterOpen(false);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="sticky top-0 z-50">
      {/* Login/Register Section */}
      <div className="px-5 py-2 border-b border-neutral-800 bg-neutral-950">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Image
              src="/bg.png"
              alt="Logo"
              width={30}
              height={30}
              className="w-8 h-8"
            />
          </div>

          {/* Login/Register Buttons */}
          <div className="flex items-center space-x-2">
            {!session ? (
              <>
                {/* Login Dialog */}
                <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-white border-neutral-700 hover:bg-neutral-800"
                    >
                      Login
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md bg-neutral-900 border-neutral-700">
                    <DialogHeader>
                      <DialogTitle className="text-white text-center">
                        Login to your account
                      </DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center space-y-4 py-4">
                      <Button
                        onClick={handleGoogleLogin}
                        className="w-full bg-white hover:bg-gray-100 text-black font-medium py-2 px-4 rounded-md flex items-center justify-center space-x-2"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        <span>Login with Google</span>
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Register Dialog */}
                <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Register
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md bg-neutral-900 border-neutral-700">
                    <DialogHeader>
                      <DialogTitle className="text-white text-center">
                        Create your account
                      </DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center space-y-4 py-4">
                      <Button
                        onClick={handleGoogleLogin}
                        className="w-full bg-white hover:bg-gray-100 text-black font-medium py-2 px-4 rounded-md flex items-center justify-center space-x-2"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        <span>Sign up with Google</span>
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center space-x-3 cursor-pointer">
                    <span className="text-white text-sm">
                      {session.user?.name}
                    </span>
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={session.user?.image || ""}
                        alt={session.user?.name || ""}
                      />
                      <AvatarFallback>
                        {session.user?.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-neutral-900 border-neutral-700">
                  <Link href="/profile" className="block">
                    <DropdownMenuItem className="text-white cursor-pointer focus:bg-neutral-800">
                      Profile
                      <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem
                    className="text-white cursor-pointer focus:bg-neutral-800"
                    onClick={handleLogout}
                  >
                    Log out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex items-center justify-between bg-slate-900 py-2 px-5">
        <div className="flex items-center space-x-4">
          <h1 className="text-lg font-bold text-white truncate max-w-2xl">
            {currentPost?.title || "Forum Post"}
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-400 text-xs">
            by {currentPost?.author?.username || "Unknown"} •{" "}
            {currentPost?.createdAt
              ? new Date(currentPost.createdAt).toLocaleDateString()
              : "Recently"}
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
