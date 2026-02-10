import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, Building2, Users, MessageSquare, LogOut, CheckCircle, XCircle, UserCheck, Loader2, Eye, Trash2, Edit, Search, FileText, Plus, BarChart3, HeadphonesIcon, Ticket } from 'lucide-react';
import RealtimeDashboard from '../components/RealtimeDashboard';
import SmartNotifications from '../components/SmartNotifications';

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
      const statsRes = await fetch('http://localhost:5000/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!statsRes.ok) throw new Error('فشل في تحميل لوحة التحكم');
      const statsData = await statsRes.json();
      setStats(statsData.data);

      // Load franchises
      const franchisesRes = await fetch('http://localhost:5000/api/admin/franchises', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (franchisesRes.ok) {
        const franchisesData = await franchisesRes.json();
        setFranchises(franchisesData.data || []);
      }

      // Load users
      const usersRes = await fetch('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.data || []);
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
      const res = await fetch(`http://localhost:5000/api/admin/franchises/${id}/status`, {
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
      const res = await fetch(`http://localhost:5000/api/admin/franchises/${id}/status`, {
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
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}/status`, {
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
      const res = await fetch(`http://localhost:5000/api/admin/franchises/${id}`, {
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
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
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

  // Article handlers
  const handleSaveArticle = async () => {
    try {
      const url = editingArticle 
        ? `http://localhost:5000/api/admin/articles/${editingArticle.id}`
        : 'http://localhost:5000/api/admin/articles';
      
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
        const articlesRes = await fetch('http://localhost:5000/api/admin/articles', {
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
      const res = await fetch(`http://localhost:5000/api/admin/articles/${id}`, {
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
      </div>
    </div>
  );
};

export default AdminDashboard;
