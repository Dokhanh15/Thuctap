import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/img/logo.png";
import { Menu, MenuItem, IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useUser } from "src/contexts/user";
import axios from "axios";
import { Category } from "src/types/products";

const Header = () => {
  const { user, setUser } = useUser();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate(); // useNavigate hook
  const [, setUserProfile] = useState<any>(null); // State for user profile

  useEffect(() => {
    setIsLoggedIn(!!user);
  }, [user]);

  useEffect(() => {
    // Fetch categories from API
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch user profile and navigate to profile page
  const handleViewProfile = async () => {
    try {
      const response = await axios.get("/auth/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUserProfile(response.data);
      navigate("/profile"); 
    } catch (error) {
      console.error("Error fetching user profile", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = "/login";
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setUserMenuOpen(true);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setUserMenuOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (anchorEl && !anchorEl.contains(event.target as Node)) {
      handleMenuClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [anchorEl]);

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <a href="/" className="flex items-center">
          <img src={logo} width={115} alt="Logo" />
        </a>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <a
            href="/"
            className="text-gray-800 hover:border-b-2 border-gray-600"
          >
            Trang chủ
          </a>
          <a
            href="/"
            className="text-gray-800 hover:border-b-2 border-gray-600"
          >
            Sản phẩm
          </a>

          {/* Dropdown Menu */}
          <div className="relative group">
            <button className="text-gray-800 hover:border-b-2 border-gray-600 flex items-center">
              Danh mục
              <svg
                className="w-4 h-4 ml-1"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div className="absolute z-10 left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              {categories.map((category) => (
                <a
                  key={category._id}
                  href="#"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  {category.name}
                </a>
              ))}
            </div>
          </div>

          <a
            href="/product/liked"
            className="text-gray-800 hover:border-b-2 border-gray-600"
          >
            Yêu thích
          </a>
          <a
            href="/product/liked"
            className="text-gray-800 hover:border-b-2 border-gray-600"
          >
            Liên hệ
          </a>
        </div>

        {/* Search Form */}
        <form className="relative flex items-center">
          <input
            type="search"
            placeholder="Tìm kiếm..."
            className="px-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-600"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-600"
          >
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
              />
            </svg>
          </button>
        </form>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              {/* Cart Icon */}
              <a
                href="/carts"
                className="relative text-gray-700 hover:text-gray-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 5v1H4.667a1.75 1.75 0 0 0-1.743 1.598l-.826 9.5A1.75 1.75 0 0 0 3.84 19H16.16a1.75 1.75 0 0 0 1.743-1.902l-.826-9.5A1.75 1.75 0 0 0 15.333 6H14V5a4 4 0 0 0-8 0Zm4-2.5A2.5 2.5 0 0 0 7.5 5v1h5V5A2.5 2.5 0 0 0 10 2.5ZM7.5 10a2.5 2.5 0 0 0 5 0V8.75a.75.75 0 0 1 1.5 0V10a4 4 0 0 1-8 0V8.75a.75.75 0 0 1 1.5 0V10Z"
                    clipRule="evenodd"
                  />
                </svg>

                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
                  0
                </span>
              </a>

              {/* User Profile */}
              <div className="flex items-center space-x-2 cursor-pointer">
                {user && (
                  <span className="text-gray-700">Hi, {user.username}</span>
                )}
                {user ? (
                  user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="User Avatar"
                      className="w-8 h-8 rounded-full cursor-pointer"
                      onClick={handleMenuOpen}
                    />
                  ) : (
                    <IconButton onClick={handleMenuOpen}>
                      <AccountCircleIcon />
                    </IconButton>
                  )
                ) : (
                  <a href="/login" className="text-gray-700">Đăng nhập</a>
                )}
              </div>

              {/* User Menu */}
              <Menu
                anchorEl={anchorEl}
                open={userMenuOpen}
                onClose={handleMenuClose}
              >
                <MenuItem
                  onClick={() => {
                    handleViewProfile(); // Fetch and navigate to profile
                    handleMenuClose();
                  }}
                >
                  Tài khoản của tôi
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleViewProfile(); // Fetch and navigate to profile
                    handleMenuClose();
                  }}
                >
                  Đơn mua 
                </MenuItem>
                <MenuItem sx={{color:'red'}} onClick={handleLogout}>Đăng xuất</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              {/* Login and Register Buttons */}
              <a
                href="/login"
                className="text-white bg-gray-800 px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none transition-colors duration-300"
              >
                Đăng nhập
              </a>
              <a
                href="/register"
                className="text-white bg-gray-800 px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none transition-colors duration-300"
              >
                Đăng ký
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
