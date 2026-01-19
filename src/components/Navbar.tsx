import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Menu, X } from "lucide-react";

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const isPortfolioPage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const portfolioLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Experience", href: "#experience" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ];

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ease-in-out ${
        scrolled
          ? "bg-slate-900/95 backdrop-blur-md shadow-lg py-2"
          : "bg-slate-900/80 backdrop-blur-sm py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 transform transition-all duration-300 hover:scale-105">
            <Link to="/" className="flex items-center gap-3 group">
              <span className="text-xl font-bold text-white tracking-wide transition-all duration-300 hover:text-primary group-hover:drop-shadow-[0_0_15px_rgba(96,165,250,0.7)]">
                Youssef Rajeh
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {isPortfolioPage ? (
              <div className="flex items-baseline space-x-8">
                {portfolioLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-slate-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:tracking-wider hover:scale-110 transform relative group hover:shadow-[0_0_20px_rgba(96,165,250,0.5)] hover:bg-primary/10"
                  >
                    {link.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full group-hover:shadow-[0_0_10px_rgba(96,165,250,0.8)]"></span>
                  </a>
                ))}
              </div>
            ) : null}

            {/* Library Link */}
            <Link
              to="/library"
              className="text-slate-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:tracking-wider hover:scale-110 transform relative group hover:shadow-[0_0_20px_rgba(96,165,250,0.5)] hover:bg-primary/10"
            >
              📚 Library
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full group-hover:shadow-[0_0_10px_rgba(96,165,250,0.8)]"></span>
            </Link>

            {/* User Menu */}
            {user && (
              <div className="flex items-center gap-4">
                <span className="text-slate-400 text-sm">
                  {user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-md text-sm font-medium transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-300 hover:text-primary p-2 rounded-md transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-slate-700/50 mt-2">
            {isPortfolioPage && portfolioLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-300 hover:text-primary hover:bg-primary/10 px-3 py-2 rounded-md text-base font-medium transition-all"
              >
                {link.name}
              </a>
            ))}
            
            <Link
              to="/library"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-slate-300 hover:text-primary hover:bg-primary/10 px-3 py-2 rounded-md text-base font-medium transition-all"
            >
              📚 Library
            </Link>

            {user && (
              <>
                <div className="px-3 py-2 text-slate-400 text-sm">
                  {user.username}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-md text-base font-medium transition-all"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
