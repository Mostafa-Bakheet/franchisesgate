import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, SlidersHorizontal } from 'lucide-react';
import SEO from '../components/SEO';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import LazyImage from '../components/LazyImage';
import FloatingActionMenu from '../components/FloatingActionMenu';
import FranchiseCompare from '../components/FranchiseCompare';
import AIInvestmentCalculator from '../components/AIInvestmentCalculator';
import FranchiseSimulator from '../components/FranchiseSimulator';
import UserJourneyTracker from '../components/UserJourneyTracker';
import AIChatbot from '../components/AIChatbot';
import InvestmentMap from '../components/InvestmentMap';
import FranchiseOwnerChat from '../components/FranchiseOwnerChat';
import { API_BASE_URL, getImageUrl } from '../config.js';

const GalleryPage = () => {
  const [franchises, setFranchises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openComponent, setOpenComponent] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    country: '',
    sortBy: 'newest'
  });
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    countries: []
  });

  useEffect(() => {
    fetchFranchises();
    fetchFilterOptions();
  }, [filters]);

  const fetchFranchises = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.country) queryParams.append('country', filters.country);
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
      
      const response = await fetch(`${API_BASE_URL}/api/gallery?${queryParams}`);
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message || 'Failed to load franchises');
      
      setFranchises(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/gallery/filters`);
      const data = await response.json();
      
      if (response.ok) {
        setFilterOptions({
          categories: data.data?.categories || [],
          countries: data.data?.countries || []
        });
      }
    } catch (err) {
      console.error('Failed to load filter options:', err);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({ category: '', country: '', sortBy: 'newest' });
  };

  return (
    <div className="min-h-screen bg-light-1">
      <SEO 
        title="معرض الفرنشايز | اكتشف أفضل فرص الاستثمار في السعودية"
        description="تصفح مجموعة واسعة من فرص الامتياز التجاري في مختلف القطاعات. مطاعم، كوفي شوب، صيدليات، وخدمات أخرى. احصل على تفاصيل الاستثمار والتكاليف."
        keywords="معرض فرنشايز, امتياز تجاري, استثمار فرنشايز, فرص استثمارية السعودية, شراء فرنشايز, امتياز مطاعم"
        canonical="/gallery"
      />
      <Navigation />
      
      {/* Simple Navigation */}
      <nav className="bg-white py-4 px-6 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link to="#" className="flex items-center gap-2">
  <div className="px-3 py-2 rounded-full border-2 flex flex-col items-center leading-tight border-dark-1">
    <span className="text-xs font-bold tracking-wider text-dark-1">
      FRANCHISES GATE
    </span>
    <span className="text-sm font-bold text-dark-1">
      بـوابــة الامتيـــازات
    </span>
  </div>
</Link>
          <Link 
            to="/" 
            className="text-dark-2 hover:text-dark-1 transition-colors text-sm"
          >
            العودة للرئيسية
          </Link>
        </div>
      </nav>

      {/* Gallery Content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-dark-1">
              سوق الفرنشايز
            </h1>
            <p className="text-dark-2/60 mt-2">Browse franchise opportunities</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            <select 
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="px-4 py-2 rounded-full border border-gray-300 bg-white text-sm text-dark-1 focus:outline-none focus:border-primary"
            >
              <option value="">All Categories</option>
              {filterOptions.categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.value} ({cat.count})</option>
              ))}
            </select>

            <select 
              value={filters.country}
              onChange={(e) => handleFilterChange('country', e.target.value)}
              className="px-4 py-2 rounded-full border border-gray-300 bg-white text-sm text-dark-1 focus:outline-none focus:border-primary"
            >
              <option value="">All Countries</option>
              {filterOptions.countries.map(country => (
                <option key={country.value} value={country.value}>{country.value} ({country.count})</option>
              ))}
            </select>

            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="px-4 py-2 rounded-full border border-gray-300 bg-white text-sm text-dark-1 focus:outline-none focus:border-primary"
            >
              <option value="newest">Newest</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="mostPopular">Most Popular</option>
            </select>

            <button 
              onClick={resetFilters}
              className="px-4 py-2 rounded-full border border-gray-300 bg-white text-sm text-dark-1 hover:bg-gray-50 transition-colors flex items-center gap-1"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Reset
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <button 
                onClick={fetchFranchises}
                className="text-primary hover:underline"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Franchise Grid */}
          {!loading && !error && (
            <>
              {franchises.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-dark-2/60">No franchises found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {franchises.map((franchise) => (
                    <div key={franchise.id} className="bg-[#a8f0c0] rounded-[24px] p-3">
                      {/* Logo Container */}
                      <div className="bg-white rounded-[20px] p-6 mb-4 flex items-center justify-center h-32 overflow-hidden">
                        {franchise.logo ? (
                          <img
                            src={getImageUrl(franchise.logo)}
                            alt={`شعار ${franchise.name}`}
                            className="max-h-24 max-w-full object-contain"
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                              console.log('Logo failed to load:', franchise.logo);
                              // Try WebP version if original fails
                              if (!franchise.logo.endsWith('.webp')) {
                                const webpUrl = franchise.logo.replace(/\.[^.]+$/, '.webp');
                                if (e.target.src !== webpUrl) {
                                  e.target.src = webpUrl;
                                  return;
                                }
                              }
                              e.target.src = 'placeholder-logo.png';
                            }}
                          />
                        ) : (
                          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-2xl font-bold">
                            {franchise.name?.charAt(0) || 'F'}
                          </div>
                        )}
                      </div>
                      
                      {/* Name */}
                      <h3 className="text-xl font-semibold text-dark-1 text-center mb-1">
                        {franchise.name}
                      </h3>
                      
                      {/* Category */}
                      <p className="text-dark-2/60 text-sm text-center mb-2">
                        {franchise.category}
                      </p>

                      {/* Investment */}
                      {franchise.investment && (
                        <p className="text-xs text-center text-dark-2/80 mb-4">
                          ${franchise.investment.minInvestment?.toLocaleString()} - ${franchise.investment.maxInvestment?.toLocaleString()}
                        </p>
                      )}
                      
                      {/* Buttons */}
                      <div className="flex gap-2">
                        <Link 
                          to={`/profile/${franchise.id}`}
                          className="flex-1 bg-dark-1 text-white py-3 rounded-xl font-semibold text-sm hover:bg-dark-2 transition-colors text-center"
                        >
                          التفاصيل
                        </Link>
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                          <img 
                            src="icons8-saudi-arabia-48.png" 
                            alt="" 
                            className="w-10"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
      <Footer />
      
      {/* Unified Floating Action Menu */}
      <FloatingActionMenu 
        page="gallery"
        onOpenSimulator={() => setOpenComponent('simulator')}
        onOpenAICalculator={() => setOpenComponent('ai-calculator')}
        onOpenCompare={() => setOpenComponent('compare')}
        onOpenJourney={() => setOpenComponent('journey')}
        onOpenChatbot={() => setOpenComponent('chatbot')}
        onOpenMap={() => setOpenComponent('map')}
        onOpenOwnerChat={() => setOpenComponent('owner-chat')}
      />

      {/* Components - controlled by menu */}
      <FranchiseCompare 
        externalOpen={openComponent === 'compare'} 
        onClose={() => setOpenComponent(null)} 
      />
      <AIInvestmentCalculator 
        externalOpen={openComponent === 'ai-calculator'} 
        onClose={() => setOpenComponent(null)} 
      />
      <FranchiseSimulator 
        externalOpen={openComponent === 'simulator'} 
        onClose={() => setOpenComponent(null)} 
      />
      <UserJourneyTracker 
        externalOpen={openComponent === 'journey'} 
        onClose={() => setOpenComponent(null)} 
      />
      <AIChatbot 
        externalOpen={openComponent === 'chatbot'} 
        onClose={() => setOpenComponent(null)} 
      />
      <InvestmentMap 
        externalOpen={openComponent === 'map'} 
        onClose={() => setOpenComponent(null)} 
      />
      <FranchiseOwnerChat 
        externalOpen={openComponent === 'owner-chat'} 
        onClose={() => setOpenComponent(null)} 
      />
    </div>
  );
};

export default GalleryPage;
