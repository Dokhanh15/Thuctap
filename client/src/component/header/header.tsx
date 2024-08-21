import React, { useState, useEffect } from "react";
import logo from "../../assets/img/logo.png";
import { Menu, MenuItem, IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useUser } from "src/contexts/user";

const Header = () => {
  const { user, setUser } = useUser();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    // Cập nhật trạng thái đăng nhập khi có sự thay đổi trong `user`
    setIsLoggedIn(!!user);
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    // Điều hướng đến trang đăng nhập hoặc trang chính
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
            <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              <a
                href="/category/all"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Tất cả sản phẩm
              </a>
              <a
                href="/category/1"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Category 1
              </a>
              <a
                href="/category/2"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Category 2
              </a>
              <a
                href="/category/3"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Category 3
              </a>
            </div>
          </div>

          <a
            href="/product/liked"
            className="text-gray-800 hover:border-b-2 border-gray-600"
          >
            Yêu thích
          </a>
        </div>

        {/* Search Form */}
        <form className="relative flex items-center">
          <input
            type="search"
            placeholder="Tìm kiếm..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-600"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-600"
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
              <div className="flex items-center space-x-2">
                {user && (
                  <span className="text-gray-700">Hi, {user.username}</span>
                )}
                {user ? (
                  user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="User Avatar"
                      className="w-8 h-8 rounded-full"
                      onClick={handleMenuOpen}
                    />
                  ) : (
                    <IconButton onClick={handleMenuOpen}>
                      <AccountCircleIcon />
                    </IconButton>
                  )
                ) : (
                  <IconButton onClick={handleMenuOpen}>
                    <AccountCircleIcon />
                  </IconButton>
                )}
              </div>

              {/* User Menu */}
              <Menu
                anchorEl={anchorEl}
                open={userMenuOpen}
                onClose={handleMenuClose}
                PaperProps={{
                  style: {
                    minWidth: 180,
                  },
                }}
              >
                <MenuItem onClick={handleMenuClose}>
                  <a href="/user-info" className="text-gray-700">
                    Thông tin người dùng
                  </a>
                </MenuItem>
                <MenuItem onClick={handleLogout} className="text-gray-700">
                  Đăng xuất
                </MenuItem>
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
