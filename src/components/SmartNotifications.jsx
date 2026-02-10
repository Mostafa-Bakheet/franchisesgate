import { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  MessageSquare, 
  Calendar,
  TrendingUp,
  UserPlus,
  Settings,
  Trash2,
  Check
} from 'lucide-react';

const SmartNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [filter, setFilter] = useState('all'); // all, unread, important
  const [settings, setSettings] = useState({
    newInquiry: true,
    newUser: true,
    franchiseApproved: true,
    consultationBooked: true,
    dailySummary: false,
    weeklyReport: true
  });

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/admin/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.data || []);
        setUnreadCount(data.data?.filter(n => !n.read).length || 0);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/admin/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        setNotifications(prev => prev.map(n => 
          n.id === id ? { ...n, read: true } : n
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/admin/notifications/read-all', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  // Delete notification
  const deleteNotification = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/admin/notifications/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  // Update notification settings
  const updateSettings = async (key, value) => {
    try {
      const token = localStorage.getItem('token');
      const newSettings = { ...settings, [key]: value };
      
      const res = await fetch('http://localhost:5000/api/admin/notification-settings', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(newSettings)
      });
      
      if (res.ok) {
        setSettings(newSettings);
      }
    } catch (err) {
      console.error('Failed to update settings:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'inquiry': return MessageSquare;
      case 'consultation': return Calendar;
      case 'user': return UserPlus;
      case 'franchise': return TrendingUp;
      case 'alert': return AlertCircle;
      default: return Info;
    }
  };

  const getColor = (type, priority) => {
    if (priority === 'high') return 'bg-red-500';
    switch (type) {
      case 'inquiry': return 'bg-blue-500';
      case 'consultation': return 'bg-green-500';
      case 'user': return 'bg-purple-500';
      case 'franchise': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'important') return n.priority === 'high';
    return true;
  });

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white/80 hover:text-white transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-dark-1 text-white px-4 py-3 flex items-center justify-between">
            <h3 className="font-bold flex items-center gap-2">
              <Bell className="w-5 h-5" />
              الإشعارات
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {unreadCount} جديد
                </span>
              )}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                title="الإعدادات"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="bg-gray-50 p-4 border-b">
              <h4 className="font-medium text-dark-1 mb-3 text-sm">إعدادات الإشعارات</h4>
              <div className="space-y-2">
                {Object.entries(settings).map(([key, value]) => (
                  <label key={key} className="flex items-center gap-2 text-sm text-dark-2">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => updateSettings(key, e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span>
                      {key === 'newInquiry' && 'استفسار جديد'}
                      {key === 'newUser' && 'مستخدم جديد'}
                      {key === 'franchiseApproved' && 'موافقة على فرنشايز'}
                      {key === 'consultationBooked' && 'حجز استشارة'}
                      {key === 'dailySummary' && 'ملخص يومي'}
                      {key === 'weeklyReport' && 'تقرير أسبوعي'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="flex gap-1 p-2 bg-gray-50 border-b">
            {[
              { key: 'all', label: 'الكل' },
              { key: 'unread', label: 'غير المقروء' },
              { key: 'important', label: 'مهم' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  filter === key 
                    ? 'bg-dark-1 text-white' 
                    : 'bg-white text-dark-2 hover:bg-gray-100'
                }`}
              >
                {label}
              </button>
            ))}
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="mr-auto px-3 py-1 text-xs text-green-600 hover:bg-green-50 rounded-full transition-colors flex items-center gap-1"
              >
                <Check className="w-3 h-3" />
                تحديد الكل كمقروء
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>لا توجد إشعارات</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => {
                const Icon = getIcon(notification.type);
                const colorClass = getColor(notification.type, notification.priority);
                
                return (
                  <div
                    key={notification.id}
                    className={`p-4 border-b hover:bg-gray-50 transition-colors ${
                      !notification.read ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className={`w-10 h-10 ${colorClass} rounded-full flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-medium text-dark-1 text-sm">{notification.title}</h4>
                          <span className="text-xs text-gray-400 whitespace-nowrap">{notification.time}</span>
                        </div>
                        <p className="text-sm text-dark-2/70 mt-1 line-clamp-2">{notification.message}</p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                            >
                              <CheckCircle className="w-3 h-3" />
                              تحديد كمقروء
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            حذف
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-gray-50 border-t text-center">
            <button className="text-sm text-primary hover:underline">
              عرض كل الإشعارات
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartNotifications;
