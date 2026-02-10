import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, MessageCircle } from 'lucide-react';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // لازم يكون هنا داخل جسم المكون
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'الرئيسية', href: '/', active: isHomePage },
    { name: 'إعداد الأنظمة', href: '/system-setup', active: location.pathname === '/system-setup' },
    { name: 'فرص الامتياز', href: '/gallery', active: location.pathname === '/gallery' },
    { name: 'الخدمات المساندة', href: '/services', active: location.pathname === '/services' },
    { name: 'عملاؤنا', href: '/clients', active: location.pathname === '/clients' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || !isHomePage ? 'bg-white shadow-md py-3' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <div className={`px-4 py-2 rounded-full border-2 flex flex-col items-center leading-tight ${
            isScrolled || !isHomePage ? 'border-dark-1' : 'border-white'
          }`}>
            <span className={`text-xs font-bold tracking-wider ${isScrolled || !isHomePage ? 'text-dark-1' : 'text-white'}`}>
              FRANCHISES GATE
            </span>
            <span className={`text-sm font-bold ${isScrolled || !isHomePage ? 'text-dark-1' : 'text-white'}`}>
              بـوابــة الامتيـــازات
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${
                link.active
                  ? 'bg-primary text-dark-1'
                  : isScrolled || !isHomePage
                  ? 'text-dark-2 hover:text-dark-1'
                  : 'text-white hover:text-primary'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm border-2 transition-colors ${
            isScrolled || !isHomePage
              ? 'border-dark-1 text-dark-1 hover:bg-dark-1 hover:text-white' 
              : 'border-white text-white hover:bg-white hover:text-dark-1'
          }`}>
            <MessageCircle className="w-4 h-4" />
            تواصل معنا
          </button>

          {/* زر تسجيل الدخول */}
          <button
            onClick={() => navigate('/login')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm border-2 transition-colors ${
              isScrolled || !isHomePage
                ? 'border-dark-1 text-dark-1 hover:bg-dark-1 hover:text-white'
                : 'border-white text-white hover:bg-white hover:text-dark-1'
            }`}
          >
            <User className="w-4 h-4" />
            تسجيل الدخول
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className={`w-6 h-6 ${isScrolled || !isHomePage ? 'text-dark-1' : 'text-white'}`} />
          ) : (
            <Menu className={`w-6 h-6 ${isScrolled || !isHomePage ? 'text-dark-1' : 'text-white'}`} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute top-full left-0 right-0">
          <div className="px-6 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`block font-medium py-2 ${
                  link.active ? 'text-primary' : 'text-dark-1'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <button className="w-full flex items-center justify-center gap-2 border-2 border-dark-1 text-dark-1 px-6 py-3 rounded-full font-semibold mt-4">
              <MessageCircle className="w-4 h-4" />
              تواصل معنا
            </button>

            {/* زر تسجيل الدخول للموبايل */}
            <button
              onClick={() => navigate('/login')}
              className="w-full flex items-center justify-center gap-2 bg-primary text-dark-1 px-6 py-3 rounded-full font-semibold"
            >
              <User className="w-4 h-4" />
              تسجيل الدخول
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;