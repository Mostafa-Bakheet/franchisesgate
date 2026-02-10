import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  DollarSign, 
  MapPin, 
  Briefcase, 
  Clock, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Star,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Target,
  Calculator,
  X,
  RotateCcw
} from 'lucide-react';

const AIInvestmentCalculator = ({ externalOpen, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState(null);
  
  const [inputs, setInputs] = useState({
    budget: '',
    city: '',
    experience: '',
    timeAvailability: '',
    category: '',
    riskTolerance: 'medium'
  });

  const totalSteps = 5;

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

  const cities = ['الرياض', 'جدة', 'الدمام', 'أبها', 'تبوك', 'القصيم', 'المدينة', 'مكة', 'الطائف', 'الخبر'];
  const categories = ['مطاعم', 'مقاهي', 'صيدليات', 'محلات تجزئة', 'خدمات', 'تجميل وصحة', 'تعليم وتدريب'];
  const experienceLevels = [
    { value: 'none', label: 'لا خبرة سابقة', score: 1 },
    { value: 'some', label: 'خبرة بسيطة في العمل الحر', score: 2 },
    { value: 'manager', label: 'عملت مدير سابقاً', score: 3 },
    { value: 'business', label: 'لدي خبرة في إدارة أعمال', score: 4 }
  ];
  const timeOptions = [
    { value: 'fulltime', label: 'دوام كامل (40+ ساعة)', score: 3 },
    { value: 'parttime', label: 'دوام جزئي (20-40 ساعة)', score: 2 },
    { value: 'minimal', label: 'وقت محدود (<20 ساعة)', score: 1 }
  ];

  const handleInputChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const calculateRecommendations = async () => {
    setIsCalculating(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const budget = parseInt(inputs.budget) || 200000;
    const experience = experienceLevels.find(e => e.value === inputs.experience)?.score || 2;
    const timeScore = timeOptions.find(t => t.value === inputs.timeAvailability)?.score || 2;
    
    // AI scoring algorithm
    const recommendations = [
      {
        id: 1,
        name: 'كوفي لاونا',
        category: 'مقاهي',
        matchScore: Math.min(98, 85 + experience * 2 + timeScore * 2),
        investment: { min: 180000, max: 250000 },
        monthlyRevenue: 45000,
        roi: 28,
        paybackMonths: 22,
        whyRecommended: [
          budget >= 180000 ? '✓ يناسب ميزانيتك تماماً' : null,
          timeScore >= 2 ? '✓ يتطلب جهد متوسط مناسب لوقتك' : null,
          experience >= 2 ? '✓ سهل الإدارة للمبتدئين' : null,
          '✓ نموذج مربح ومختبر'
        ].filter(Boolean),
        riskLevel: 'منخفض',
        supportLevel: 'ممتاز',
        locations: ['الرياض', 'جدة', 'الدمام']
      },
      {
        id: 2,
        name: 'مطبخ زاد',
        category: 'مطاعم',
        matchScore: Math.min(95, 80 + experience * 3),
        investment: { min: 350000, max: 500000 },
        monthlyRevenue: 85000,
        roi: 32,
        paybackMonths: 18,
        whyRecommended: [
          budget >= 350000 ? '✓ ميزانيتك تكفي للاستثمار' : '⚠ يتطلب ميزانية أعلى قليلاً',
          experience >= 3 ? '✓ خبرتك تساعد في إدارة المطعم' : null,
          timeScore >= 2 ? '✓ يحتاج متابعة يومية مناسبة لك' : null,
          '✪ عائد استثمار ممتاز'
        ].filter(Boolean),
        riskLevel: 'متوسط',
        supportLevel: 'ممتاز',
        locations: ['الرياض', 'جدة', 'الدمام', 'أبها']
      },
      {
        id: 3,
        name: 'صيدلية الصحة',
        category: 'صحة ودواء',
        matchScore: Math.min(92, 75 + experience * 2),
        investment: { min: 280000, max: 400000 },
        monthlyRevenue: 60000,
        roi: 22,
        paybackMonths: 28,
        whyRecommended: [
          budget >= 280000 ? '✓ ضمن نطاق ميزانيتك' : null,
          '✓ طلب مستمر على الأدوية',
          experience >= 2 ? '✓ يمكن الاعتماد على الصيادلة' : null,
          '✓ استقرار دخل أعلى'
        ].filter(Boolean),
        riskLevel: 'منخفض',
        supportLevel: 'جيد جداً',
        locations: ['الرياض', 'جدة', 'الدمام']
      }
    ].filter(r => {
      // Filter by budget
      if (r.investment.min > budget * 1.5) return false;
      // Filter by city if specified
      if (inputs.city && !r.locations.includes(inputs.city)) {
        r.matchScore -= 10;
      }
      return true;
    }).sort((a, b) => b.matchScore - a.matchScore);

    setResults(recommendations.slice(0, 3));
    setIsCalculating(false);
  };

  const resetCalculator = () => {
    setStep(1);
    setResults(null);
    setInputs({
      budget: '',
      city: '',
      experience: '',
      timeAvailability: '',
      category: '',
      riskTolerance: 'medium'
    });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-dark-1 mb-2">ما ميزانيتك للاستثمار؟</h3>
              <p className="text-dark-2/70">سنقترح فرنشايز تناسب إمكانياتك المالية</p>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="number"
                  value={inputs.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  placeholder="مثال: 200000"
                  className="w-full px-4 py-4 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-2/50">ريال</span>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {[100000, 200000, 300000, 500000, 1000000].map(amount => (
                  <button
                    key={amount}
                    onClick={() => handleInputChange('budget', amount.toString())}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      inputs.budget === amount.toString()
                        ? 'bg-primary text-dark-1'
                        : 'bg-gray-100 text-dark-2 hover:bg-gray-200'
                    }`}
                  >
                    {amount.toLocaleString()} ر.س
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-dark-1 mb-2">في أي مدينة تريد الاستثمار؟</h3>
              <p className="text-dark-2/70">سنتحقق من توفر الفرنشايز في منطقتك</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {cities.map(city => (
                <button
                  key={city}
                  onClick={() => handleInputChange('city', city)}
                  className={`p-4 rounded-xl text-center font-medium transition-all ${
                    inputs.city === city
                      ? 'bg-primary text-dark-1 ring-2 ring-primary'
                      : 'bg-gray-50 text-dark-2 hover:bg-gray-100'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
            <button
              onClick={() => handleInputChange('city', 'any')}
              className={`w-full p-4 rounded-xl text-center font-medium transition-all ${
                inputs.city === 'any'
                  ? 'bg-primary text-dark-1 ring-2 ring-primary'
                  : 'bg-gray-50 text-dark-2 hover:bg-gray-100'
              }`}
            >
              أي مدينة في السعودية
            </button>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-dark-1 mb-2">ما مستوى خبرتك في الأعمال؟</h3>
              <p className="text-dark-2/70">سنقترح فرنشايز تناسب خلفيتك</p>
            </div>
            <div className="space-y-3">
              {experienceLevels.map(level => (
                <button
                  key={level.value}
                  onClick={() => handleInputChange('experience', level.value)}
                  className={`w-full p-4 rounded-xl text-right flex items-center justify-between transition-all ${
                    inputs.experience === level.value
                      ? 'bg-primary text-dark-1 ring-2 ring-primary'
                      : 'bg-gray-50 text-dark-2 hover:bg-gray-100'
                  }`}
                >
                  <span className="font-medium">{level.label}</span>
                  {inputs.experience === level.value && <CheckCircle className="w-5 h-5" />}
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-dark-1 mb-2">كم ساعة يمكنك تكريسها أسبوعياً؟</h3>
              <p className="text-dark-2/70">بعض الفرنشايز تحتاج وقت أكثر من غيرها</p>
            </div>
            <div className="space-y-3">
              {timeOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleInputChange('timeAvailability', option.value)}
                  className={`w-full p-4 rounded-xl text-right flex items-center justify-between transition-all ${
                    inputs.timeAvailability === option.value
                      ? 'bg-primary text-dark-1 ring-2 ring-primary'
                      : 'bg-gray-50 text-dark-2 hover:bg-gray-100'
                  }`}
                >
                  <span className="font-medium">{option.label}</span>
                  {inputs.timeAvailability === option.value && <CheckCircle className="w-5 h-5" />}
                </button>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-dark-1 mb-2">أي قطاع يستهويك أكثر؟</h3>
              <p className="text-dark-2/70">اختر القطاع المفضل أو دع AI يختار لك</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleInputChange('category', cat)}
                  className={`p-4 rounded-xl text-center font-medium transition-all ${
                    inputs.category === cat
                      ? 'bg-primary text-dark-1 ring-2 ring-primary'
                      : 'bg-gray-50 text-dark-2 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <button
              onClick={() => handleInputChange('category', 'any')}
              className={`w-full p-4 rounded-xl text-center font-medium transition-all ${
                inputs.category === 'any'
                  ? 'bg-primary text-dark-1 ring-2 ring-primary'
                  : 'bg-gray-50 text-dark-2 hover:bg-gray-100'
              }`}
            >
              أي قطاع مربح
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return inputs.budget && parseInt(inputs.budget) >= 50000;
      case 2: return inputs.city !== '';
      case 3: return inputs.experience !== '';
      case 4: return inputs.timeAvailability !== '';
      case 5: return true;
      default: return false;
    }
  };

  // Don't render anything if not open (controlled by FloatingActionMenu)
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold">حاسبة الاستثمار الذكية</h2>
              <p className="text-white/70 text-sm">مدعومة بـ AI</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Progress */}
        {!results && (
          <div className="px-6 py-3 bg-gray-50 border-b">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-dark-2">الخطوة {step} من {totalSteps}</span>
              <span className="text-sm font-bold text-primary">{Math.round((step / totalSteps) * 100)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {!results ? (
            <>
              {isCalculating ? (
                <div className="text-center py-12">
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
                    <Brain className="absolute inset-0 m-auto w-10 h-10 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-dark-1 mb-2">AI يحلل بياناتك...</h3>
                  <p className="text-dark-2/70">نقارن بين 150+ فرنشايز لن encuentra الأنسب لك</p>
                </div>
              ) : (
                <>
                  {renderStep()}
                </>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-dark-1 mb-2">نتائج التحليل</h3>
                <p className="text-dark-2/70">
                  بناءً على ميزانية {parseInt(inputs.budget).toLocaleString()} ر.س وخبرتك
                </p>
              </div>

              {results.map((result, index) => (
                <div
                  key={result.id}
                  className={`rounded-2xl overflow-hidden ${
                    index === 0 
                      ? 'bg-gradient-to-r from-primary/20 to-primary/5 ring-2 ring-primary' 
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold ${
                          index === 0 ? 'bg-primary text-dark-1' : 'bg-gray-200 text-dark-2'
                        }`}>
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                        </div>
                        <div>
                          <h4 className="font-bold text-dark-1 text-lg">{result.name}</h4>
                          <p className="text-sm text-dark-2/70">{result.category}</p>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary">{result.matchScore}%</div>
                        <div className="text-xs text-dark-2/60">توافق</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                      <div className="bg-white rounded-lg p-2">
                        <div className="font-bold text-dark-1">{result.roi}%</div>
                        <div className="text-xs text-dark-2/60">العائد</div>
                      </div>
                      <div className="bg-white rounded-lg p-2">
                        <div className="font-bold text-dark-1">{result.paybackMonths}</div>
                        <div className="text-xs text-dark-2/60">شهر استرداد</div>
                      </div>
                      <div className="bg-white rounded-lg p-2">
                        <div className="font-bold text-dark-1">{result.investment.min.toLocaleString()}</div>
                        <div className="text-xs text-dark-2/60">الاستثمار</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {result.whyRecommended.map((reason, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-dark-2">
                          <Star className="w-4 h-4 text-primary flex-shrink-0" />
                          {reason}
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Link
                        to={`/profile/${result.id}`}
                        className={`flex-1 py-2.5 rounded-full font-bold text-center transition-colors ${
                          index === 0
                            ? 'bg-dark-1 text-white hover:bg-dark-2'
                            : 'bg-white border-2 border-dark-1 text-dark-1 hover:bg-dark-1 hover:text-white'
                        }`}
                      >
                        اعرف المزيد
                      </Link>
                      {index === 0 && (
                        <button className="flex-1 bg-primary text-dark-1 py-2.5 rounded-full font-bold hover:bg-primary/90 transition-colors">
                          احجز استشارة
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {!results && !isCalculating && (
          <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors ${
                step === 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-dark-2 hover:bg-gray-200'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
              السابق
            </button>
            
            {step === totalSteps ? (
              <button
                onClick={calculateRecommendations}
                disabled={!isStepValid()}
                className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-colors ${
                  isStepValid()
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-5 h-5" />
                احصل على التوصية
              </button>
            ) : (
              <button
                onClick={nextStep}
                disabled={!isStepValid()}
                className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-colors ${
                  isStepValid()
                    ? 'bg-dark-1 text-white hover:bg-dark-2'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                التالي
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {results && (
          <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
            <button
              onClick={resetCalculator}
              className="flex items-center gap-2 px-4 py-2 text-dark-2 hover:text-dark-1 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              إعادة الحساب
            </button>
            <Link
              to="/gallery"
              className="flex items-center gap-2 bg-primary text-dark-1 px-6 py-2 rounded-full font-bold hover:bg-primary/90 transition-colors"
            >
              <Calculator className="w-4 h-4" />
              استعرض كل الفرص
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInvestmentCalculator;
