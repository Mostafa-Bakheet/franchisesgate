import { useState, useEffect } from 'react';
import { 
  MapPin, 
  X, 
  TrendingUp, 
  Building2, 
  Users, 
  DollarSign,
  Info,
  ArrowRight,
  Filter
} from 'lucide-react';

const InvestmentMap = ({ externalOpen, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');

  // Handle external control
  useEffect(() => {
    if (externalOpen) {
      setIsOpen(true);
    }
  }, [externalOpen]);

  const handleClose = () => {
    setIsOpen(false);
    setSelectedCity(null);
    onClose?.();
  };

  // City data with franchise opportunities
  const cities = [
    {
      id: 'riyadh',
      name: 'الرياض',
      x: 45,
      y: 35,
      stats: {
        opportunities: 45,
        avgInvestment: '250,000',
        roi: '25%',
        population: '7.6M'
      },
      description: 'أكبر سوق استهلاكي في المملكة، فرص ممتازة في المطاعم والكافيهات',
      topCategories: ['مطاعم', 'كافيهات', 'صيدليات', 'تجزئة']
    },
    {
      id: 'jeddah',
      name: 'جدة',
      x: 25,
      y: 55,
      stats: {
        opportunities: 38,
        avgInvestment: '280,000',
        roi: '23%',
        population: '4.9M'
      },
      description: 'بوابة الحرمين، سياحة قوية، فرص في الفنادق والمطاعم',
      topCategories: ['فنادق', 'مطاعم', 'تجزئة', 'ترفيه']
    },
    {
      id: 'dammam',
      name: 'الدمام',
      x: 75,
      y: 30,
      stats: {
        opportunities: 28,
        avgInvestment: '220,000',
        roi: '22%',
        population: '1.5M'
      },
      description: 'عاصمة النفط، دخل مرتفع، فرص في الخدمات والصيانة',
      topCategories: ['خدمات', 'صيانة', 'تقنية', 'صيدليات']
    },
    {
      id: 'makkah',
      name: 'مكة',
      x: 30,
      y: 60,
      stats: {
        opportunities: 32,
        avgInvestment: '350,000',
        roi: '30%',
        population: '2.4M'
      },
      description: 'وجهة الحج والعمرة، فرص ضخمة في الفنادق والمطاعم',
      topCategories: ['فنادق', 'مطاعم', 'هدايا', 'مواصلات']
    },
    {
      id: 'madinah',
      name: 'المدينة',
      x: 35,
      y: 25,
      stats: {
        opportunities: 24,
        avgInvestment: '300,000',
        roi: '28%',
        population: '1.5M'
      },
      description: 'المدينة المنورة، سياحة دينية مستمرة على مدار السنة',
      topCategories: ['فنادق', 'مطاعم', 'هدايا', 'خدمات']
    },
    {
      id: 'abha',
      name: 'أبها',
      x: 55,
      y: 75,
      stats: {
        opportunities: 18,
        avgInvestment: '180,000',
        roi: '20%',
        population: '1.2M'
      },
      description: 'عاصمة السياحة العربية، جو معتدل، فرص في الكافيهات والترفيه',
      topCategories: ['كافيهات', 'ترفيه', 'مطاعم', 'سياحة']
    },
    {
      id: 'taif',
      name: 'الطائف',
      x: 48,
      y: 50,
      stats: {
        opportunities: 15,
        avgInvestment: '160,000',
        roi: '19%',
        population: '900K'
      },
      description: 'مدينة الورد، سياحة صيفية قوية، فرص في المطاعم والفنادق',
      topCategories: ['مطاعم', 'فنادق', 'ترفيه', 'تجزئة']
    },
    {
      id: 'qassim',
      name: 'القصيم',
      x: 40,
      y: 20,
      stats: {
        opportunities: 14,
        avgInvestment: '150,000',
        roi: '18%',
        population: '1.4M'
      },
      description: 'سلة الغذاء، فرص في الزراعة والصناعات الغذائية',
      topCategories: ['صناعات غذائية', 'تجزئة', 'زراعة', 'خدمات']
    }
  ];

  // Sample franchises for each city
  const cityFranchises = {
    riyadh: [
      { name: 'كوفي لاونا', category: 'كافيهات', investment: '200K', roi: '28%' },
      { name: 'مطبخ زاد', category: 'مطاعم', investment: '350K', roi: '25%' },
      { name: 'صيدلية الصحة', category: 'صيدليات', investment: '400K', roi: '22%' }
    ],
    jeddah: [
      { name: 'فندق النخبة', category: 'فنادق', investment: '2M', roi: '20%' },
      { name: 'مطعم البحر', category: 'مطاعم', investment: '300K', roi: '24%' },
      { name: 'مول العلامة', category: 'تجزئة', investment: '1.5M', roi: '18%' }
    ],
    dammam: [
      { name: 'خدمة الصيانة السريعة', category: 'خدمات', investment: '100K', roi: '30%' },
      { name: 'تقنية النفط', category: 'تقنية', investment: '250K', roi: '25%' },
      { name: 'صيدلية المنطقة', category: 'صيدليات', investment: '380K', roi: '23%' }
    ],
    makkah: [
      { name: 'فندق الحرم', category: 'فنادق', investment: '3M', roi: '32%' },
      { name: 'مطعم الحجاز', category: 'مطاعم', investment: '280K', roi: '28%' },
      { name: 'هدايا العمرة', category: 'هدايا', investment: '150K', roi: '35%' }
    ],
    madinah: [
      { name: 'فندق المدينة', category: 'فنادق', investment: '2.5M', roi: '30%' },
      { name: 'مطعم الأنصار', category: 'مطاعم', investment: '250K', roi: '26%' },
      { name: 'خدمات الزوار', category: 'خدمات', investment: '180K', roi: '28%' }
    ],
    abha: [
      { name: 'كافيه الضباب', category: 'كافيهات', investment: '220K', roi: '24%' },
      { name: 'مدينة الألعاب', category: 'ترفيه', investment: '800K', roi: '22%' },
      { name: 'مطعم الجبال', category: 'مطاعم', investment: '200K', roi: '23%' }
    ],
    taif: [
      { name: 'مطعم الورد', category: 'مطاعم', investment: '180K', roi: '21%' },
      { name: 'فندق الربيع', category: 'فنادق', investment: '900K', roi: '20%' },
      { name: 'ترفيه العائلة', category: 'ترفيه', investment: '500K', roi: '19%' }
    ],
    qassim: [
      { name: 'مصنع التمور', category: 'صناعات غذائية', investment: '600K', roi: '22%' },
      { name: 'سوق المزارعين', category: 'تجزئة', investment: '300K', roi: '20%' },
      { name: 'خدمات زراعية', category: 'خدمات', investment: '200K', roi: '25%' }
    ]
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-dark-1 to-dark-2 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-white font-bold text-xl">خريطة الفرص الاستثمارية</h2>
              <p className="text-white/70 text-sm">اكتشف الفرنشايز في مدن المملكة</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          {/* Map Section */}
          <div className="flex-1 p-6 bg-gradient-to-b from-blue-50 to-white relative">
            {/* Filter */}
            <div className="absolute top-4 left-4 z-10">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium shadow-sm"
              >
                <option value="all">كل الفئات</option>
                <option value="restaurant">مطاعم</option>
                <option value="cafe">كافيهات</option>
                <option value="pharmacy">صيدليات</option>
                <option value="retail">تجزئة</option>
                <option value="hotel">فنادق</option>
              </select>
            </div>

            {/* Saudi Arabia Map SVG */}
            <div className="w-full h-96 lg:h-full flex items-center justify-center">
              <svg viewBox="0 0 100 80" className="w-full h-full max-w-lg drop-shadow-lg">
                {/* Saudi Arabia outline */}
                <path
                  d="M30,15 L50,12 L70,15 L85,25 L88,40 L82,55 L70,68 L50,72 L35,68 L20,55 L15,40 L20,25 Z"
                  fill="#e0e7ff"
                  stroke="#6366f1"
                  strokeWidth="0.5"
                />
                
                {/* Grid lines */}
                <line x1="25" y1="20" x2="85" y2="20" stroke="#c7d2fe" strokeWidth="0.2" />
                <line x1="20" y1="35" x2="88" y2="35" stroke="#c7d2fe" strokeWidth="0.2" />
                <line x1="15" y1="50" x2="82" y2="50" stroke="#c7d2fe" strokeWidth="0.2" />
                <line x1="20" y1="65" x2="70" y2="65" stroke="#c7d2fe" strokeWidth="0.2" />
                <line x1="35" y1="12" x2="35" y2="72" stroke="#c7d2fe" strokeWidth="0.2" />
                <line x1="55" y1="12" x2="55" y2="72" stroke="#c7d2fe" strokeWidth="0.2" />
                <line x1="75" y1="15" x2="75" y2="68" stroke="#c7d2fe" strokeWidth="0.2" />
                
                {/* City markers */}
                {cities.map((city) => (
                  <g key={city.id}>
                    {/* Pulse effect for selected or all cities */}
                    <circle
                      cx={city.x}
                      cy={city.y}
                      r="3"
                      fill="#ef4444"
                      opacity="0.3"
                    >
                      <animate
                        attributeName="r"
                        from="3"
                        to="6"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                      <animate
                        attributeName="opacity"
                        from="0.5"
                        to="0"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </circle>
                    
                    {/* City marker */}
                    <circle
                      cx={city.x}
                      cy={city.y}
                      r={selectedCity?.id === city.id ? 5 : 3}
                      fill={selectedCity?.id === city.id ? '#dc2626' : '#6366f1'}
                      stroke="white"
                      strokeWidth="1"
                      className="cursor-pointer transition-all hover:r-4"
                      onClick={() => setSelectedCity(city)}
                    />
                    
                    {/* City name */}
                    <text
                      x={city.x}
                      y={city.y + 6}
                      textAnchor="middle"
                      fontSize="3"
                      fill="#1f2937"
                      fontWeight="bold"
                      className="cursor-pointer"
                      onClick={() => setSelectedCity(city)}
                    >
                      {city.name}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white rounded-xl p-3 shadow-md">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <span>فرص متاحة</span>
              </div>
              <div className="flex items-center gap-2 text-xs mt-1">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span>فرص عالية</span>
              </div>
            </div>
          </div>

          {/* Details Panel */}
          <div className="w-full lg:w-80 bg-gray-50 border-l overflow-y-auto">
            {selectedCity ? (
              <div className="p-4">
                {/* City Header */}
                <div className="bg-white rounded-2xl p-4 mb-4">
                  <h3 className="text-xl font-bold text-dark-1 mb-2">{selectedCity.name}</h3>
                  <p className="text-sm text-dark-2/70 leading-relaxed">
                    {selectedCity.description}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-primary">{selectedCity.stats.opportunities}</div>
                    <div className="text-xs text-dark-2/70">فرصة</div>
                  </div>
                  <div className="bg-white rounded-xl p-3 text-center">
                    <div className="text-lg font-bold text-green-600">{selectedCity.stats.roi}</div>
                    <div className="text-xs text-dark-2/70">عائد سنوي</div>
                  </div>
                  <div className="bg-white rounded-xl p-3 text-center">
                    <div className="text-lg font-bold text-dark-1">{selectedCity.stats.avgInvestment}</div>
                    <div className="text-xs text-dark-2/70">متوسط الاستثمار</div>
                  </div>
                  <div className="bg-white rounded-xl p-3 text-center">
                    <div className="text-lg font-bold text-blue-600">{selectedCity.stats.population}</div>
                    <div className="text-xs text-dark-2/70">سكان</div>
                  </div>
                </div>

                {/* Top Categories */}
                <div className="bg-white rounded-2xl p-4 mb-4">
                  <h4 className="font-bold text-dark-1 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    أفضل الفئات
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCity.topCategories.map((cat, idx) => (
                      <span
                        key={idx}
                        className="bg-primary/10 text-dark-1 px-3 py-1 rounded-full text-sm"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Featured Franchises */}
                <div className="bg-white rounded-2xl p-4">
                  <h4 className="font-bold text-dark-1 mb-3 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    فرنشايز مميزة
                  </h4>
                  <div className="space-y-3">
                    {cityFranchises[selectedCity.id]?.map((franchise, idx) => (
                      <div
                        key={idx}
                        className="border border-gray-100 rounded-xl p-3 hover:border-primary transition-colors cursor-pointer"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-bold text-dark-1">{franchise.name}</span>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            {franchise.roi}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-dark-2/60">
                          <span>{franchise.category}</span>
                          <span>{franchise.investment}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => window.location.href = '/gallery'}
                    className="w-full mt-4 bg-dark-1 text-white py-3 rounded-xl font-bold hover:bg-dark-2 transition-colors flex items-center justify-center gap-2"
                  >
                    عرض كل الفرص
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center">
                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-dark-2/70">
                  اضغط على أي مدينة لعرض التفاصيل والفرص المتاحة
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer stats */}
        <div className="bg-dark-1 text-white px-6 py-3 flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Building2 className="w-4 h-4" />
              {cities.reduce((acc, c) => acc + c.stats.opportunities, 0)}+ فرصة
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              35M+ نسمة
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              متوسط ROI 24%
            </span>
          </div>
          <button
            onClick={() => window.location.href = '/gallery'}
            className="bg-primary text-dark-1 px-4 py-2 rounded-full font-bold hover:bg-primary/80 transition-colors flex items-center gap-2"
          >
            استكشف الآن
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvestmentMap;
