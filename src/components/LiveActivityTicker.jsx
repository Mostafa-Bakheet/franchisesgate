import { useState, useEffect } from 'react';
import { Activity, Users, Eye, MessageCircle, TrendingUp, Clock, MapPin, Zap } from 'lucide-react';

const LiveActivityTicker = ({ externalOpen, onClose }) => {
  const [activities, setActivities] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isVisible, setIsVisible] = useState(true);

  // Sample activity data generator
  const generateActivity = () => {
    const names = ['محمد', 'أحمد', 'فهد', 'سعود', 'عبدالله', 'خالد', 'سلطان', 'ماجد', 'نواف', 'فيصل'];
    const cities = ['الرياض', 'جدة', 'الدمام', 'أبها', 'تبوك', 'القصيم', 'المدينة', 'مكة'];
    const franchises = ['كوفي لاونا', 'مطبخ زاد', 'صيدلية الصحة', 'محل عالمي', 'فرنشايز النخبة'];
    const actions = [
      { text: 'استعرض {franchise}', icon: Eye },
      { text: 'طلب معلومات عن {franchise}', icon: MessageCircle },
      { text: 'سجل اهتمامه في الاستثمار', icon: TrendingUp },
      { text: 'قارن بين الفرنشايزات', icon: Activity },
    ];

    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    const randomFranchise = franchises[Math.floor(Math.random() * franchises.length)];

    return {
      id: Date.now(),
      name: randomName,
      city: randomCity,
      action: randomAction.text.replace('{franchise}', randomFranchise),
      Icon: randomAction.icon,
      time: new Date(),
    };
  };

  // Simulate live stats
  const liveStats = {
    onlineNow: Math.floor(Math.random() * 20) + 8,
    inquiriesToday: Math.floor(Math.random() * 50) + 30,
    newFranchises: 3,
    totalViews: 1247,
  };

  // Handle external control
  useEffect(() => {
    if (externalOpen) {
      setIsVisible(true);
    }
  }, [externalOpen]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  useEffect(() => {
    // Initialize with some activities
    const initialActivities = Array.from({ length: 5 }, (_, i) => ({
      ...generateActivity(),
      time: new Date(Date.now() - i * 60000),
    }));
    setActivities(initialActivities);

    // Add new activity every 15-30 seconds
    const activityInterval = setInterval(() => {
      const newActivity = generateActivity();
      setActivities(prev => [newActivity, ...prev.slice(0, 4)]);
    }, Math.random() * 15000 + 15000);

    // Update time
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => {
      clearInterval(activityInterval);
      clearInterval(timeInterval);
    };
  }, []);

  const formatTime = (date) => {
    const diff = Math.floor((currentTime - date) / 1000 / 60);
    if (diff < 1) return 'الآن';
    if (diff === 1) return 'منذ دقيقة';
    if (diff < 60) return `منذ ${diff} دقائق`;
    return `منذ ${Math.floor(diff / 60)} ساعة`;
  };

  if (!isVisible) {
    // Don't render anything when closed (controlled by FloatingActionMenu)
    return null;
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-dark-1 to-dark-2 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
          </div>
          <span className="text-white font-bold text-sm">النشاط الحي</span>
        </div>
        <button
          onClick={handleClose}
          className="text-white/70 hover:text-white text-lg leading-none"
        >
          ×
        </button>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 border-b">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-500" />
          <span className="text-xs text-dark-2">
            <span className="font-bold text-dark-1">{liveStats.onlineNow}</span> متصفح الآن
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-green-500" />
          <span className="text-xs text-dark-2">
            <span className="font-bold text-dark-1">+{liveStats.inquiriesToday}</span> استفسار اليوم
          </span>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="p-3 space-y-3 max-h-64 overflow-y-auto">
        {activities.map((activity) => {
          const IconComponent = activity.Icon;
          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors animate-fadeIn"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/40 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-dark-1 font-bold text-sm">
                  {activity.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-dark-1 leading-relaxed">
                  <span className="font-bold">{activity.name}</span> من{' '}
                  <span className="text-primary">{activity.city}</span>{' '}
                  {activity.action}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <IconComponent className="w-3 h-3 text-dark-2/50" />
                  <span className="text-xs text-dark-2/60">{formatTime(activity.time)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Stats */}
      <div className="px-4 py-2 bg-primary/10 border-t flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-dark-2">
          <TrendingUp className="w-3 h-3 text-green-500" />
          <span>{liveStats.newFranchises} فرنشايز جديدة هذا الأسبوع</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-dark-2/60">
          <Eye className="w-3 h-3" />
          <span>{liveStats.totalViews.toLocaleString()} مشاهدة</span>
        </div>
      </div>
    </div>
  );
};

export default LiveActivityTicker;
