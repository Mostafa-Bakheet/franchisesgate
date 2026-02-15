import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, Building2, Users, MessageSquare, LogOut, CheckCircle, XCircle, UserCheck, Loader2, Eye, Trash2, Edit, Search, FileText, Plus, BarChart3, HeadphonesIcon, Ticket, ScrollText, ShoppingBag, ShoppingCart } from 'lucide-react';
import RealtimeDashboard from '../components/RealtimeDashboard';
import SmartNotifications from '../components/SmartNotifications';

import { API_BASE_URL } from '../config.js';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [franchises, setFranchises] = useState([]);
  const [users, setUsers] = useState([]);
  const [articles, setArticles] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);

  // News Ticker state
  const [tickers, setTickers] = useState([]);
  const [showTickerForm, setShowTickerForm] = useState(false);
  const [editingTicker, setEditingTicker] = useState(null);
  const [tickerForm, setTickerForm] = useState({
    content: '',
    link: '',
    bgColor: '#22C55E',
    textColor: '#FFFFFF',
    order: 0,
    isActive: true,
    startDate: '',
    endDate: ''
  });

  // Services state
  const [services, setServices] = useState([]);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    slug: '',
    description: '',
    shortDesc: '',
    price: '',
    oldPrice: '',
    icon: '',
    image: '',
    bgColor: '#FFFFFF',
    order: 0,
    isActive: true,
    features: []
  });

  // Orders state
  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);

  // Article form state
  const [articleForm, setArticleForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'دليل شامل',
    slug: '',
    readTime: '',
    featured: false,
    status: 'PUBLISHED'
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    };
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || user.role !== 'ADMIN') {
      navigate('/login');
      return;
    }

    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('token');
      
      // Load stats
      const statsRes = await fetch(`${API_BASE_URL}/api/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!statsRes.ok) throw new Error('فشل في تحميل لوحة التحكم');
      const statsData = await statsRes.json();
      setStats(statsData.data);

      // Load franchises
      const franchisesRes = await fetch(`${API_BASE_URL}/api/admin/franchises`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (franchisesRes.ok) {
        const franchisesData = await franchisesRes.json();
        setFranchises(franchisesData.data || []);
      }

      // Load users
      const usersRes = await fetch(`${API_BASE_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.data || []);
      }

      // Load tickers
      const tickersRes = await fetch(`${API_BASE_URL}/api/tickers/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (tickersRes.ok) {
        const tickersData = await tickersRes.json();
        setTickers(tickersData.data || []);
      }

      // Load services
      const servicesRes = await fetch(`${API_BASE_URL}/api/services/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (servicesRes.ok) {
        const servicesData = await servicesRes.json();
        setServices(servicesData.data || []);
      }

      // Load orders
      const ordersRes = await fetch(`${API_BASE_URL}/api/orders/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData.data || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveFranchise = async (id) => {
    if (!confirm('هل أنت متأكد من الموافقة على هذا الفرنشايز؟')) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/franchises/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: 'PUBLISHED' })
      });
      
      if (res.ok) {
        loadDashboardData();
        alert('تمت الموافقة بنجاح!');
      } else {
        const data = await res.json();
        alert(data.message || 'فشل في الموافقة');
      }
    } catch (err) {
      alert('فشل في الموافقة: ' + err.message);
    }
  };

  const handleRejectFranchise = async (id) => {
    if (!confirm('هل أنت متأكد من رفض هذا الفرنشايز؟')) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/franchises/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: 'REJECTED' })
      });
      
      if (res.ok) {
        loadDashboardData();
        alert('تم الرفض بنجاح');
      } else {
        const data = await res.json();
        alert(data.message || 'فشل في الرفض');
      }
    } catch (err) {
      alert('فشل في الرفض: ' + err.message);
    }
  };

  const handleApproveUser = async (id) => {
    if (!confirm('هل أنت متأكد من الموافقة على هذا المستخدم؟')) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: 'ACTIVE' })
      });
      
      if (res.ok) {
        loadDashboardData();
        alert('تمت الموافقة على المستخدم!');
      } else {
        const data = await res.json();
        alert(data.message || 'فشل في الموافقة');
      }
    } catch (err) {
      alert('فشل في الموافقة: ' + err.message);
    }
  };

  const handleDeleteFranchise = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا الفرنشايز؟ لا يمكن التراجع عن هذا الإجراء.')) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/franchises/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (res.ok) {
        loadDashboardData();
        alert('تم الحذف بنجاح');
      } else {
        const data = await res.json();
        alert(data.message || 'فشل في الحذف');
      }
    } catch (err) {
      alert('فشل في الحذف: ' + err.message);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء.')) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (res.ok) {
        loadDashboardData();
        alert('تم الحذف بنجاح');
      } else {
        const data = await res.json();
        alert(data.message || 'فشل في الحذف');
      }
    } catch (err) {
      alert('فشل في الحذف: ' + err.message);
    }
  };

  // Ticker handlers
  const handleSaveTicker = async () => {
    try {
      const url = editingTicker
        ? `${API_BASE_URL}/api/tickers/${editingTicker.id}`
        : `${API_BASE_URL}/api/tickers/`;
      
      const method = editingTicker ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(tickerForm)
      });
      
      if (res.ok) {
        setShowTickerForm(false);
        setEditingTicker(null);
        loadDashboardData();
        alert(editingTicker ? 'تم تحديث التيكر بنجاح' : 'تم إضافة التيكر بنجاح');
      } else {
        const data = await res.json();
        alert(data.message || 'فشل في حفظ التيكر');
      }
    } catch (err) {
      alert('فشل في حفظ التيكر: ' + err.message);
    }
  };

  const handleEditTicker = (ticker) => {
    setEditingTicker(ticker);
    setTickerForm({
      content: ticker.content,
      link: ticker.link || '',
      bgColor: ticker.bgColor,
      textColor: ticker.textColor,
      order: ticker.order,
      isActive: ticker.isActive,
      startDate: ticker.startDate ? new Date(ticker.startDate).toISOString().split('T')[0] : '',
      endDate: ticker.endDate ? new Date(ticker.endDate).toISOString().split('T')[0] : ''
    });
    setShowTickerForm(true);
  };

  const handleDeleteTicker = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا التيكر؟')) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/tickers/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (res.ok) {
        setTickers(tickers.filter(t => t.id !== id));
        alert('تم حذف التيكر بنجاح');
      } else {
        const data = await res.json();
        alert(data.message || 'فشل في حذف التيكر');
      }
    } catch (err) {
      alert('فشل في حذف التيكر: ' + err.message);
    }
  };

  // Service handlers
  const handleSaveService = async () => {
    try {
      const url = editingService
        ? `${API_BASE_URL}/api/services/${editingService.id}`
        : `${API_BASE_URL}/api/services/`;
      
      const method = editingService ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(serviceForm)
      });
      
      if (res.ok) {
        setShowServiceForm(false);
        setEditingService(null);
        loadDashboardData();
        alert(editingService ? 'تم تحديث الخدمة بنجاح' : 'تم إضافة الخدمة بنجاح');
      } else {
        const data = await res.json();
        alert(data.message || 'فشل في حفظ الخدمة');
      }
    } catch (err) {
      alert('فشل في حفظ الخدمة: ' + err.message);
    }
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setServiceForm({
      name: service.name,
      slug: service.slug,
      description: service.description || '',
      shortDesc: service.shortDesc || '',
      price: service.price.toString(),
      oldPrice: service.oldPrice ? service.oldPrice.toString() : '',
      icon: service.icon || '',
      image: service.image || '',
      bgColor: service.bgColor,
      order: service.order,
      isActive: service.isActive,
      features: service.features || []
    });
    setShowServiceForm(true);
  };

  const handleDeleteService = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذه الخدمة؟')) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/services/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (res.ok) {
        setServices(services.filter(s => s.id !== id));
        alert('تم حذف الخدمة بنجاح');
      } else {
        const data = await res.json();
        alert(data.message || 'فشل في حذف الخدمة');
      }
    } catch (err) {
      alert('فشل في حذف الخدمة: ' + err.message);
    }
  };

  // Order handlers
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      
      if (res.ok) {
        loadDashboardData();
        alert('تم تحديث حالة الطلب بنجاح');
      } else {
        const data = await res.json();
        alert(data.message || 'فشل في تحديث حالة الطلب');
      }
    } catch (err) {
      alert('فشل في تحديث حالة الطلب: ' + err.message);
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (res.ok) {
        setOrders(orders.filter(o => o.id !== id));
        alert('تم حذف الطلب بنجاح');
      } else {
        const data = await res.json();
        alert(data.message || 'فشل في حذف الطلب');
      }
    } catch (err) {
      alert('فشل في حذف الطلب: ' + err.message);
    }
  };

  const getOrderStatusColor = (status) => {
    const colors = {
      'PENDING': 'bg-orange-100 text-orange-700',
      'CONFIRMED': 'bg-blue-100 text-blue-700',
      'PROCESSING': 'bg-yellow-100 text-yellow-700',
      'COMPLETED': 'bg-green-100 text-green-700',
      'CANCELLED': 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getOrderStatusText = (status) => {
    const texts = {
      'PENDING': 'معلق',
      'CONFIRMED': 'مؤكد',
      'PROCESSING': 'قيد التنفيذ',
      'COMPLETED': 'مكتمل',
      'CANCELLED': 'ملغي'
    };
    return texts[status] || status;
  };

  // Article handlers
  const handleSaveArticle = async () => {
    try {
      const url = editingArticle 
        ? `${API_BASE_URL}/api/admin/articles/${editingArticle.id}`
        : `${API_BASE_URL}/api/admin/articles`;
      
      const method = editingArticle ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(articleForm)
      });
      
      if (res.ok) {
        setShowArticleForm(false);
        setEditingArticle(null);
        // Reload articles
        const articlesRes = await fetch(`${API_BASE_URL}/api/admin/articles`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (articlesRes.ok) {
          const articlesData = await articlesRes.json();
          setArticles(articlesData.data || []);
        }
        alert(editingArticle ? 'تم تحديث المقال بنجاح' : 'تم نشر المقال بنجاح');
      } else {
        const data = await res.json();
        alert(data.message || 'فشل في حفظ المقال');
      }
    } catch (err) {
      alert('فشل في حفظ المقال: ' + err.message);
    }
  };

  const handleEditArticle = (article) => {
    setEditingArticle(article);
    setArticleForm({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      slug: article.slug,
      readTime: article.readTime,
      featured: article.featured,
      status: article.status
    });
    setShowArticleForm(true);
  };

  const handleDeleteArticle = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا المقال؟ لا يمكن التراجع عن هذا الإجراء.')) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/articles/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (res.ok) {
        setArticles(articles.filter(a => a.id !== id));
        alert('تم حذف المقال بنجاح');
      } else {
        const data = await res.json();
        alert(data.message || 'فشل في حذف المقال');
      }
    } catch (err) {
      alert('فشل في حذف المقال: ' + err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'PUBLISHED':
      case 'ACTIVE':
        return 'bg-green-100 text-green-700';
      case 'PENDING':
        return 'bg-orange-100 text-orange-700';
      case 'DRAFT':
        return 'bg-blue-100 text-blue-700';
      case 'REJECTED':
      case 'SUSPENDED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      'PUBLISHED': 'منشور',
      'PENDING': 'معلق',
      'DRAFT': 'مسودة',
      'REJECTED': 'مرفوض',
      'ACTIVE': 'نشط',
      'SUSPENDED': 'موقوف'
    };
    return statusMap[status] || status;
  };

  const filteredFranchises = franchises.filter(f => {
    const matchesStatus = filterStatus ? f.status === filterStatus : true;
    const matchesSearch = searchTerm 
      ? f.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        f.owner?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesStatus && matchesSearch;
  });

  const pendingFranchises = franchises.filter(f => f.status === 'PENDING');
  const pendingUsers = users.filter(u => u.status === 'PENDING');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">خطأ: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-dark-1 text-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="w-6 h-6" />
              <span className="font-bold">لوحة تحكم الأدمن</span>
            </div>
            
            <div className="flex items-center gap-4">
              <SmartNotifications />
              <span className="text-sm text-white/80 hidden sm:inline">لوحة الإدارة</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-white/80 hover:text-white text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">تسجيل الخروج</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              activeTab === 'dashboard' ? 'bg-dark-1 text-white' : 'bg-white text-dark-2 hover:bg-gray-100'
            }`}
          >
            لوحة التحكم
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'analytics' ? 'bg-dark-1 text-white' : 'bg-white text-dark-2 hover:bg-gray-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Analytics Real-time
          </button>
          <button
            onClick={() => setActiveTab('franchises')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              activeTab === 'franchises' ? 'bg-dark-1 text-white' : 'bg-white text-dark-2 hover:bg-gray-100'
            }`}
          >
            الفرنشايز ({franchises.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              activeTab === 'users' ? 'bg-dark-1 text-white' : 'bg-white text-dark-2 hover:bg-gray-100'
            }`}
          >
            المستخدمين ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'chat' ? 'bg-dark-1 text-white' : 'bg-white text-dark-2 hover:bg-gray-100'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            المحادثات
          </button>
          <button
            onClick={() => setActiveTab('crm')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'crm' ? 'bg-dark-1 text-white' : 'bg-white text-dark-2 hover:bg-gray-100'
            }`}
          >
            <HeadphonesIcon className="w-4 h-4" />
            إدارة العملاء
          </button>
          <button
            onClick={() => setActiveTab('tickers')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'tickers' ? 'bg-dark-1 text-white' : 'bg-white text-dark-2 hover:bg-gray-100'
            }`}
          >
            <ScrollText className="w-4 h-4" />
            التيكر ({tickers.length})
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'services' ? 'bg-dark-1 text-white' : 'bg-white text-dark-2 hover:bg-gray-100'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            الخدمات ({services.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'orders' ? 'bg-dark-1 text-white' : 'bg-white text-dark-2 hover:bg-gray-100'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            الطلبات ({orders.length})
          </button>
        </div>

        {/* Analytics View */}
        {activeTab === 'analytics' && (
          <RealtimeDashboard />
        )}

        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">إجمالي الفرنشايز</p>
                    <p className="text-2xl font-bold text-dark-1">{stats?.franchises?.total || 0}</p>
                  </div>
                  <Building2 className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">المنشورة</p>
                    <p className="text-2xl font-bold text-green-600">{stats?.franchises?.published || 0}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">معلقة</p>
                    <p className="text-2xl font-bold text-orange-600">{stats?.franchises?.pending || 0}</p>
                  </div>
                  <Users className="w-8 h-8 text-orange-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">الرسائل</p>
                    <p className="text-2xl font-bold text-purple-600">{stats?.messages?.total || 0}</p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-purple-500" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pending Franchises */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-dark-1 mb-4">
                  الفرنشايز المعلقة ({pendingFranchises.length})
                </h2>
                
                {pendingFranchises.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">لا توجد فرنشايز معلقة</p>
                ) : (
                  <div className="space-y-3">
                    {pendingFranchises.slice(0, 5).map((franchise) => (
                      <div
                        key={franchise.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          {franchise.logo && (
                            <img
                              src={franchise.logo}
                              alt={franchise.name}
                              className="w-12 h-12 object-contain bg-white rounded-lg"
                            />
                          )}
                          <div>
                            <p className="font-medium text-dark-1">{franchise.name}</p>
                            <p className="text-xs text-gray-500">{franchise.category} • {franchise.owner?.name}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproveFranchise(franchise.id)}
                            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                            title="موافقة"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRejectFranchise(franchise.id)}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            title="رفض"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pending Users */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-dark-1 mb-4">
                  المستخدمين المعلقين ({pendingUsers.length})
                </h2>
                
                {pendingUsers.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">لا يوجد مستخدمين معلقين</p>
                ) : (
                  <div className="space-y-3">
                    {pendingUsers.slice(0, 5).map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-dark-1">{user.name}</p>
                          <p className="text-xs text-primary font-medium">{user.email}</p>
                          <p className="text-xs text-gray-500">{user.phone || 'لا يوجد هاتف'}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproveUser(user.id)}
                            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                            title="موافقة"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            title="رفض"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Franchises View */}
        {activeTab === 'franchises' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
              <h2 className="text-lg font-bold text-dark-1">جميع الفرنشايز</h2>
              <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="بحث..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                >
                  <option value="">كل الحالات</option>
                  <option value="PUBLISHED">منشور</option>
                  <option value="PENDING">معلق</option>
                  <option value="DRAFT">مسودة</option>
                  <option value="REJECTED">مرفوض</option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-right py-3 px-4 text-sm font-medium text-dark-2">الفرنشايز</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-dark-2">المالك</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-dark-2">الحالة</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-dark-2">المشاهدات</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-dark-2">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFranchises.map((franchise) => (
                    <tr key={franchise.id} className="border-b border-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {franchise.logo && (
                            <img src={franchise.logo} alt="" className="w-10 h-10 object-contain bg-gray-100 rounded" />
                          )}
                          <div>
                            <p className="font-medium text-dark-1">{franchise.name}</p>
                            <p className="text-xs text-gray-500">{franchise.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-dark-2">{franchise.owner?.name}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(franchise.status)}`}>
                          {getStatusText(franchise.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-dark-2">{franchise.views}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Link
                            to={`/profile/${franchise.id}`}
                            target="_blank"
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                            title="عرض"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            to={`/owner/edit?id=${franchise.id}`}
                            className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg"
                            title="تعديل"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          {franchise.status === 'PENDING' && (
                            <button
                              onClick={() => handleApproveFranchise(franchise.id)}
                              className="p-2 text-green-500 hover:bg-green-50 rounded-lg"
                              title="موافقة"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteFranchise(franchise.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users View */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-dark-1 mb-6">جميع المستخدمين</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-right py-3 px-4 text-sm font-medium text-dark-2">الاسم</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-dark-2">البريد الإلكتروني</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-dark-2">الدور</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-dark-2">الحالة</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-dark-2">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-50">
                      <td className="py-3 px-4 font-medium text-dark-1">{user.name}</td>
                      <td className="py-3 px-4 text-sm text-dark-2">{user.email}</td>
                      <td className="py-3 px-4 text-sm text-dark-2">
                        {user.role === 'ADMIN' ? 'مدير' : user.role === 'OWNER' ? 'مالك' : user.role}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(user.status)}`}>
                          {getStatusText(user.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          {user.status === 'PENDING' && (
                            <button
                              onClick={() => handleApproveUser(user.id)}
                              className="p-2 text-green-500 hover:bg-green-50 rounded-lg"
                              title="موافقة"
                            >
                              <UserCheck className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Blog/Articles View */}
        {activeTab === 'blog' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-dark-1">إدارة المقالات</h2>
              <button
                onClick={() => {
                  setEditingArticle(null);
                  setArticleForm({
                    title: '',
                    excerpt: '',
                    content: '',
                    category: 'دليل شامل',
                    slug: '',
                    readTime: '',
                    featured: false,
                    status: 'PUBLISHED'
                  });
                  setShowArticleForm(true);
                }}
                className="flex items-center gap-2 bg-dark-1 text-white px-4 py-2 rounded-lg hover:bg-dark-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                مقال جديد
              </button>
            </div>

            {showArticleForm && (
              <div className="mb-6 p-6 bg-gray-50 rounded-xl">
                <h3 className="font-bold text-dark-1 mb-4">
                  {editingArticle ? 'تعديل المقال' : 'مقال جديد'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-2 mb-1">العنوان</label>
                    <input
                      type="text"
                      value={articleForm.title}
                      onChange={(e) => setArticleForm({...articleForm, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      placeholder="عنوان المقال"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-2 mb-1">الرابط (Slug)</label>
                    <input
                      type="text"
                      value={articleForm.slug}
                      onChange={(e) => setArticleForm({...articleForm, slug: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      placeholder="article-url-slug"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-2 mb-1">الفئة</label>
                    <select
                      value={articleForm.category}
                      onChange={(e) => setArticleForm({...articleForm, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    >
                      <option value="دليل شامل">دليل شامل</option>
                      <option value="مقارنة">مقارنة</option>
                      <option value="قصة نجاح">قصة نجاح</option>
                      <option value="نصائح">نصائح</option>
                      <option value="أخبار">أخبار</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-2 mb-1">وقت القراءة</label>
                    <input
                      type="text"
                      value={articleForm.readTime}
                      onChange={(e) => setArticleForm({...articleForm, readTime: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      placeholder="مثال: 10 دقائق"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-dark-2 mb-1">الوصف المختصر</label>
                  <textarea
                    value={articleForm.excerpt}
                    onChange={(e) => setArticleForm({...articleForm, excerpt: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm h-20"
                    placeholder="وصف مختصر للمقال (يظهر في القوائم)"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-dark-2 mb-1">المحتوى</label>
                  <textarea
                    value={articleForm.content}
                    onChange={(e) => setArticleForm({...articleForm, content: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm h-40 font-mono"
                    placeholder="محتوى المقال (يمكن استخدام HTML)"
                  />
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={articleForm.featured}
                      onChange={(e) => setArticleForm({...articleForm, featured: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-dark-2">مقال مميز</span>
                  </label>
                  <select
                    value={articleForm.status}
                    onChange={(e) => setArticleForm({...articleForm, status: e.target.value})}
                    className="px-3 py-1 border border-gray-200 rounded-lg text-sm"
                  >
                    <option value="PUBLISHED">منشور</option>
                    <option value="DRAFT">مسودة</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveArticle}
                    className="bg-dark-1 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-dark-2"
                  >
                    {editingArticle ? 'حفظ التChanges' : 'نشر المقال'}
                  </button>
                  <button
                    onClick={() => setShowArticleForm(false)}
                    className="bg-gray-200 text-dark-1 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-right py-3 px-4 text-sm font-medium text-dark-2">المقال</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-dark-2">الفئة</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-dark-2">الحالة</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-dark-2">مميز</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-dark-2">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((article) => (
                    <tr key={article.id} className="border-b border-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-dark-1">{article.title}</p>
                          <p className="text-xs text-gray-500">{article.excerpt?.substring(0, 50)}...</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-dark-2">{article.category}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          article.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {article.status === 'PUBLISHED' ? 'منشور' : 'مسودة'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {article.featured && (
                          <span className="text-xs bg-primary/20 text-dark-1 px-2 py-1 rounded-full">نعم</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Link
                            to={`/blog/${article.slug}`}
                            target="_blank"
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                            title="عرض"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleEditArticle(article)}
                            className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg"
                            title="تعديل"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(article.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {articles.length === 0 && (
                <p className="text-center text-gray-400 py-8">لا توجد مقالات</p>
              )}
            </div>
          </div>
        )}

        {/* Chat Management View */}
        {activeTab === 'chat' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-dark-1 mb-6">إدارة المحادثات</h2>
            <p className="text-dark-2/60 text-center py-8">
              يمكنك متابعة جميع المحادثات بين المستثمرين وأصحاب الفرنشايز من هنا
            </p>
          </div>
        )}

        {/* CRM Management View */}
        {activeTab === 'crm' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-dark-1 mb-6">إدارة العملاء (CRM)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="text-sm text-blue-600 mb-1">العملاء الجدد</p>
                <p className="text-2xl font-bold text-blue-700">0</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl">
                <p className="text-sm text-green-600 mb-1">تم التحويل</p>
                <p className="text-2xl font-bold text-green-700">0</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-xl">
                <p className="text-sm text-orange-600 mb-1">في المتابعة</p>
                <p className="text-2xl font-bold text-orange-700">0</p>
              </div>
            </div>
            <p className="text-dark-2/60 text-center py-8">
              نظام إدارة العملاء والمتابعات قيد التطوير
            </p>
          </div>
        )}

        {/* News Ticker Management View */}
        {activeTab === 'tickers' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-dark-1">إدارة التيكر الإخباري</h2>
              <button
                onClick={() => {
                  setEditingTicker(null);
                  setTickerForm({
                    content: '',
                    link: '',
                    bgColor: '#22C55E',
                    textColor: '#FFFFFF',
                    order: 0,
                    isActive: true,
                    startDate: '',
                    endDate: ''
                  });
                  setShowTickerForm(true);
                }}
                className="flex items-center gap-2 bg-dark-1 text-white px-4 py-2 rounded-lg hover:bg-dark-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                تيكر جديد
              </button>
            </div>

            {showTickerForm && (
              <div className="mb-6 p-6 bg-gray-50 rounded-xl">
                <h3 className="font-bold text-dark-1 mb-4">
                  {editingTicker ? 'تعديل التيكر' : 'تيكر جديد'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-dark-2 mb-1">المحتوى</label>
                    <input
                      type="text"
                      value={tickerForm.content}
                      onChange={(e) => setTickerForm({...tickerForm, content: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      placeholder="نص التيكر الإخباري"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-2 mb-1">الرابط (اختياري)</label>
                    <input
                      type="text"
                      value={tickerForm.link}
                      onChange={(e) => setTickerForm({...tickerForm, link: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-2 mb-1">الترتيب</label>
                    <input
                      type="number"
                      value={tickerForm.order}
                      onChange={(e) => setTickerForm({...tickerForm, order: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-2 mb-1">لون الخلفية</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={tickerForm.bgColor}
                        onChange={(e) => setTickerForm({...tickerForm, bgColor: e.target.value})}
                        className="w-12 h-8 rounded cursor-pointer"
                      />
                      <span className="text-xs text-gray-500">{tickerForm.bgColor}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-2 mb-1">لون النص</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={tickerForm.textColor}
                        onChange={(e) => setTickerForm({...tickerForm, textColor: e.target.value})}
                        className="w-12 h-8 rounded cursor-pointer"
                      />
                      <span className="text-xs text-gray-500">{tickerForm.textColor}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-2 mb-1">تاريخ البداية</label>
                    <input
                      type="date"
                      value={tickerForm.startDate}
                      onChange={(e) => setTickerForm({...tickerForm, startDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-2 mb-1">تاريخ الانتهاء</label>
                    <input
                      type="date"
                      value={tickerForm.endDate}
                      onChange={(e) => setTickerForm({...tickerForm, endDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={tickerForm.isActive}
                      onChange={(e) => setTickerForm({...tickerForm, isActive: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-dark-2">نشط</span>
                  </label>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveTicker}
                    className="bg-dark-1 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-dark-2"
                  >
                    {editingTicker ? 'حفظ التعديلات' : 'إضافة التيكر'}
                  </button>
                  <button
                    onClick={() => setShowTickerForm(false)}
                    className="bg-gray-200 text-dark-1 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-right py-3 px-4 text-sm font-medium text-dark-2">المحتوى</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-dark-2">الترتيب</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-dark-2">الحالة</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-dark-2">الألوان</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-dark-2">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {tickers.map((ticker) => (
                    <tr key={ticker.id} className="border-b border-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-dark-1">{ticker.content}</p>
                          {ticker.link && (
                            <p className="text-xs text-primary">{ticker.link}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-dark-2">{ticker.order}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          ticker.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {ticker.isActive ? 'نشط' : 'غير نشط'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <span
                            className="w-6 h-6 rounded-full border"
                            style={{ backgroundColor: ticker.bgColor }}
                            title={`خلفية: ${ticker.bgColor}`}
                          />
                          <span
                            className="w-6 h-6 rounded-full border"
                            style={{ backgroundColor: ticker.textColor }}
                            title={`نص: ${ticker.textColor}`}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditTicker(ticker)}
                            className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg"
                            title="تعديل"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTicker(ticker.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {tickers.length === 0 && (
                <p className="text-center text-gray-400 py-8">لا توجد تيكرات</p>
              )}
            </div>
          </div>
        )}

        {/* Services Management View */}
        {activeTab === 'services' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-dark-1">إدارة الخدمات والأسعار</h2>
              <button
                onClick={() => {
                  setEditingService(null);
                  setServiceForm({
                    name: '',
                    slug: '',
                    description: '',
                    shortDesc: '',
                    price: '',
                    oldPrice: '',
                    icon: '',
                    image: '',
                    bgColor: '#FFFFFF',
                    order: 0,
                    isActive: true,
                    features: []
                  });
                  setShowServiceForm(true);
                }}
                className="flex items-center gap-2 bg-dark-1 text-white px-4 py-2 rounded-lg hover:bg-dark-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                خدمة جديدة
              </button>
            </div>

            {showServiceForm && (
              <div className="mb-6 p-6 bg-gray-50 rounded-xl">
                <h3 className="font-bold text-dark-1 mb-4">
                  {editingService ? 'تعديل الخدمة' : 'خدمة جديدة'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-2 mb-1">الاسم</label>
                    <input
                      type="text"
                      value={serviceForm.name}
                      onChange={(e) => setServiceForm({...serviceForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      placeholder="اسم الخدمة"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-2 mb-1">الرابط (Slug)</label>
                    <input
                      type="text"
                      value={serviceForm.slug}
                      onChange={(e) => setServiceForm({...serviceForm, slug: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      placeholder="service-name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-2 mb-1">السعر (ريال)</label>
                    <input
                      type="number"
                      value={serviceForm.price}
                      onChange={(e) => setServiceForm({...serviceForm, price: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      placeholder="1000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-2 mb-1">السعر القديم (اختياري)</label>
                    <input
                      type="number"
                      value={serviceForm.oldPrice}
                      onChange={(e) => setServiceForm({...serviceForm, oldPrice: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      placeholder="1500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-2 mb-1">الأيقونة</label>
                    <input
                      type="text"
                      value={serviceForm.icon}
                      onChange={(e) => setServiceForm({...serviceForm, icon: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      placeholder="اسم الأيقونة من Lucide"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-2 mb-1">الصورة</label>
                    <input
                      type="text"
                      value={serviceForm.image}
                      onChange={(e) => setServiceForm({...serviceForm, image: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      placeholder="رابط الصورة"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-2 mb-1">الترتيب</label>
                    <input
                      type="number"
                      value={serviceForm.order}
                      onChange={(e) => setServiceForm({...serviceForm, order: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-2 mb-1">لون الخلفية</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={serviceForm.bgColor}
                        onChange={(e) => setServiceForm({...serviceForm, bgColor: e.target.value})}
                        className="w-12 h-8 rounded cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-dark-2 mb-1">الوصف القصير</label>
                    <input
                      type="text"
                      value={serviceForm.shortDesc}
                      onChange={(e) => setServiceForm({...serviceForm, shortDesc: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      placeholder="وصف مختصر يظهر في البطاقة"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-dark-2 mb-1">الوصف الكامل</label>
                    <textarea
                      value={serviceForm.description || ''}
                      onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm h-24"
                      placeholder="وصف تفصيلي للخدمة"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={serviceForm.isActive}
                      onChange={(e) => setServiceForm({...serviceForm, isActive: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-dark-2">نشط</span>
                  </label>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveService}
                    className="bg-dark-1 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-dark-2"
                  >
                    {editingService ? 'حفظ التعديلات' : 'إضافة الخدمة'}
                  </button>
                  <button
                    onClick={() => setShowServiceForm(false)}
                    className="bg-gray-200 text-dark-1 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-right py-3 px-4 text-sm font-medium text-dark-2">الخدمة</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-dark-2">السعر</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-dark-2">الترتيب</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-dark-2">الحالة</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-dark-2">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service.id} className="border-b border-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {service.image && (
                            <img src={service.image} alt="" className="w-10 h-10 object-cover rounded" />
                          )}
                          <div>
                            <p className="font-medium text-dark-1">{service.name}</p>
                            <p className="text-xs text-gray-500">{service.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-dark-2">
                        <div>
                          <span className="font-medium">{service.price} ر.س</span>
                          {service.oldPrice && (
                            <span className="text-xs text-gray-400 line-through block">{service.oldPrice} ر.س</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-dark-2">{service.order}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          service.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {service.isActive ? 'نشط' : 'غير نشط'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditService(service)}
                            className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg"
                            title="تعديل"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteService(service.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {services.length === 0 && (
                <p className="text-center text-gray-400 py-8">لا توجد خدمات</p>
              )}
            </div>
          </div>
        )}

        {/* Orders Management View */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-dark-1">إدارة الطلبات</h2>
              <select
                value={orderFilter}
                onChange={(e) => setOrderFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                <option value="">كل الحالات</option>
                <option value="PENDING">معلقة</option>
                <option value="CONFIRMED">مؤكدة</option>
                <option value="PROCESSING">قيد التنفيذ</option>
                <option value="COMPLETED">مكتملة</option>
                <option value="CANCELLED">ملغية</option>
              </select>
            </div>

            {showOrderDetail && selectedOrder && (
              <div className="mb-6 p-6 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-dark-1">تفاصيل الطلب</h3>
                  <button
                    onClick={() => setShowOrderDetail(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">العميل</p>
                    <p className="font-medium">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                    <p className="font-medium">{selectedOrder.customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">الهاتف</p>
                    <p className="font-medium">{selectedOrder.customerPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">الشركة</p>
                    <p className="font-medium">{selectedOrder.customerCompany || '-'}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">الخدمات المطلوبة</p>
                  <div className="space-y-2">
                    {selectedOrder.items?.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-3 bg-white rounded-lg">
                        <span className="font-medium">{item.service?.name}</span>
                        <div className="text-left">
                          <span className="text-sm">{item.quantity} × {item.price} ر.س</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t">
                  <p className="text-lg font-bold">الإجمالي: {selectedOrder.totalAmount} ر.س</p>
                  <div className="flex gap-2">
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    >
                      <option value="PENDING">معلق</option>
                      <option value="CONFIRMED">مؤكد</option>
                      <option value="PROCESSING">قيد التنفيذ</option>
                      <option value="COMPLETED">مكتمل</option>
                      <option value="CANCELLED">ملغي</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-right py-3 px-4 text-sm font-medium text-dark-2">رقم الطلب</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-dark-2">العميل</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-dark-2">الخدمات</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-dark-2">المبلغ</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-dark-2">الحالة</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-dark-2">التاريخ</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-dark-2">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {orders
                    .filter(order => !orderFilter || order.status === orderFilter)
                    .map((order) => (
                    <tr key={order.id} className="border-b border-gray-50">
                      <td className="py-3 px-4 font-medium text-dark-1">#{order.id.slice(-6)}</td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-sm">{order.customerName}</p>
                          <p className="text-xs text-gray-500">{order.customerEmail}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-dark-2">
                        {order.items?.length} خدمة
                      </td>
                      <td className="py-3 px-4 text-sm font-medium">{order.totalAmount} ر.س</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getOrderStatusColor(order.status)}`}>
                          {getOrderStatusText(order.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('ar-SA')}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowOrderDetail(true);
                            }}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                            title="عرض التفاصيل"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && (
                <p className="text-center text-gray-400 py-8">لا توجد طلبات</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
