import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Mail, MailOpen, Archive, RefreshCw, MessageSquare } from 'lucide-react';
import { API_BASE_URL } from '../config.js';

const MessageInbox = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    loadMessages();
  }, [navigate, filter]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      let url = `${API_BASE_URL}/api/messages/my-messages`;
      if (filter !== 'ALL') {
        url += `?status=${filter}`;
      }
      
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        throw new Error('فشل في تحميل الرسائل');
      }

      const data = await response.json();
      setMessages(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/messages/my-messages/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'READ' })
      });

      if (response.ok) {
        loadMessages();
      }
    } catch (err) {
      console.error('فشل في تحديث الحالة:', err);
    }
  };

  const archiveMessage = async (id) => {
    if (!confirm('هل أنت متأكد من أرشفة هذه الرسالة؟')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/messages/my-messages/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        setSelectedMessage(null);
        loadMessages();
      }
    } catch (err) {
      console.error('فشل في الأرشفة:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-1" dir="rtl">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/owner/dashboard" className="text-dark-2 hover:text-dark-1">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-xl font-bold text-dark-1 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                صندوق الرسائل
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={loadMessages}
                className="p-2 text-dark-2 hover:text-dark-1 hover:bg-gray-100 rounded-lg"
                title="تحديث"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
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
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['ALL', 'UNREAD', 'READ', 'ARCHIVED'].map((status) => (
            <button
              key={status}
              onClick={() => {
                setFilter(status);
                setSelectedMessage(null);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                filter === status 
                  ? 'bg-dark-1 text-white' 
                  : 'bg-white text-dark-2 hover:bg-gray-50'
              }`}
            >
              {status === 'ALL' && 'جميع الرسائل'}
              {status === 'UNREAD' && 'غير مقروء'}
              {status === 'READ' && 'مقروء'}
              {status === 'ARCHIVED' && 'مؤرشف'}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {messages.length === 0 ? (
                <div className="p-8 text-center text-dark-2/60">
                  <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>لا توجد رسائل</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                  {messages.map((message) => (
                    <button
                      key={message.id}
                      onClick={() => {
                        setSelectedMessage(message);
                        if (message.status === 'UNREAD') {
                          markAsRead(message.id);
                        }
                      }}
                      className={`w-full p-4 text-right hover:bg-gray-50 transition-colors ${
                        selectedMessage?.id === message.id ? 'bg-primary/5' : ''
                      } ${message.status === 'UNREAD' ? 'bg-orange-50/50' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 ${message.status === 'UNREAD' ? 'text-orange-500' : 'text-gray-400'}`}>
                          {message.status === 'UNREAD' ? <Mail className="w-5 h-5" /> : <MailOpen className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-medium text-dark-1 truncate">{message.senderName}</p>
                            {message.status === 'UNREAD' && (
                              <span className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0"></span>
                            )}
                          </div>
                          <p className="text-sm text-dark-2/60 line-clamp-2 mt-1">{message.content}</p>
                          <p className="text-xs text-dark-2/40 mt-2">{formatDate(message.createdAt)}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedMessage ? (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-dark-1 mb-1">
                      رسالة من {selectedMessage.senderName}
                    </h2>
                    <p className="text-sm text-dark-2/60">{formatDate(selectedMessage.createdAt)}</p>
                  </div>
                  <div className="flex gap-2">
                    {selectedMessage.status !== 'ARCHIVED' && (
                      <button
                        onClick={() => archiveMessage(selectedMessage.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        title="أرشفة"
                      >
                        <Archive className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                    <div>
                      <p className="text-xs text-dark-2/60 mb-1">البريد الإلكتروني</p>
                      <p className="text-sm text-dark-1">{selectedMessage.senderEmail}</p>
                    </div>
                    {selectedMessage.senderPhone && (
                      <div>
                        <p className="text-xs text-dark-2/60 mb-1">الهاتف</p>
                        <p className="text-sm text-dark-1">{selectedMessage.senderPhone}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-xs text-dark-2/60 mb-2">الرسالة</p>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <p className="text-dark-1 whitespace-pre-wrap">{selectedMessage.content}</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <a
                      href={`mailto:${selectedMessage.senderEmail}?subject=رد: استفسار عن الفرنشايز`}
                      className="flex-1 bg-dark-1 text-white py-3 rounded-xl text-center font-medium hover:bg-dark-2 transition-colors"
                    >
                      الرد عبر البريد
                    </a>
                    {selectedMessage.senderPhone && (
                      <a
                        href={`tel:${selectedMessage.senderPhone}`}
                        className="px-6 py-3 border border-dark-1 text-dark-1 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                      >
                        اتصال
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <MailOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-dark-2/60">اختر رسالة لعرض التفاصيل</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageInbox;
