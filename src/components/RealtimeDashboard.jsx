import { useState, useEffect } from 'react';
import { 
  Users, 
  Eye, 
  MessageSquare, 
  Calendar,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Download,
  MapPin,
  Target,
  Zap,
  Loader2,
  Activity,
  AlertCircle,
  Share2,
  Mail
} from 'lucide-react';

// Map icon names to actual components
const iconMap = {
  Eye, Users, MessageSquare, Calendar, Zap, Target, MapPin, Share2, Mail, Activity
};

const getIcon = (iconName) => iconMap[iconName] || Eye;

const RealtimeDashboard = () => {
  const [timeRange, setTimeRange] = useState('today');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  const [stats, setStats] = useState({
    visitors: { current: 0, total: 0, change: 0, trend: 'up' },
    pageViews: { current: 0, total: 0, change: 0, trend: 'up' },
    inquiries: { current: 0, total: 0, change: 0, trend: 'up' },
    consultations: { current: 0, total: 0, change: 0, trend: 'up' }
  });
  const [activities, setActivities] = useState([]);
  const [topFranchises, setTopFranchises] = useState([]);
  const [trafficSources, setTrafficSources] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);

  const API_BASE_URL = 'http://localhost:5000/api/admin';

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError('لا يوجد token - يرجى تسجيل الدخول');
        setIsLoading(false);
        return;
      }
      
      const headers = { Authorization: `Bearer ${token}` };
      
      // Fetch all data in parallel with individual error handling
      const [statsRes, activitiesRes, topRes, trafficRes, hourlyRes] = await Promise.all([
        fetch(`${API_BASE_URL}/analytics?range=${timeRange}`, { headers }).catch(() => null),
        fetch(`${API_BASE_URL}/analytics/activities?limit=10`, { headers }).catch(() => null),
        fetch(`${API_BASE_URL}/analytics/top-franchises?limit=5`, { headers }).catch(() => null),
        fetch(`${API_BASE_URL}/analytics/traffic-sources?range=${timeRange}`, { headers }).catch(() => null),
        fetch(`${API_BASE_URL}/analytics/hourly-traffic?range=${timeRange}`, { headers }).catch(() => null)
      ]);
      
      // Process stats
      if (statsRes?.ok) {
        const statsData = await statsRes.json().catch(() => ({}));
        const safeStats = {
          visitors: { current: 0, total: 0, change: 0, trend: 'up', ...(statsData?.data?.visitors || {}) },
          pageViews: { current: 0, total: 0, change: 0, trend: 'up', ...(statsData?.data?.pageViews || {}) },
          inquiries: { current: 0, total: 0, change: 0, trend: 'up', ...(statsData?.data?.inquiries || {}) },
          consultations: { current: 0, total: 0, change: 0, trend: 'up', ...(statsData?.data?.consultations || {}) }
        };
        setStats(safeStats);
      }
      
      // Process activities
      if (activitiesRes?.ok) {
        const activitiesData = await activitiesRes.json().catch(() => ({}));
        setActivities(Array.isArray(activitiesData?.data) ? activitiesData.data : []);
      }
      
      // Process top franchises
      if (topRes?.ok) {
        const topData = await topRes.json().catch(() => ({}));
        setTopFranchises(Array.isArray(topData?.data) ? topData.data : []);
      }
      
      // Process traffic sources
      if (trafficRes?.ok) {
        const trafficData = await trafficRes.json().catch(() => ({}));
        setTrafficSources(Array.isArray(trafficData?.data) ? trafficData.data : []);
      } else {
        setTrafficSources([]);
      }
      
      // Process hourly data
      if (hourlyRes?.ok) {
        const hourlyDataRes = await hourlyRes.json().catch(() => ({}));
        setHourlyData(Array.isArray(hourlyDataRes?.data) ? hourlyDataRes.data : []);
      } else {
        setHourlyData([]);
      }
      
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Dashboard error:', err);
      setError(`فشل في تحميل البيانات: ${err?.message || 'خطأ غير معروف'}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  useEffect(() => {
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [timeRange]);

  const handleRefresh = () => fetchDashboardData();

  // Safe access helpers
  const safeStat = (category, field) => stats?.[category]?.[field] ?? 0;
  const safeTrend = (category) => stats?.[category]?.trend ?? 'up';

  const StatCard = ({ title, value, total, change, trend, icon: Icon, color }) => {
    if (!Icon) return null;
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-dark-2/60 text-sm mb-1">{title || ''}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-dark-1">{value ?? 0}</span>
              <span className="text-sm text-dark-2/60">/ {total ?? 0}</span>
            </div>
            <div className={`flex items-center gap-1 mt-2 ${trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
              {trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              <span className="text-sm font-medium">{change ?? 0}%</span>
              <span className="text-dark-2/40 text-xs">vs أمس</span>
            </div>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color || 'bg-gray-500'}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    );
  };

  if (isLoading && !stats.visitors.total) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-dark-2">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (error && !stats.visitors.total) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-red-500">
        <AlertCircle className="w-12 h-12 mb-4" />
        <p className="text-lg">{error}</p>
        <button 
          onClick={handleRefresh} 
          className="mt-4 bg-primary text-dark-1 px-4 py-2 rounded-lg hover:bg-primary/80"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-dark-1">لوحة التحكم Real-time</h2>
          <p className="text-dark-2/60 text-sm flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-500 animate-pulse" />
            بيانات حقيقية • آخر تحديث: {lastUpdated?.toLocaleTimeString?.('ar-SA') || '-'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm"
          >
            <option value="today">اليوم</option>
            <option value="yesterday">أمس</option>
            <option value="week">هذا الأسبوع</option>
            <option value="month">هذا الشهر</option>
          </select>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="bg-white border border-gray-200 text-dark-1 px-4 py-2 rounded-xl text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            تحديث
          </button>
          <button className="bg-primary text-dark-1 px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary/80 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            تصدير
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="الزوار النشطون الآن"
          value={safeStat('visitors', 'current')}
          total={safeStat('visitors', 'total')}
          change={safeStat('visitors', 'change')}
          trend={safeTrend('visitors')}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="مشاهدات الصفحات"
          value={safeStat('pageViews', 'current')}
          total={safeStat('pageViews', 'total')}
          change={safeStat('pageViews', 'change')}
          trend={safeTrend('pageViews')}
          icon={Eye}
          color="bg-purple-500"
        />
        <StatCard
          title="استفسارات جديدة"
          value={safeStat('inquiries', 'current')}
          total={safeStat('inquiries', 'total')}
          change={safeStat('inquiries', 'change')}
          trend={safeTrend('inquiries')}
          icon={MessageSquare}
          color="bg-orange-500"
        />
        <StatCard
          title="استشارات محجوزة"
          value={safeStat('consultations', 'current')}
          total={safeStat('consultations', 'total')}
          change={safeStat('consultations', 'change')}
          trend={safeTrend('consultations')}
          icon={Calendar}
          color="bg-green-500"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Activity Feed */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-dark-1 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              النشاط المباشر
            </h3>
            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full animate-pulse">
              LIVE
            </span>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {(!activities || activities.length === 0) ? (
              <p className="text-center text-gray-400 py-8">لا يوجد نشاط حديث</p>
            ) : (
              activities.map((activity, idx) => {
                if (!activity) return null;
                const IconComponent = getIcon(activity.icon);
                return (
                  <div key={activity.id || idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-dark-1">
                        <span className="font-bold">{activity.user || 'زائر'}</span>{' '}
                        <span className="text-dark-2/70">{activity.action || ''}</span>
                      </p>
                      <p className="text-xs text-dark-2/50 mt-1">{activity.time || ''}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Hourly Traffic Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-dark-1 mb-4">حركة المرور بالساعة</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {(!hourlyData || hourlyData.length === 0) ? (
              <div className="w-full text-center text-gray-400">لا توجد بيانات</div>
            ) : (
              (() => {
                const maxVisitors = Math.max(...hourlyData.map(h => h?.visitors || 0)) || 1;
                return hourlyData.map((hour, index) => {
                  if (!hour) return null;
                  const height = ((hour.visitors || 0) / maxVisitors) * 100;
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-gradient-to-t from-primary to-primary/60 rounded-t-lg transition-all duration-500 hover:from-primary/80 hover:to-primary"
                        style={{ height: `${height}%`, minHeight: '20px' }}
                      />
                      <span className="text-xs text-dark-2/60 mt-2">{hour.hour || ''}</span>
                    </div>
                  );
                });
              })()
            )}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Franchises */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-dark-1 flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              أفضل الفرنشايز أداءً
            </h3>
            <button className="text-primary text-sm">عرض الكل</button>
          </div>
          <div className="space-y-3">
            {(!topFranchises || topFranchises.length === 0) ? (
              <p className="text-center text-gray-400 py-8">لا توجد بيانات</p>
            ) : (
              topFranchises.map((franchise, index) => {
                if (!franchise) return null;
                return (
                  <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 bg-dark-1 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-dark-1">{franchise.name || 'غير معروف'}</h4>
                      <div className="flex items-center gap-4 text-xs text-dark-2/60 mt-1">
                        <span>{franchise.views || 0} مشاهدة</span>
                        <span>{franchise.inquiries || 0} استفسار</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{franchise.conversion || 0}%</div>
                      <div className="text-xs text-dark-2/50">conversion</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-bold text-dark-1 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-500" />
            مصادر الزيارات
          </h3>
          <div className="space-y-4">
            {(!trafficSources || trafficSources.length === 0) ? (
              <p className="text-center text-gray-400 py-8">لا توجد بيانات</p>
            ) : (
              trafficSources.map((source, index) => {
                if (!source) return null;
                return (
                  <div key={index}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-dark-1">{source.source || ''}</span>
                      <span className="font-bold text-dark-1">{source.percentage || 0}%</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${source.color || 'bg-gray-500'} rounded-full transition-all duration-1000`}
                        style={{ width: `${source.percentage || 0}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealtimeDashboard;
