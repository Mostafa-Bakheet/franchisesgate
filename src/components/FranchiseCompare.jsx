import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  X, 
  Scale, 
  DollarSign, 
  MapPin, 
  TrendingUp, 
  Users,
  Star,
  Check,
  XCircle,
  ChevronDown,
  ChevronUp,
  BarChart3,
  ArrowLeft,
  Plus,
  Trash2
} from 'lucide-react';

const FranchiseCompare = ({ externalOpen, onClose }) => {
  const [selectedFranchises, setSelectedFranchises] = useState([]);
  const [availableFranchises, setAvailableFranchises] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [expandedSection, setExpandedSection] = useState('financial');

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

  // Fetch franchises from API
  useEffect(() => {
    const fetchFranchises = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/gallery?limit=50');
        const data = await response.json();
        if (data.data) {
          setAvailableFranchises(data.data);
        }
      } catch (err) {
        // Fallback data for demo
        setAvailableFranchises([
          {
            id: 1,
            name: 'كوفي لاونا',
            category: 'مقهى وكوفي شوب',
            logo: '/logo1.png',
            investment: { minInvestment: 180000, maxInvestment: 250000, franchiseFee: 50000 },
            monthlyRoyalties: 6,
            marketingFee: 2,
            expectedRoi: 25,
            paybackPeriod: 24,
            locations: ['الرياض', 'جدة', 'الدمام'],
            rating: 4.8,
            reviews: 24,
            supportLevel: 'ممتاز',
            trainingWeeks: 4,
            features: ['دعم 24/7', 'نظام POS', 'تدريب شامل', 'تسويق جاهز']
          },
          {
            id: 2,
            name: 'مطبخ زاد',
            category: 'مطعم وجبات سريعة',
            logo: '/logo2.png',
            investment: { minInvestment: 350000, maxInvestment: 500000, franchiseFee: 80000 },
            monthlyRoyalties: 5,
            marketingFee: 3,
            expectedRoi: 35,
            paybackPeriod: 18,
            locations: ['الرياض', 'جدة', 'الدمام', 'أبها'],
            rating: 4.6,
            reviews: 18,
            supportLevel: 'ممتاز',
            trainingWeeks: 6,
            features: ['قائمة متنوعة', 'دليل تشغيل', 'إدخال زبائن', 'جودة موحدة']
          },
          {
            id: 3,
            name: 'صيدلية الصحة',
            category: 'صحة ودواء',
            logo: '/logo3.png',
            investment: { minInvestment: 280000, maxInvestment: 400000, franchiseFee: 60000 },
            monthlyRoyalties: 4,
            marketingFee: 1,
            expectedRoi: 22,
            paybackPeriod: 30,
            locations: ['الرياض', 'جدة', 'الدمام'],
            rating: 4.9,
            reviews: 31,
            supportLevel: 'جيد جداً',
            trainingWeeks: 8,
            features: ['ترخيص سريع', 'موردين معتمدين', 'نظام رقمي', 'تدريب صيدلي']
          }
        ]);
      }
    };
    fetchFranchises();
  }, []);

  const addFranchise = (franchise) => {
    if (selectedFranchises.length >= 3) {
      alert('يمكن مقارنة 3 فرنشايز كحد أقصى');
      return;
    }
    if (selectedFranchises.find(f => f.id === franchise.id)) {
      alert('هذا الفرنشايز مضاف بالفعل');
      return;
    }
    setSelectedFranchises([...selectedFranchises, franchise]);
    setShowDropdown(false);
  };

  const removeFranchise = (id) => {
    setSelectedFranchises(selectedFranchises.filter(f => f.id !== id));
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Compare data structure
  const compareSections = [
    {
      id: 'financial',
      title: 'المقارنة المالية',
      icon: DollarSign,
      items: [
        { label: 'رأس المال المطلوب', key: 'investment', format: (v) => `${v.minInvestment?.toLocaleString()} - ${v.maxInvestment?.toLocaleString()} ر.س` },
        { label: 'رسوم الامتياز', key: 'investment', format: (v) => `${v.franchiseFee?.toLocaleString()} ر.س` },
        { label: 'نسبة الروalties الشهرية', key: 'monthlyRoyalties', format: (v) => `${v}%` },
        { label: 'رسوم التسويق', key: 'marketingFee', format: (v) => `${v}%` },
        { label: 'العائد المتوقع سنوياً', key: 'expectedRoi', format: (v) => `${v}%`, highlight: true },
        { label: 'فترة استرداد رأس المال', key: 'paybackPeriod', format: (v) => `${v} شهر`, invert: true },
      ]
    },
    {
      id: 'operational',
      title: 'التشغيل والدعم',
      icon: Users,
      items: [
        { label: 'مستوى الدعم', key: 'supportLevel', format: (v) => v },
        { label: 'أسابيع التدريب', key: 'trainingWeeks', format: (v) => `${v} أسابيع` },
        { label: 'التقييم', key: 'rating', format: (v) => `${v}/5 ⭐` },
        { label: 'عدد المراجعات', key: 'reviews', format: (v) => `${v} تقييم` },
      ]
    },
    {
      id: 'locations',
      title: 'التواجد الجغرافي',
      icon: MapPin,
      items: [
        { label: 'المدن المتاحة', key: 'locations', format: (v) => v?.join('، ') || 'غير محدد' },
        { label: 'عدد الفروع الحالية', key: 'branches', format: (v) => v || 'غير محدد' },
      ]
    },
    {
      id: 'features',
      title: 'المميزات والخدمات',
      icon: Check,
      items: [
        { label: 'المميزات المتضمنة', key: 'features', format: (v) => v?.join(' • ') || 'غير محدد' },
      ]
    }
  ];

  // Find best value in each row
  const getBestValue = (items, key, invert = false) => {
    if (selectedFranchises.length < 2) return null;
    
    const values = selectedFranchises.map(f => {
      let val = key === 'investment' ? f[key]?.minInvestment : f[key];
      if (key === 'paybackPeriod' && invert) val = -val; // Lower is better
      return { id: f.id, val };
    });
    
    const best = values.reduce((max, curr) => curr.val > max.val ? curr : max);
    return best.id;
  };

  // Don't render anything if not open (controlled by FloatingActionMenu)
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-dark-1 to-dark-2 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Scale className="w-6 h-6 text-primary" />
            <div>
              <h2 className="text-white font-bold text-xl">أداة المقارنة الذكية</h2>
              <p className="text-white/70 text-sm">قارن بين الفرنشايزات واختر الأنسب لك</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Add Franchise Bar */}
        <div className="px-6 py-4 bg-gray-50 border-b flex items-center gap-4">
          <span className="text-dark-2 font-medium">أضف للمقارنة:</span>
          <div className="relative flex-1 max-w-md">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 flex items-center justify-between hover:border-primary transition-colors"
            >
              <span className="text-dark-2">اختر فرنشايز...</span>
              <ChevronDown className={`w-5 h-5 text-dark-2 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-64 overflow-y-auto z-10">
                {availableFranchises.map(franchise => (
                  <button
                    key={franchise.id}
                    onClick={() => addFranchise(franchise)}
                    className="w-full px-4 py-3 text-right hover:bg-gray-50 flex items-center gap-3 border-b last:border-0"
                  >
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      {franchise.name?.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-dark-1">{franchise.name}</div>
                      <div className="text-xs text-dark-2/60">{franchise.category}</div>
                    </div>
                    <Plus className="w-5 h-5 text-primary" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <span className="text-sm text-dark-2/60">
            {selectedFranchises.length}/3 محدد
          </span>
        </div>

        {/* Comparison Grid */}
        <div className="flex-1 overflow-auto p-6">
          {selectedFranchises.length === 0 ? (
            <div className="text-center py-12">
              <Scale className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-dark-1 mb-2">ابدأ المقارنة</h3>
              <p className="text-dark-2/60 mb-6">اختر فرنشايز أو أكثر للمقارنة</p>
              <button
                onClick={() => setShowDropdown(true)}
                className="bg-primary text-dark-1 px-6 py-3 rounded-full font-bold"
              >
                أضف فرنشايز
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Franchise Headers */}
              <div className="grid grid-cols-[200px_repeat(auto-fit,minmax(200px,1fr))] gap-4">
                <div className="font-bold text-dark-2">المعيار</div>
                {selectedFranchises.map(franchise => (
                  <div key={franchise.id} className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4 text-center relative">
                    <button
                      onClick={() => removeFranchise(franchise.id)}
                      className="absolute top-2 left-2 w-6 h-6 bg-red-100 text-red-500 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <div className="w-16 h-16 bg-white rounded-xl shadow-sm mx-auto mb-3 flex items-center justify-center text-2xl font-bold text-dark-1">
                      {franchise.name?.charAt(0)}
                    </div>
                    <h3 className="font-bold text-dark-1 mb-1">{franchise.name}</h3>
                    <p className="text-xs text-dark-2/60">{franchise.category}</p>
                    <Link
                      to={`/profile/${franchise.id}`}
                      className="inline-flex items-center gap-1 text-primary text-sm mt-3 hover:underline"
                    >
                      التفاصيل
                      <ArrowLeft className="w-3 h-3" />
                    </Link>
                  </div>
                ))}
              </div>

              {/* Comparison Sections */}
              {compareSections.map(section => {
                const Icon = section.icon;
                const isExpanded = expandedSection === section.id;
                
                return (
                  <div key={section.id} className="border rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full px-4 py-3 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-5 h-5 text-primary" />
                        <span className="font-bold text-dark-1">{section.title}</span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-dark-2" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-dark-2" />
                      )}
                    </button>
                    
                    {isExpanded && (
                      <div className="divide-y">
                        {section.items.map((item, idx) => {
                          const bestId = item.invert !== undefined ? getBestValue(selectedFranchises, item.key, item.invert) : null;
                          
                          return (
                            <div key={idx} className="grid grid-cols-[200px_repeat(auto-fit,minmax(200px,1fr))] gap-4 p-4 items-center">
                              <div className="text-sm text-dark-2 font-medium">{item.label}</div>
                              {selectedFranchises.map(franchise => {
                                const value = item.key === 'investment' ? franchise[item.key] : franchise[item.key];
                                const isBest = bestId === franchise.id;
                                
                                return (
                                  <div
                                    key={franchise.id}
                                    className={`text-center py-2 rounded-lg ${
                                      isBest ? 'bg-green-100 text-green-700 font-bold' : 'text-dark-1'
                                    } ${item.highlight ? 'text-lg' : ''}`}
                                  >
                                    {item.format(value)}
                                    {isBest && <span className="mr-1">✓</span>}
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Winner Summary */}
              {selectedFranchises.length >= 2 && (
                <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl p-6 mt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <BarChart3 className="w-6 h-6 text-primary" />
                    <h3 className="font-bold text-dark-1">التوصية الذكية</h3>
                  </div>
                  <p className="text-dark-2 mb-4">
                    بناءً على المقارنة، <span className="font-bold text-dark-1">{selectedFranchises[0].name}</span> يقدم أفضل توازن بين العائد ورسوم الامتياز.
                  </p>
                  <div className="flex gap-3">
                    <Link
                      to={`/profile/${selectedFranchises[0].id}`}
                      className="bg-dark-1 text-white px-6 py-2.5 rounded-full font-bold hover:bg-dark-2 transition-colors"
                    >
                      اعرف المزيد
                    </Link>
                    <button
                      onClick={() => setSelectedFranchises([])}
                      className="border-2 border-dark-1 text-dark-1 px-6 py-2.5 rounded-full font-bold hover:bg-dark-1 hover:text-white transition-colors"
                    >
                      مقارنة جديدة
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FranchiseCompare;
