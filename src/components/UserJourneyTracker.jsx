import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  X, 
  Eye, 
  Scale, 
  Calendar, 
  Heart, 
  ChevronLeft,
  TrendingUp,
  Target,
  Award,
  Clock,
  Building2,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Circle,
  BookOpen
} from 'lucide-react';

const UserJourneyTracker = ({ externalOpen, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [journey, setJourney] = useState({
    franchisesViewed: [],
    franchisesCompared: [],
    consultationBooked: false,
    favoriteFranchise: null,
    lastActive: null,
    stepsCompleted: []
  });
  const [showNotification, setShowNotification] = useState(false);

  // Load journey from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('userJourney');
    if (saved) {
      setJourney(JSON.parse(saved));
    }
  }, []);

  // Handle external control
  useEffect(() => {
    if (externalOpen) {
      setIsOpen(true);
    }
  }, [externalOpen]);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  // Save journey when updated
  useEffect(() => {
    localStorage.setItem('userJourney', JSON.stringify(journey));
  }, [journey]);

  // Track page views
  useEffect(() => {
    const trackView = () => {
      const path = window.location.pathname;
      const match = path.match(/\/profile\/(\d+)/);
      if (match) {
        const franchiseId = match[1];
        const franchiseName = document.title.split('|')[0]?.trim() || `فرنشايز #${franchiseId}`;
        
        setJourney(prev => {
          if (prev.franchisesViewed.find(f => f.id === franchiseId)) {
            return prev;
          }
          return {
            ...prev,
            franchisesViewed: [...prev.franchisesViewed, { 
              id: franchiseId, 
              name: franchiseName,
              date: new Date().toISOString()
            }],
            lastActive: new Date().toISOString()
          };
        });

        // Show notification on 3rd view
        setTimeout(() => {
          const currentViews = JSON.parse(localStorage.getItem('userJourney'))?.franchisesViewed?.length || 0;
          if (currentViews === 3) {
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 5000);
          }
        }, 1000);
      }
    };

    trackView();
    window.addEventListener('popstate', trackView);
    return () => window.removeEventListener('popstate', trackView);
  }, []);

  // Listen for custom events from other components
  useEffect(() => {
    const handleCompare = (e) => {
      if (e.detail?.franchises) {
        setJourney(prev => ({
          ...prev,
          franchisesCompared: e.detail.franchises,
          lastActive: new Date().toISOString()
        }));
      }
    };

    const handleFavorite = (e) => {
      if (e.detail?.franchise) {
        setJourney(prev => ({
          ...prev,
          favoriteFranchise: e.detail.franchise,
          lastActive: new Date().toISOString()
        }));
      }
    };

    window.addEventListener('franchiseCompare', handleCompare);
    window.addEventListener('franchiseFavorite', handleFavorite);
    
    return () => {
      window.removeEventListener('franchiseCompare', handleCompare);
      window.removeEventListener('franchiseFavorite', handleFavorite);
    };
  }, []);

  const markStepComplete = (stepId) => {
    setJourney(prev => ({
      ...prev,
      stepsCompleted: [...new Set([...prev.stepsCompleted, stepId])]
    }));
  };

  const calculateProgress = () => {
    const steps = [
      journey.franchisesViewed.length > 0,
      journey.franchisesViewed.length >= 5,
      journey.franchisesCompared.length > 0,
      journey.favoriteFranchise !== null,
      journey.consultationBooked
    ];
    const completed = steps.filter(Boolean).length;
    return Math.round((completed / steps.length) * 100);
  };

  const getJourneyStage = () => {
    const progress = calculateProgress();
    if (progress < 20) return { title: 'مستكشف جديد', color: 'bg-gray-400', icon: Eye };
    if (progress < 40) return { title: 'باحث نشط', color: 'bg-blue-500', icon: BookOpen };
    if (progress < 60) return { title: 'مقارن محترف', color: 'bg-purple-500', icon: Scale };
    if (progress < 80) return { title: 'مستثمر واعد', color: 'bg-orange-500', icon: Target };
    return { title: 'خبير الفرنشايز', color: 'bg-green-500', icon: Award };
  };

  const progress = calculateProgress();
  const stage = getJourneyStage();
  const StageIcon = stage.icon;

  const steps = [
    {
      id: 'view1',
      title: 'أول خطوة',
      description: 'استعرض فرنشايز واحد',
      icon: Eye,
      completed: journey.franchisesViewed.length > 0,
      link: '/gallery'
    },
    {
      id: 'view5',
      title: 'باحث نشط',
      description: 'استعرض 5 فرنشايزات',
      icon: Building2,
      completed: journey.franchisesViewed.length >= 5,
      link: '/gallery'
    },
    {
      id: 'compare',
      title: 'مقارنة ذكية',
      description: 'قارن بين فرنشايزين',
      icon: Scale,
      completed: journey.franchisesCompared.length > 0,
      action: () => window.dispatchEvent(new CustomEvent('openFranchiseCompare'))
    },
    {
      id: 'favorite',
      title: 'اختيار مفضل',
      description: 'حدد فرنشايز مفضل',
      icon: Heart,
      completed: journey.favoriteFranchise !== null,
      link: '/gallery'
    },
    {
      id: 'consultation',
      title: 'الاستشارة الذهبية',
      description: 'احجز استشارة مجانية',
      icon: Calendar,
      completed: journey.consultationBooked,
      link: '/contact'
    }
  ];

  const recentViews = [...journey.franchisesViewed].reverse().slice(0, 5);

  if (!isOpen) {
    return (
      <>
        {/* Floating Button - REMOVED, now controlled by FloatingActionMenu */}
        {/* Notification Toast */}
        {showNotification && (
          <div className="fixed bottom-24 left-6 z-50 bg-dark-1 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce">
            <Sparkles className="w-5 h-5 text-primary" />
            <div>
              <div className="font-bold text-sm">أحسنت! 🎉</div>
              <div className="text-xs text-white/70">استعرضت 3 فرنشايزات</div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Don't render anything if not open (controlled by FloatingActionMenu)
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-dark-1 to-dark-2 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 ${stage.color} rounded-full flex items-center justify-center`}>
              <StageIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-xl">رحلتك معنا</h2>
              <p className="text-white/70 text-sm">تقدمك: {progress}% - {stage.title}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Progress Bar */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-dark-1">تقدمك نحو الاستثمار الناجح</span>
              <span className="text-2xl font-bold text-primary">{progress}%</span>
            </div>
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${stage.color} transition-all duration-1000 rounded-full`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-dark-2/60">
              <span>بداية الرحلة</span>
              <span>مستثمر ناجح</span>
            </div>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 gap-3">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div 
                  key={step.id}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                    step.completed 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    step.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                  }`}>
                    {step.completed ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-dark-1">{step.title}</div>
                    <div className="text-sm text-dark-2/70">{step.description}</div>
                  </div>
                  {!step.completed && (
                    step.action ? (
                      <button
                        onClick={step.action}
                        className="px-4 py-2 bg-primary text-dark-1 rounded-full text-sm font-bold hover:bg-primary/80 transition-colors"
                      >
                        ابدأ
                      </button>
                    ) : (
                      <Link
                        to={step.link}
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 bg-dark-1 text-white rounded-full text-sm font-bold hover:bg-dark-2 transition-colors flex items-center gap-1"
                      >
                        اذهب
                        <ArrowLeft className="w-3 h-3" />
                      </Link>
                    )
                  )}
                </div>
              );
            })}
          </div>

          {/* Recent Activity */}
          {recentViews.length > 0 && (
            <div className="bg-blue-50 rounded-2xl p-5">
              <h3 className="font-bold text-dark-1 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                آخر ما شاهدته
              </h3>
              <div className="space-y-2">
                {recentViews.map((view, idx) => (
                  <Link
                    key={idx}
                    to={`/profile/${view.id}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-3 bg-white rounded-xl hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="font-medium text-dark-1">{view.name}</span>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-dark-2/50" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Stats Summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-primary/10 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-primary">{journey.franchisesViewed.length}</div>
              <div className="text-xs text-dark-2/70">فرنشايز مستعرض</div>
            </div>
            <div className="bg-purple-100 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{journey.franchisesCompared.length}</div>
              <div className="text-xs text-dark-2/70">مقارنات</div>
            </div>
            <div className="bg-orange-100 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {journey.lastActive ? Math.floor((new Date() - new Date(journey.lastActive)) / 1000 / 60) : 0}
              </div>
              <div className="text-xs text-dark-2/70">دقيقة منذ آخر نشاط</div>
            </div>
          </div>

          {/* CTA */}
          {progress < 100 && (
            <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl p-5 text-center">
              <h4 className="font-bold text-dark-1 mb-2">استمر في تقدمك!</h4>
              <p className="text-sm text-dark-2/70 mb-4">
                أكمل الخطوات المتبقية للوصول للاستشارة المجانية
              </p>
              <Link
                to="/gallery"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-2 bg-dark-1 text-white px-6 py-3 rounded-full font-bold hover:bg-dark-2 transition-colors"
              >
                <TrendingUp className="w-5 h-5" />
                أكمل رحلتك
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserJourneyTracker;
