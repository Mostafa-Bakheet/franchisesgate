import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, MessageSquare, Eye, LogOut, Edit, Send, Image, Loader2, ChevronRight, Home, LayoutDashboard, Users, BarChart3, Phone, Calendar, CheckCircle, AlertCircle, TrendingUp, RefreshCw, Search, Filter, X } from 'lucide-react';
import ChatCenter from '../components/ChatCenter';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [franchise, setFranchise] = useState(null);
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({ total: 0, unread: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Chat & CRM States
  const [activeTab, setActiveTab] = useState('overview');
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [chatStats, setChatStats] = useState(null);
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    };
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('token');
      const userRes = await fetch('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!userRes.ok) {
        if (userRes.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        throw new Error('فشل في تحميل بيانات المستخدم');
      }
      
      const userData = await userRes.json();
      setUser(userData.data.user);
      setFranchise(userData.data.user.franchise);

      const messagesRes = await fetch('http://localhost:5000/api/messages/my-messages?limit=5', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (messagesRes.ok) {
        const messagesData = await messagesRes.json();
        setMessages(messagesData.data || []);
      }

      const statsRes = await fetch('http://localhost:5000/api/messages/my-messages/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForApproval = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/franchises/submit', {
        method: 'POST',
        headers: getAuthHeaders()
      });
      
      if (res.ok) {
        alert('تم إرسال الفرنشايز للموافقة!');
        loadDashboardData();
      } else {
        const data = await res.json();
        alert(data.message || 'فشل في الإرسال');
      }
    } catch (err) {
      alert('فشل في الإرسال: ' + err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Chat Functions
  const loadChatData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const [statsRes, convRes] = await Promise.all([
        fetch('http://localhost:5000/api/chat/stats', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/chat/my-conversations', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setChatStats(statsData.data);
      }

      if (convRes.ok) {
        const convData = await convRes.json();
        setConversations(convData.data || []);
      }
    } catch (err) {
      console.error('Error loading chat data:', err);
    }
  };

  const handleSendMessage = async (conversationId, content) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/chat/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content })
      });

      if (res.ok) {
        const convRes = await fetch(`http://localhost:5000/api/chat/conversations/${conversationId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (convRes.ok) {
          const data = await convRes.json();
          setActiveConversation(data.data.conversation);
          loadChatData();
        }
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleCloseConversation = async (conversationId) => {
    if (!confirm('هل أنت متأكد من إغلاق هذه المحادثة؟')) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/chat/conversations/${conversationId}/close`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        loadChatData();
        setActiveConversation(null);
      }
    } catch (err) {
      console.error('Error closing conversation:', err);
    }
  };

  const handleAddNote = async (conversationId, content) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/chat/conversations/${conversationId}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ content, noteType: 'internal' })
      });

      const convRes = await fetch(`http://localhost:5000/api/chat/conversations/${conversationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (convRes.ok) {
        const data = await convRes.json();
        setActiveConversation(data.data.conversation);
      }
    } catch (err) {
      console.error('Error adding note:', err);
    }
  };

  // Leads Functions
  const loadLeads = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/crm/leads', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLeads(data.data || []);
      }
    } catch (err) {
      console.error('Error loading leads:', err);
    }
  };

  // Load data when tab changes
  useEffect(() => {
    if (activeTab === 'chat') {
      loadChatData();
    } else if (activeTab === 'leads') {
      loadLeads();
    }
  }, [activeTab]);

  const getStatusText = (status) => {
    const statusMap = {
      'PUBLISHED': 'منشور',
      'PENDING': 'معلق',
      'DRAFT': 'مسودة',
      'REJECTED': 'مرفوض',
      'ACTIVE': 'نشط'
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-light-1 flex items-center justify-center">
        <div className="text-red-500">خطأ: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-1" dir="rtl">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
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
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-dark-2 hidden sm:inline">مرحباً، {user?.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-500 hover:text-red-600 text-sm"
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
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'overview' ? 'bg-dark-1 text-white' : 'bg-white text-dark-2 hover:bg-gray-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            نظرة عامة
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'chat' ? 'bg-dark-1 text-white' : 'bg-white text-dark-2 hover:bg-gray-100'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            المحادثات
            {chatStats?.unread > 0 && (
              <span className="bg-primary text-dark-1 text-xs px-2 py-0.5 rounded-full">
                {chatStats.unread}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'leads' ? 'bg-dark-1 text-white' : 'bg-white text-dark-2 hover:bg-gray-100'
            }`}
          >
            <Users className="w-4 h-4" />
            العملاء المحتملين
          </button>
        </div>

        {activeTab === 'overview' && (
          <>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-dark-2/60 mb-1">المشاهدات</p>
                <p className="text-xl font-bold text-dark-1">{franchise?.views || 0}</p>
              </div>
              <Eye className="w-7 h-7 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-dark-2/60 mb-1">الرسائل</p>
                <p className="text-xl font-bold text-dark-1">{stats?.total || 0}</p>
              </div>
              <MessageSquare className="w-7 h-7 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-dark-2/60 mb-1">غير مقروء</p>
                <p className="text-xl font-bold text-dark-1">{stats?.unread || 0}</p>
              </div>
              <MessageSquare className="w-7 h-7 text-orange-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-dark-2/60 mb-1">الحالة</p>
                <p className="text-sm font-bold text-dark-1">{getStatusText(franchise?.status)}</p>
              </div>
              <Building2 className="w-7 h-7 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Franchise Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-dark-1">فرنشايزي</h2>
                <div className="flex gap-2">
                  {franchise?.status === 'DRAFT' && (
                    <button
                      onClick={handleSubmitForApproval}
                      className="flex items-center gap-2 bg-green-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      إرسال للموافقة
                    </button>
                  )}
                  <button
                    onClick={() => navigate('/owner/edit')}
                    className="flex items-center gap-2 bg-dark-1 text-white px-3 py-2 rounded-lg text-sm hover:bg-dark-2 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    تعديل
                  </button>
                </div>
              </div>

              {franchise ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    {franchise.logo && (
                      <img
                        src={franchise.logo}
                        alt={franchise.name}
                        className="w-16 h-16 object-contain bg-gray-100 rounded-xl"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-dark-1">{franchise.name}</h3>
                      <p className="text-dark-2/60 text-sm">{franchise.tagline || franchise.category}</p>
                      <span className="inline-block mt-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {franchise.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-dark-2/40 mb-1">الدولة</p>
                      <p className="text-sm text-dark-1">{franchise.country}</p>
                    </div>
                    <div>
                      <p className="text-xs text-dark-2/40 mb-1">المدينة</p>
                      <p className="text-sm text-dark-1">{franchise.city}</p>
                    </div>
                  </div>

                  {franchise.investment && (
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-xs text-dark-2/40 mb-1">نطاق الاستثمار</p>
                      <p className="text-sm text-dark-1">
                        ${franchise.investment.minInvestment?.toLocaleString()} - ${franchise.investment.maxInvestment?.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-dark-2/60 mb-4">ليس لديك فرنشايز بعد</p>
                  <button
                    onClick={() => navigate('/owner/edit')}
                    className="bg-primary text-white px-6 py-3 rounded-xl font-semibold"
                  >
                    إنشاء فرنشايز
                  </button>
                </div>
              )}
            </div>

            {/* Gallery Preview */}
            {franchise?.gallery && franchise.gallery.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-dark-1">المعرض</h3>
                  <button 
                    onClick={() => navigate('/owner/gallery')}
                    className="text-sm text-primary hover:underline"
                  >
                    إدارة
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {franchise.gallery.slice(0, 4).map((img, i) => (
                    <img
                      key={i}
                      src={img.url}
                      alt=""
                      className="w-full h-16 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-dark-1 mb-4">إجراءات سريعة</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => navigate('/owner/edit')}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-right"
                >
                  <Edit className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm text-dark-1">تعديل الملف</p>
                    <p className="text-xs text-dark-2/60">تحديث معلومات الفرنشايز</p>
                  </div>
                  <ChevronRight className="w-4 h-4 mr-auto text-dark-2/40 rotate-180" />
                </button>
                
                <button
                  onClick={() => navigate('/owner/messages')}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-right"
                >
                  <MessageSquare className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium text-sm text-dark-1">الرسائل</p>
                    <p className="text-xs text-dark-2/60">عرض الاستفسارات</p>
                  </div>
                  <ChevronRight className="w-4 h-4 mr-auto text-dark-2/40 rotate-180" />
                  {stats.unread > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {stats.unread}
                    </span>
                  )}
                </button>
                
                <button
                  onClick={() => navigate('/owner/gallery')}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-right"
                >
                  <Image className="w-5 h-5 text-purple-500" />
                  <div>
                    <p className="font-medium text-sm text-dark-1">المعرض</p>
                    <p className="text-xs text-dark-2/60">إدارة الصور</p>
                  </div>
                  <ChevronRight className="w-4 h-4 mr-auto text-dark-2/40 rotate-180" />
                </button>
                
                <Link
                  to="/"
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-right"
                >
                  <Home className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-sm text-dark-1">العودة للرئيسية</p>
                    <p className="text-xs text-dark-2/60">العودة للموقع</p>
                  </div>
                  <ChevronRight className="w-4 h-4 mr-auto text-dark-2/40 rotate-180" />
                </Link>
              </div>
            </div>
          </div>

          {/* Messages Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-dark-1">الرسائل الأخيرة</h3>
                <button 
                  onClick={() => navigate('/owner/messages')}
                  className="text-sm text-primary hover:underline"
                >
                  عرض الكل
                </button>
              </div>

              {messages.length === 0 ? (
                <p className="text-dark-2/40 text-sm text-center py-8">لا توجد رسائل بعد</p>
              ) : (
                <div className="space-y-3">
                  {messages.slice(0, 5).map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-xl ${msg.status === 'UNREAD' ? 'bg-orange-50 border border-orange-100' : 'bg-gray-50'}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm text-dark-1">{msg.senderName}</span>
                        {msg.status === 'UNREAD' && (
                          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-xs text-dark-2/60 line-clamp-2">{msg.content}</p>
                      <p className="text-xs text-dark-2/40 mt-1">
                        {new Date(msg.createdAt).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Status Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-dark-1 mb-4">حالة الحساب</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-dark-2">حالة الفرنشايز</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    franchise?.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' :
                    franchise?.status === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                    franchise?.status === 'DRAFT' ? 'bg-gray-100 text-gray-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {getStatusText(franchise?.status) || 'غير متوفر'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-dark-2">حالة المستخدم</span>
                  <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-100 text-green-700">
                    {getStatusText(user?.status) || 'غير متوفر'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        </>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="h-[calc(100vh-300px)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="بحث في المحادثات..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10 pl-4 py-2 border border-gray-200 rounded-lg text-sm w-64"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                >
                  <option value="all">كل الحالات</option>
                  <option value="ACTIVE">نشطة</option>
                  <option value="CLOSED">مغلقة</option>
                </select>
              </div>
              <button 
                onClick={loadChatData}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <RefreshCw className="w-5 h-5 text-dark-2" />
              </button>
            </div>
            
            <ChatCenter
              conversations={conversations.filter(c => {
                const matchesSearch = searchTerm 
                  ? c.participantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    c.franchise?.name?.toLowerCase().includes(searchTerm.toLowerCase())
                  : true;
                const matchesStatus = filterStatus === 'all' ? true : c.status === filterStatus;
                return matchesSearch && matchesStatus;
              })}
              activeConversation={activeConversation}
              currentUser={user}
              userRole="FRANCHISE_OWNER"
              onSelectConversation={setActiveConversation}
              onSendMessage={handleSendMessage}
              onCloseConversation={handleCloseConversation}
              onAddNote={handleAddNote}
              showNotes={true}
              allowClose={true}
            />
          </div>
        )}

        {/* Leads Tab */}
        {activeTab === 'leads' && (
          <OwnerLeadsView leads={leads} />
        )}
      </div>
    </div>
  );
};

const OwnerLeadsView = ({ leads }) => {
  const getStatusColor = (status) => {
    const colors = {
      'NEW': 'bg-blue-100 text-blue-700',
      'CONTACTED': 'bg-yellow-100 text-yellow-700',
      'QUALIFIED': 'bg-purple-100 text-purple-700',
      'PROPOSAL': 'bg-orange-100 text-orange-700',
      'NEGOTIATION': 'bg-pink-100 text-pink-700',
      'WON': 'bg-green-100 text-green-700',
      'LOST': 'bg-red-100 text-red-700',
      'COLD': 'bg-gray-100 text-gray-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getStatusText = (status) => {
    const texts = {
      'NEW': 'جديد',
      'CONTACTED': 'تم التواصل',
      'QUALIFIED': 'مؤهل',
      'PROPOSAL': 'عرض مقدم',
      'NEGOTIATION': 'في التفاوض',
      'WON': 'تم التحويل',
      'LOST': 'فُقد',
      'COLD': 'بارد'
    };
    return texts[status] || status;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-dark-1">العملاء المحتملين</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-right py-3 px-4 text-sm font-medium text-dark-2">العميل</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-dark-2">الفرنشايز</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-dark-2">الحالة</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-dark-2">المصدر</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-dark-2">تاريخ التسجيل</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div>
                    <p className="font-medium text-dark-1">{lead.name}</p>
                    <p className="text-sm text-dark-2/60">{lead.email || lead.phone}</p>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-dark-2">{lead.franchise?.name || '-'}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(lead.status)}`}>
                    {getStatusText(lead.status)}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-dark-2/60">{lead.source}</td>
                <td className="py-3 px-4 text-sm text-dark-2/60">
                  {new Date(lead.createdAt).toLocaleDateString('ar-SA')}
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-dark-2/40">
                  لا يوجد عملاء محتملين
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OwnerDashboard;
