import { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  X, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Target,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  RefreshCcw,
  Trophy,
  Star,
  ShoppingBag,
  Megaphone,
  UserPlus,
  Minus,
  Plus,
  BarChart3,
  Clock,
  Award,
  Sparkles
} from 'lucide-react';

const FranchiseSimulator = ({ externalOpen, onClose, externalControl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [gameState, setGameState] = useState('intro'); // intro, playing, result
  const [day, setDay] = useState(1);
  const [stats, setStats] = useState({
    revenue: 5000,
    expenses: 3000,
    profit: 2000,
    customers: 50,
    staff: 3,
    satisfaction: 80,
    reputation: 70,
    marketingBudget: 500,
    priceLevel: 50 // 0-100 (cheap to premium)
  });
  const [decisions, setDecisions] = useState([]);
  const [events, setEvents] = useState([]);
  const [achievements, setAchievements] = useState([]);

  const maxDays = 30;

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

  // Random events
  const randomEvents = [
    {
      title: 'زيارة مفاجئة من مراقب الصحة',
      description: 'المراقب سيزور الفرع غداً. هل تريد إجراء تنظيف إضافي؟',
      cost: 300,
      impact: { satisfaction: 10, reputation: 5 },
      skipImpact: { satisfaction: -15, reputation: -10 }
    },
    {
      title: 'عطل في المعدات الرئيسية',
      description: 'تحتاج لإصلاح عاجل. التكلفة 800 ريال',
      cost: 800,
      impact: { customers: -20 },
      skipImpact: { customers: -30, satisfaction: -20 }
    },
    {
      title: 'منافس جديد افتتح بالجوار',
      description: 'افتتح مطعم جديد يقدم عروض تنافسية',
      impact: { customers: -10 },
      response: {
        discount: { cost: 0, impact: { customers: 15, revenue: -500 } },
        marketing: { cost: 400, impact: { customers: 20, reputation: 5 } },
        ignore: { impact: { customers: -15, reputation: -5 } }
      }
    },
    {
      title: 'تقييم إيجابي من مدون مشهور',
      description: 'زبون مشهور كتب عنك تقييم رائع!',
      impact: { reputation: 15, customers: 25 }
    },
    {
      title: 'موسم الزحام',
      description: 'الإجازة الصيفية بدأت! الطلب سيزيد 40%',
      impact: { customers: 40 },
      days: [10, 15, 20]
    }
  ];

  const dailyDecisions = [
    {
      category: 'pricing',
      title: 'تسعير اليوم',
      icon: DollarSign,
      options: [
        { 
          label: 'أسعار مخفضة', 
          desc: 'زيادة الزبائن 20%، هامش ربح أقل',
          impact: { customers: 20, revenue: 1000, profit: 200 }
        },
        { 
          label: 'أسعار عادية', 
          desc: 'توازن بين الكمية والربح',
          impact: { customers: 0, revenue: 2000, profit: 800 }
        },
        { 
          label: 'أسعار مميزة', 
          desc: 'زبائن أقل لكن ربح أعلى',
          impact: { customers: -10, revenue: 1800, profit: 1000 }
        }
      ]
    },
    {
      category: 'staffing',
      title: 'إدارة الموظفين',
      icon: Users,
      options: [
        { 
          label: 'تقليل الموظفين', 
          desc: 'توفير 500 ريال، رضا أقل',
          impact: { expenses: -500, satisfaction: -15, staff: -1 }
        },
        { 
          label: 'حافظ على الوضع', 
          desc: 'لا تغيير',
          impact: { expenses: 0, satisfaction: 0 }
        },
        { 
          label: 'وظف موظف إضافي', 
          desc: 'تحسين الخدمة بـ 800 ريال',
          impact: { expenses: 800, satisfaction: 20, staff: 1 }
        }
      ]
    },
    {
      category: 'marketing',
      title: 'حملة تسويقية',
      icon: Megaphone,
      options: [
        { 
          label: 'لا تسويق', 
          desc: 'توفير الميزانية',
          impact: { marketingBudget: 0, customers: -5 }
        },
        { 
          label: 'تسويق خفيف', 
          desc: '500 ريال، زيادة بسيطة',
          impact: { marketingBudget: 500, customers: 15, expenses: 500 }
        },
        { 
          label: 'حملة كبيرة', 
          desc: '1500 ريال، زيادة كبيرة',
          impact: { marketingBudget: 1500, customers: 40, reputation: 10, expenses: 1500 }
        }
      ]
    },
    {
      category: 'inventory',
      title: 'مستوى المخزون',
      icon: ShoppingBag,
      options: [
        { 
          label: 'مخزون أقل', 
          desc: 'توفير 300 ريال، خطر نفاد',
          impact: { expenses: -300, satisfaction: -10 }
        },
        { 
          label: 'مخزون عادي', 
          desc: 'توازن',
          impact: { expenses: 0, satisfaction: 0 }
        },
        { 
          label: 'مخزون إضافي', 
          desc: '500 ريال، ضمان توفر',
          impact: { expenses: 500, satisfaction: 10 }
        }
      ]
    }
  ];

  const checkAchievements = () => {
    const newAchievements = [];
    if (stats.profit > 5000 && !achievements.find(a => a.id === 'high_profit')) {
      newAchievements.push({ id: 'high_profit', title: 'رجل الأعمال', desc: 'حققت ربح 5000+ في يوم واحد', icon: Trophy });
    }
    if (stats.satisfaction > 95 && !achievements.find(a => a.id === 'excellent_service')) {
      newAchievements.push({ id: 'excellent_service', title: 'خدمة ممتازة', desc: 'وصلت رضا العملاء 95%+', icon: Star });
    }
    if (stats.customers > 100 && !achievements.find(a => a.id === 'popular')) {
      newAchievements.push({ id: 'popular', title: 'الوجهة المفضلة', desc: '100+ زبون في يوم واحد', icon: Award });
    }
    if (newAchievements.length > 0) {
      setAchievements([...achievements, ...newAchievements]);
    }
  };

  const makeDecision = (decision, option) => {
    const newStats = { ...stats };
    
    // Apply impacts
    Object.entries(option.impact).forEach(([key, value]) => {
      if (key === 'staff') {
        newStats.staff += value;
      } else {
        newStats[key] += value;
      }
    });

    // Calculate derived stats
    newStats.profit = newStats.revenue - newStats.expenses;
    newStats.satisfaction = Math.max(0, Math.min(100, newStats.satisfaction));
    newStats.reputation = Math.max(0, Math.min(100, newStats.reputation));

    setStats(newStats);
    setDecisions([...decisions, { day, category: decision.title, choice: option.label }]);

    // Check for random event
    if (Math.random() > 0.7) {
      const event = randomEvents[Math.floor(Math.random() * randomEvents.length)];
      setEvents([...events, { ...event, day }]);
    }

    checkAchievements();

    // Next day
    if (day < maxDays) {
      setDay(day + 1);
    } else {
      setGameState('result');
    }
  };

  const handleEvent = (event, action) => {
    const newStats = { ...stats };
    
    if (action === 'accept') {
      newStats.expenses += event.cost || 0;
      Object.entries(event.impact || {}).forEach(([key, value]) => {
        newStats[key] += value;
      });
    } else if (action === 'skip') {
      Object.entries(event.skipImpact || {}).forEach(([key, value]) => {
        newStats[key] += value;
      });
    }

    setStats(newStats);
    setEvents(events.filter(e => e.day !== event.day || e.title !== event.title));
  };

  const resetGame = () => {
    setGameState('intro');
    setDay(1);
    setStats({
      revenue: 5000,
      expenses: 3000,
      profit: 2000,
      customers: 50,
      staff: 3,
      satisfaction: 80,
      reputation: 70,
      marketingBudget: 500,
      priceLevel: 50
    });
    setDecisions([]);
    setEvents([]);
    setAchievements([]);
  };

  const startGame = () => {
    setGameState('playing');
  };

  // Don't render anything if not open (controlled by FloatingActionMenu)
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Gamepad2 className="w-7 h-7 text-white" />
            <div>
              <h2 className="text-white font-bold text-xl">محاكي الفرنشايز</h2>
              <p className="text-white/70 text-sm">جرب إدارة فرنشايزك لمدة 30 يوم</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Game Content */}
        <div className="flex-1 overflow-auto p-6">
          {gameState === 'intro' && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-12 h-12 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold text-dark-1 mb-4">هل تستطيع إدارة فرنشايز ناجح؟</h3>
              <p className="text-dark-2/70 max-w-lg mx-auto mb-8 text-lg leading-relaxed">
                خذ قرارات يومية في التسعير، التوظيف، والتسويق. تعامل مع الأزمات المفاجئة. 
                حقق أكبر ربح ممكن خلال 30 يوم!
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="font-bold text-dark-1">إدارة مالية</div>
                  <div className="text-xs text-dark-2/60">موازنة الإيرادات</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="font-bold text-dark-1">الموارد البشرية</div>
                  <div className="text-xs text-dark-2/60">توظيف وتدريب</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <Target className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <div className="font-bold text-dark-1">التسويق</div>
                  <div className="text-xs text-dark-2/60">جذب الزبائن</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <AlertCircle className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <div className="font-bold text-dark-1">إدارة الأزمات</div>
                  <div className="text-xs text-dark-2/60">مواقف مفاجئة</div>
                </div>
              </div>

              <button
                onClick={startGame}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-10 py-4 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg"
              >
                ابدأ التحدي! 🚀
              </button>
            </div>
          )}

          {gameState === 'playing' && (
            <div className="space-y-6">
              {/* Day & Stats Bar */}
              <div className="bg-gradient-to-r from-dark-1 to-dark-2 rounded-2xl p-4 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="font-bold text-lg">اليوم {day} من {maxDays}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {achievements.slice(-3).map((ach, i) => (
                      <div key={i} className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center" title={ach.title}>
                        <ach.icon className="w-4 h-4 text-dark-1" />
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-3">
                  <div className="bg-white/10 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-green-400">{stats.profit.toLocaleString()}</div>
                    <div className="text-xs text-white/70">ربح اليوم</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-primary">{stats.customers}</div>
                    <div className="text-xs text-white/70">زبون</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-yellow-400">{stats.satisfaction}%</div>
                    <div className="text-xs text-white/70">الرضا</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-blue-400">{stats.staff}</div>
                    <div className="text-xs text-white/70">موظف</div>
                  </div>
                </div>
              </div>

              {/* Events */}
              {events.filter(e => e.day === day).map((event, idx) => (
                <div key={idx} className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-5">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-bold text-orange-700 mb-1">{event.title}</h4>
                      <p className="text-orange-600 text-sm mb-4">{event.description}</p>
                      
                      {event.response ? (
                        <div className="flex gap-2">
                          {Object.entries(event.response).map(([key, option]) => (
                            <button
                              key={key}
                              onClick={() => handleEvent(event, key)}
                              className="flex-1 bg-white border border-orange-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-100 transition-colors"
                            >
                              {key === 'discount' ? 'عرض خصم' : key === 'marketing' ? 'حملة تسويق' : 'تجاهل'}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEvent(event, 'accept')}
                            className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors"
                          >
                            {event.cost ? `قبول (-${event.cost} ريال)` : 'حسناً'}
                          </button>
                          <button
                            onClick={() => handleEvent(event, 'skip')}
                            className="flex-1 bg-white border border-orange-200 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                          >
                            تجاهل
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Daily Decisions */}
              {events.filter(e => e.day === day).length === 0 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-dark-1 text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    قرارات اليوم
                  </h3>
                  
                  {dailyDecisions.map((decision, idx) => {
                    const Icon = decision.icon;
                    return (
                      <div key={idx} className="bg-gray-50 rounded-2xl p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <h4 className="font-bold text-dark-1">{decision.title}</h4>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {decision.options.map((option, optIdx) => (
                            <button
                              key={optIdx}
                              onClick={() => makeDecision(decision, option)}
                              className="bg-white border-2 border-gray-200 rounded-xl p-4 text-right hover:border-primary hover:shadow-md transition-all"
                            >
                              <div className="font-bold text-dark-1 mb-1">{option.label}</div>
                              <div className="text-xs text-dark-2/70">{option.desc}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {gameState === 'result' && (
            <div className="text-center py-8">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-12 h-12 text-yellow-600" />
              </div>
              
              <h3 className="text-3xl font-bold text-dark-1 mb-2">
                {stats.profit > 100000 ? 'أداء ممتاز! 🏆' : stats.profit > 50000 ? 'أداء جيد! 👏' : 'استمر في التعلم! 💪'}
              </h3>
              <p className="text-dark-2/70 mb-8">نتائج 30 يوم من إدارة الفرنشايز</p>

              {/* Final Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
                <div className="bg-green-50 rounded-2xl p-4 text-center">
                  <div className="text-3xl font-bold text-green-600">{stats.profit.toLocaleString()}</div>
                  <div className="text-sm text-green-700">إجمالي الربح</div>
                </div>
                <div className="bg-blue-50 rounded-2xl p-4 text-center">
                  <div className="text-3xl font-bold text-blue-600">{stats.customers * 30}</div>
                  <div className="text-sm text-blue-700">إجمالي الزبائن</div>
                </div>
                <div className="bg-yellow-50 rounded-2xl p-4 text-center">
                  <div className="text-3xl font-bold text-yellow-600">{stats.satisfaction}%</div>
                  <div className="text-sm text-yellow-700">الرضا النهائي</div>
                </div>
                <div className="bg-purple-50 rounded-2xl p-4 text-center">
                  <div className="text-3xl font-bold text-purple-600">{achievements.length}</div>
                  <div className="text-sm text-purple-700">الإنجازات</div>
                </div>
              </div>

              {/* Achievements */}
              {achievements.length > 0 && (
                <div className="max-w-2xl mx-auto mb-8">
                  <h4 className="font-bold text-dark-1 mb-4">إنجازاتك:</h4>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {achievements.map((ach, i) => (
                      <div key={i} className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                        <ach.icon className="w-4 h-4" />
                        {ach.title}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Decision Summary */}
              <div className="max-w-2xl mx-auto mb-8 text-right">
                <h4 className="font-bold text-dark-1 mb-4">ملخص قراراتك:</h4>
                <div className="bg-gray-50 rounded-2xl p-4 max-h-40 overflow-y-auto">
                  {decisions.map((dec, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                      <span className="text-dark-2">اليوم {dec.day}: {dec.category}</span>
                      <span className="font-medium text-dark-1">{dec.choice}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={resetGame}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform"
                >
                  <RefreshCcw className="w-5 h-5 inline ml-2" />
                  العب مرة أخرى
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="border-2 border-dark-1 text-dark-1 px-8 py-3 rounded-full font-bold hover:bg-dark-1 hover:text-white transition-colors"
                >
                  تصفح فرنشايز حقيقية
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FranchiseSimulator;
