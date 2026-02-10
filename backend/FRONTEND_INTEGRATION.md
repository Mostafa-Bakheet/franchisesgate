# Frontend Integration Guide

## 🎯 Frontend Changes Required

### 1. API Service Setup

Create `src/services/api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }

    return data;
  }

  // Auth
  login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  getMe() {
    return this.request('/auth/me');
  }

  // Gallery
  getGallery(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/gallery?${query}`);
  }

  getFranchiseById(id) {
    return this.request(`/gallery/${id}`);
  }

  getFilterOptions() {
    return this.request('/gallery/filters');
  }

  // Messages
  sendMessage(messageData) {
    return this.request('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  getMyMessages(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/messages/my-messages?${query}`);
  }

  // Owner Dashboard
  getMyFranchise() {
    return this.request('/franchises/my-franchise');
  }

  updateFranchise(data) {
    return this.request('/franchises/my-franchise', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  submitForApproval() {
    return this.request('/franchises/submit', {
      method: 'POST',
    });
  }
}

export const api = new ApiService();
```

### 2. Gallery Page - Dynamic Data

Update `GalleryPage.jsx`:

```javascript
import { useState, useEffect } from 'react';
import { api } from '../services/api';

const GalleryPage = () => {
  const [franchises, setFranchises] = useState([]);
  const [filters, setFilters] = useState({
    category: '',
    country: '',
    sortBy: 'newest'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFranchises();
    loadFilterOptions();
  }, [filters]);

  const loadFranchises = async () => {
    try {
      setLoading(true);
      const response = await api.getGallery({
        ...filters,
        page: 1,
        limit: 12
      });
      setFranchises(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic Franchise Card
  const FranchiseCard = ({ franchise }) => (
    <div className="bg-[#a8f0c0] rounded-[24px] p-3">
      <div className="bg-white rounded-[20px] p-6 mb-4 flex items-center justify-center h-32">
        <img
          src={franchise.logo || '/placeholder.png'}
          alt={franchise.name}
          className="max-h-24 w-auto object-contain"
        />
      </div>
      <h3 className="text-xl font-semibold text-dark-1 text-center mb-1">
        {franchise.name}
      </h3>
      <p className="text-dark-2/60 text-sm text-center mb-4">
        {franchise.category}
      </p>
      <div className="text-center mb-4">
        <span className="text-xs bg-white px-2 py-1 rounded-full">
          ${franchise.investment?.minInvestment?.toLocaleString()} - 
          ${franchise.investment?.maxInvestment?.toLocaleString()}
        </span>
      </div>
      <div className="flex gap-2">
        <Link 
          to={`/profile/${franchise.id}`}  // Dynamic routing!
          className="flex-1 bg-dark-1 text-white py-3 rounded-xl font-semibold text-sm hover:bg-dark-2 transition-colors text-center"
        >
          التفاصيل
        </Link>
        <button className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
          <img src="/icons8-saudi-arabia-48.png" alt="" className="w-10" />
        </button>
      </div>
    </div>
  );

  // Add filter handlers
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-light-1">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
        <select 
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="px-4 py-2 rounded-full border border-gray-300 bg-white text-sm"
        >
          <option value="">All Categories</option>
          <option value="RESTAURANTS">Restaurants</option>
          <option value="RETAIL">Retail</option>
          <option value="SERVICES">Services</option>
        </select>

        <select
          value={filters.sortBy}
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          className="px-4 py-2 rounded-full border border-gray-300 bg-white text-sm"
        >
          <option value="newest">Newest</option>
          <option value="lowestInvestment">Lowest Investment</option>
          <option value="mostPopular">Most Popular</option>
        </select>
      </div>

      {/* Loading State */}
      {loading && <div className="text-center py-12">Loading...</div>}

      {/* Error State */}
      {error && (
        <div className="text-center py-12 text-red-500">
          Error: {error}
        </div>
      )}

      {/* Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {franchises.map((franchise) => (
            <FranchiseCard key={franchise.id} franchise={franchise} />
          ))}
        </div>
      )}
    </div>
  );
};
```

### 3. Profile Page - Dynamic Routing

Update `App.jsx`:

```javascript
<Route path="/profile/:id" element={<ProfilePage />} />
```

Update `ProfilePage.jsx`:

```javascript
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { api } from '../services/api';

const ProfilePage = () => {
  const { id } = useParams(); // Get franchise ID from URL
  const [franchise, setFranchise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFranchise();
  }, [id]);

  const loadFranchise = async () => {
    try {
      setLoading(true);
      const response = await api.getFranchiseById(id);
      setFranchise(response.data.franchise);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;
  if (!franchise) return <div className="min-h-screen flex items-center justify-center">Franchise not found</div>;

  // Now use franchise data dynamically
  return (
    <div className="min-h-screen bg-light-1">
      <Navigation />
      
      {/* Header with dynamic data */}
      <section className="pt-24 pb-8 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <Link to="/gallery" className="text-dark-2 hover:text-dark-1 text-sm mb-6 inline-block">
            ← العودة إلى سوق الفرنشايز
          </Link>

          <div className="bg-[#f5f5f5] rounded-[32px] p-6 md:p-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Flag */}
              <div className="flex-shrink-0">
                <div className="bg-white rounded-[16px] p-3 shadow-sm">
                  <img 
                    src={`/flags/${franchise.country.toLowerCase().replace(' ', '-')}.png`} 
                    alt={franchise.country} 
                    className="w-10 h-10" 
                  />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-dark-1">{franchise.name}</h1>
                <p className="text-dark-2/60 mb-3">{franchise.tagline}</p>
                {/* ... rest of header */}
              </div>

              {/* Logo */}
              <div className="flex-shrink-0">
                <div className="bg-white rounded-[24px] p-6 shadow-sm">
                  <img 
                    src={franchise.logo || '/placeholder-logo.png'} 
                    alt={franchise.name} 
                    className="w-32 h-32 object-contain" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Stats */}
      <section className="py-8 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {franchise.stats?.map((stat, index) => (
              <div key={index} className="bg-[#f5f5f5] rounded-[16px] p-4 text-center">
                <p className="text-xs text-dark-2/60 mb-1">{stat.label}</p>
                <p className="text-xl font-bold text-dark-1">
                  {stat.value}
                  {stat.suffix && <span className="text-sm">{stat.suffix}</span>}
                </p>
                {stat.subtext && (
                  <p className="text-xs text-dark-2/80">{stat.subtext}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ... rest of profile sections */}
    </div>
  );
};
```

### 4. Contact Form - Working Submission

```javascript
const ContactForm = ({ franchiseId }) => {
  const [formData, setFormData] = useState({
    senderName: '',
    senderEmail: '',
    senderPhone: '',
    content: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);
      
      await api.sendMessage({
        ...formData,
        franchiseId
      });
      
      setSuccess(true);
      setFormData({ senderName: '', senderEmail: '', senderPhone: '', content: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 text-green-700 p-6 rounded-xl text-center">
        <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
        <p>The franchise owner will contact you soon.</p>
        <button 
          onClick={() => setSuccess(false)}
          className="mt-4 text-green-600 underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl">
          {error}
        </div>
      )}
      
      <input
        type="text"
        placeholder="Your Name"
        value={formData.senderName}
        onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
        required
        className="w-full px-4 py-3 rounded-xl border border-gray-200"
      />
      
      <input
        type="email"
        placeholder="Your Email"
        value={formData.senderEmail}
        onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
        required
        className="w-full px-4 py-3 rounded-xl border border-gray-200"
      />
      
      <input
        type="tel"
        placeholder="Your Phone"
        value={formData.senderPhone}
        onChange={(e) => setFormData({ ...formData, senderPhone: e.target.value })}
        className="w-full px-4 py-3 rounded-xl border border-gray-200"
      />
      
      <textarea
        placeholder="Your message..."
        value={formData.content}
        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        required
        rows="4"
        className="w-full px-4 py-3 rounded-xl border border-gray-200"
      />
      
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-dark-1 text-white py-4 rounded-xl font-semibold disabled:opacity-50"
      >
        {submitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
};
```

### 5. Environment Variables

Create `.env`:

```
VITE_API_URL=http://localhost:5000/api
```

### 6. Authentication Context

Create `src/contexts/AuthContext.jsx`:

```javascript
import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const response = await api.getMe();
      setUser(response.data.user);
    } catch {
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const response = await api.login(credentials);
    localStorage.setItem('token', response.data.token);
    setUser(response.data.user);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

## 📝 Summary of Changes

### Files to Create/Modify:

1. **New Files:**
   - `src/services/api.js` - API service
   - `src/contexts/AuthContext.jsx` - Authentication state
   - `.env` - Environment variables

2. **Modify:**
   - `GalleryPage.jsx` - Dynamic data + filters
   - `ProfilePage.jsx` - Dynamic routing + data
   - `App.jsx` - Add `:id` param to profile route
   - All forms - Add submission logic

### Key Improvements:

- ✅ Gallery shows real franchises from database
- ✅ Each card links to correct franchise profile
- ✅ Filters actually work (category, country, sort)
- ✅ Contact forms submit to backend
- ✅ Success/error feedback on all actions
- ✅ Loading states on all pages
- ✅ Authentication context for protected routes
