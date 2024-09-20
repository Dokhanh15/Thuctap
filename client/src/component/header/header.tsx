import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/img/logo.png";
import { Menu, MenuItem, IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useUser } from "src/contexts/user";
import axios from "axios";
import { Category } from "src/types/products";
import more from "../../assets/img/more.png";
import { useCart } from "src/contexts/Card";

interface HeaderProps {
  onSearch?: (searchTerm: string) => void; 
}
const Header: React.FC<HeaderProps> =  ({ onSearch = () => {} }) => {
  const { user, setUser } = useUser();  
  const [isLoggedIn, setIsLoggedIn] =  useState(!!user);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();
  const { cart } = useCart();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [, setUserProfile] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, [setUser]);

  useEffect(() => {
    if (user) {
      setIsLoggedIn(true); 
    }
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

  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleMenuUserOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setUserMenuOpen(true);
  };

  const handleMenuUserClose = () => {
    setAnchorEl(null);
    setUserMenuOpen(false);
  };

  const handleMoreMenuOpen = () => {
    setMoreMenuOpen(true);
  };

  const handleMoreMenuClose = () => {
    setMoreMenuOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node;
    if (anchorEl && !anchorEl.contains(event.target as Node)) {
      handleMenuUserClose();
    }
    if (
      anchorEl &&
      !(target instanceof Element && target.closest(".more-menu"))
    ) {
      handleMoreMenuClose();
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchQuery = event.target.value;
    setSearchQuery(newSearchQuery);
    onSearch(newSearchQuery);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(searchQuery);
  };

  const cartQuantity = useMemo(
    () =>
      cart
        ? cart.products.reduce((total, { quantity }) => total + quantity, 0)
        : 0,
    [cart]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [anchorEl]);

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto flex  items-center justify-between p-4">
        <div className="flex gap-5">
          <div className="lg:hidden flex items-center relative">
            <IconButton onClick={handleMoreMenuOpen}>
              <img src={more} alt="More" className="w-6 h-6" />
            </IconButton>

            {/* Menu */}
            <Menu
              anchorEl={anchorEl}
              open={moreMenuOpen}
              onClose={handleMoreMenuClose}
              className="absolute mx-3 mt-16 z-50"
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
            >
              <MenuItem onClick={handleMoreMenuClose}>
                <a href="/" className="text-gray-800">
                  Trang chủ
                </a>
              </MenuItem>
              <MenuItem onClick={handleMoreMenuClose}>
                <a href="/" className="text-gray-800">
                  Sản phẩm
                </a>
              </MenuItem>
              <MenuItem>
                <div className="relative">
                  <button
                    className="text-gray-800 hover:border-b-2 border-gray-600 flex items-center"
                    onClick={handleMenuToggle}
                  >
                    Danh mục
                    <ArrowDropDownIcon />
                  </button>
                  <div
                    className={`absolute z-10 left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg transition-all duration-300 ${
                      isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
                    }`}
                  >
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
              </MenuItem>
              <MenuItem onClick={handleMoreMenuClose}>
                <a href="/product/liked" className="text-gray-800">
                  Yêu thích
                </a>
              </MenuItem>
              <MenuItem onClick={handleMoreMenuClose}>
                <a href="/product/liked" className="text-gray-800">
                  Liên hệ
                </a>
              </MenuItem>
            </Menu>
          </div>

          {/* Logo */}
          <a href="/" className="flex items-center">
            <img src={logo} width={100} alt="Logo" />
          </a>
        </div>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center space-x-6">
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
        <form
          onSubmit={handleSearchSubmit}
          className="relative items-center hidden lg:flex"
        >
          <input
            type="search"
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={handleSearchChange}
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

                {/* Hiển thị số lượng sản phẩm trong giỏ */}
                {cartQuantity > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
                    {cartQuantity}
                  </span>
                )}
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
                      onClick={handleMenuUserOpen}
                    />
                  ) : (
                    <IconButton onClick={handleMenuUserOpen}>
                      <AccountCircleIcon />
                    </IconButton>
                  )
                ) : (
                  <a href="/login" className="text-gray-700">
                    Đăng nhập
                  </a>
                )}
              </div>

              {/* User Menu */}
              <Menu
                anchorEl={anchorEl}
                open={userMenuOpen}
                onClose={handleMenuUserClose}
              >
                <MenuItem
                  onClick={() => {
                    handleViewProfile();
                    handleMenuUserClose();
                  }}
                >
                  Tài khoản của tôi
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleViewProfile();
                    handleMenuUserClose();
                  }}
                >
                  Đơn mua
                </MenuItem>
                <MenuItem sx={{ color: "red" }} onClick={handleLogout}>
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
      <form className="relative flex items-center lg:hidden w-full px-9 mb-3">
        <input
          type="search"
          placeholder="Tìm kiếm..."
          className="w-full px-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-600"
        />
        <button
          type="submit"
          className="absolute right-16 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-600"
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
    </header>
  );
};

export default Header;
