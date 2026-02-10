import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Scale, 
  FileText, 
  Award, 
  GraduationCap, 
  Calculator, 
  ChevronDown, 
  ChevronUp,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Shield,
  Users,
  Settings,
  ArrowLeft
} from 'lucide-react';
import SEO from '../components/SEO';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const SystemSetupPage = () => {
  const [openSection, setOpenSection] = useState('legal');
  const [calculatorInputs, setCalculatorInputs] = useState({
    franchiseFee: 50000,
    setupCost: 150000,
    monthlyRoyalty: 5,
    marketingFee: 2,
    expectedRevenue: 50000,
    operatingMonths: 12
  });

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const calculateTotal = () => {
    const initial = calculatorInputs.franchiseFee + calculatorInputs.setupCost;
    const monthlyFees = (calculatorInputs.expectedRevenue * (calculatorInputs.monthlyRoyalty + calculatorInputs.marketingFee)) / 100;
    const annualFees = monthlyFees * calculatorInputs.operatingMonths;
    return {
      initial,
      annual: annualFees,
      total: initial + annualFees
    };
  };

  const results = calculateTotal();

  const sections = [
    {
      id: 'legal',
      title: 'الإطار القانوني',
      icon: Scale,
      description: 'العقود، التراخيص، وحماية العلامة التجارية',
      content: [
        {
          title: 'عقد الامتياز التجاري',
          items: [
            'مدة العقد وشروط التجديد',
            'نطاق المنطقة الجغرافية',
            'رسوم الامتياز والشروط المالية',
            'التزامات الطرفين (المانح والمستثمر)',
            'شروط الفسخ والتسوية'
          ]
        },
        {
          title: 'التراخيص والتسجيل',
          items: [
            'تسجيل العلامة التجارية في السعودية',
            'ترخيص الامتياز التجاري من وزارة التجارة',
            'السجل التجاري الإلكتروني',
            'تراخيص البلدية والدفاع المدني'
          ]
        },
        {
          title: 'حماية الملكية الفكرية',
          items: [
            'تسجيل الاسم التجاري واللوجو',
            'حماية الأسرار التجارية',
            'براءات الاختراع والوصفات',
            'العقود مع الموظفين (NDA)'
          ]
        }
      ]
    },
    {
      id: 'operations',
      title: 'النموذج التشغيلي',
      icon: Settings,
      description: 'دليل التشغيل وأنظمة إدارة الفرنشايز',
      content: [
        {
          title: 'دليل التشغيل (Operations Manual)',
          items: [
            'إجراءات العمل اليومية خطوة بخطوة',
            'معايير الجودة والخدمة',
            'إدارة المخزون والتوريد',
            'معايير النظافة والسلامة',
            'التعامل مع الشكاوى'
          ]
        },
        {
          title: 'أنظمة الإدارة الرقمية',
          items: [
            'نظام نقاط البيع (POS) الموحد',
            'نظام إدارة العملاء (CRM)',
            'نظام إدارة المخزون',
            'التقارير والتحليلات اليومية',
            'التكامل مع التطبيقات الخارجية'
          ]
        },
        {
          title: 'إدارة الموارد البشرية',
          items: [
            'وصف الوظائف والمسؤوليات',
            'برامج التدريب للموظفين',
            'معايير التوظيف والاختيار',
            'نظام الحوافز والمكافآت',
            'التطوير الوظيفي المستمر'
          ]
        }
      ]
    },
    {
      id: 'quality',
      title: 'الجودة والمعايير',
      icon: Award,
      description: 'ضمان الجودة ومعايير الامتياز الموحدة',
      content: [
        {
          title: 'معايير الجودة الموحدة',
          items: [
            'مواصفات المنتج/الخدمة',
            'معايير العرض والتقديم',
            'مواصفات المواد الخام',
            'معايير التغليف والتخزين',
            'اختبارات الجودة الدورية'
          ]
        },
        {
          title: 'نظام الرقابة والتفتيش',
          items: [
            'الزيارات الميدانية الدورية',
            'تقييم أداء الفرنشيزي',
            'معايير تقييم المطابقة',
            'خطط التحسين المستمر',
            'إجراءات التصحيح والإنذار'
          ]
        },
        {
          title: 'شهادات الاعتماد',
          items: [
            'شهادات ISO المطلوبة',
            'اعتماد الجهات الحكومية',
            'شهادات الصحة والسلامة',
            'اعتماد الجمعيات المهنية'
          ]
        }
      ]
    },
    {
      id: 'training',
      title: 'التدريب والتطوير',
      icon: GraduationCap,
      description: 'برامج تدريبية شاملة للفرنشيزي',
      content: [
        {
          title: 'التدريب الأولي',
          items: [
            'دورة إدارة الفرنشايز (40 ساعة)',
            'تدريب عملي في مقر رئيسي (2-4 أسابيع)',
            'تدريب على الأنظمة الرقمية',
            'التعامل مع العملاء والمبيعات',
            'إدارة الماليات والمحاسبة'
          ]
        },
        {
          title: 'التدريب المستمر',
          items: [
            'ورش عمل شهرية',
            'تحديثات الأنظمة والمنتجات',
            'مؤتمرات الفرنشيزي السنوية',
            'برامج التدريب عن بُعد',
            'تبادل الخبرات بين الفروع'
          ]
        },
        {
          title: 'دعم الافتتاح',
          items: [
            'فريق دعم ميداني للافتتاح',
            'حملة تسويقية للإطلاق',
            'تدريب موظفي الفرع الجديد',
            'الإشراف على التشغيل الأول (30 يوم)'
          ]
        }
      ]
    },
    {
      id: 'technical',
      title: 'الدعم التقني',
      icon: Shield,
      description: 'الأنظمة الرقمية والبنية التحتية',
      content: [
        {
          title: 'البنية التحتية التقنية',
          items: [
            'نظام POS موحد مع دعم 24/7',
            'تطبيق إدارة الفرنشايز',
            'بوابة الموردين الإلكترونية',
            'نظام مراقبة الفروع (CCTV Cloud)',
            'النسخ الاحتياطي السحابي'
          ]
        },
        {
          title: 'التكامل الرقمي',
          items: [
            'ربط مع تطبيقات التوصيل',
            'بوابة الدفع الإلكتروني',
            'نظام الطلبات أونلاين',
            'تكامل مع برامج المحاسبة',
            'API للتوسعات المستقبلية'
          ]
        },
        {
          title: 'الأمان والحماية',
          items: [
            'تشفير البيانات (SSL)',
            'نظام صلاحيات متعدد المستويات',
            'النسخ الاحتياطي التلقائي',
            'الحماية من الاختراق',
            'التدقيق والمراقبة الأمنية'
          ]
        }
      ]
    }
  ];

  const checklists = [
    {
      title: 'قبل الافتتاح',
      items: [
        { text: 'تسجيل العلامة التجارية', done: false },
        { text: 'إعداد دليل التشغيل', done: false },
        { text: 'تجهيز الموقع والديكور', done: false },
        { text: 'تركيب الأنظمة الرقمية', done: false },
        { text: 'تدريب الفريق', done: false },
        { text: 'الحصول على التراخيص', done: false },
        { text: 'إطلاق حملة تسويقية', done: false }
      ]
    },
    {
      title: 'السنة الأولى',
      items: [
        { text: 'زيارات الرقابة الشهرية', done: false },
        { text: 'تقييم الأداء ربع سنوي', done: false },
        { text: 'تحديثات التدريب', done: false },
        { text: 'مراجعة العقود والتجديد', done: false },
        { text: 'توسيع القاعدة العملاء', done: false }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-light-1">
      <SEO 
        title="إعداد أنظمة الفرنشايز | دليل شامل لإنشاء امتياز تجاري ناجح"
        description="دليل متكامل لإعداد أنظمة الفرنشايز: الإطار القانوني، النموذج التشغيلي، معايير الجودة، التدريب، والدعم التقني. احسب تكلفة إعداد نظام فرنشايزك."
        keywords="إعداد فرنشايز، نظام امتياز تجاري، عقد فرنشايز، دليل تشغيل، معايير الجودة، تدريب فرنشايز"
        canonical="/system-setup"
      />
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-dark-1 via-dark-2 to-primary/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center">
            <span className="inline-block bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              دليل الإعداد الشامل
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              إعداد أنظمة الفرنشايز
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              من الفكرة إلى الافتتاح.. كل ما تحتاجه لبناء نظام امتياز تجاري احترافي وناجح في السعودية
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="text-3xl font-bold text-primary mb-1">5</div>
                <div className="text-white/70 text-sm">أنظمة رئيسية</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="text-3xl font-bold text-primary mb-1">50+</div>
                <div className="text-white/70 text-sm">معيار جودة</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="text-3xl font-bold text-primary mb-1">40h</div>
                <div className="text-white/70 text-sm">تدريب أولي</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="text-3xl font-bold text-primary mb-1">24/7</div>
                <div className="text-white/70 text-sm">دعم فني</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                <h3 className="font-bold text-dark-1 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  أقسام الدليل
                </h3>
                <nav className="space-y-2">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => toggleSection(section.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl text-right transition-colors ${
                          openSection === section.id 
                            ? 'bg-primary/10 text-dark-1' 
                            : 'hover:bg-gray-50 text-dark-2'
                        }`}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium text-sm">{section.title}</span>
                      </button>
                    );
                  })}
                </nav>

                <div className="mt-6 pt-6 border-t">
                  <Link
                    to="/calculator"
                    className="flex items-center gap-2 text-primary font-medium text-sm hover:underline"
                  >
                    <Calculator className="w-4 h-4" />
                    حاسبة التكاليف المتقدمة
                  </Link>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {sections.map((section) => {
                const Icon = section.icon;
                const isOpen = openSection === section.id;
                
                return (
                  <div 
                    key={section.id} 
                    className={`bg-white rounded-2xl shadow-sm overflow-hidden transition-all ${
                      isOpen ? 'ring-2 ring-primary/20' : ''
                    }`}
                  >
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full flex items-center justify-between p-6 text-right"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="text-right">
                          <h3 className="font-bold text-dark-1">{section.title}</h3>
                          <p className="text-sm text-dark-2/70">{section.description}</p>
                        </div>
                      </div>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-dark-2" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-dark-2" />
                      )}
                    </button>
                    
                    {isOpen && (
                      <div className="px-6 pb-6 border-t pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {section.content.map((subsection, idx) => (
                            <div key={idx} className="bg-gray-50 rounded-xl p-4">
                              <h4 className="font-bold text-dark-1 mb-3 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-primary" />
                                {subsection.title}
                              </h4>
                              <ul className="space-y-2">
                                {subsection.items.map((item, itemIdx) => (
                                  <li key={itemIdx} className="flex items-start gap-2 text-sm text-dark-2">
                                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Cost Calculator Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark-1 mb-4">حاسبة تكاليف إعداد النظام</h2>
            <p className="text-dark-2/70">احسب التكلفة التقديرية لإعداد نظام فرنشايزك</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calculator Inputs */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="font-bold text-dark-1 mb-6 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary" />
                البيانات المدخلة
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark-2 mb-1">رسوم الامتياز (ريال)</label>
                  <input
                    type="number"
                    value={calculatorInputs.franchiseFee}
                    onChange={(e) => setCalculatorInputs({...calculatorInputs, franchiseFee: Number(e.target.value)})}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-2 mb-1">تكاليف التأسيس (ريال)</label>
                  <input
                    type="number"
                    value={calculatorInputs.setupCost}
                    onChange={(e) => setCalculatorInputs({...calculatorInputs, setupCost: Number(e.target.value)})}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-2 mb-1">نسبة الروalties (%)</label>
                    <input
                      type="number"
                      value={calculatorInputs.monthlyRoyalty}
                      onChange={(e) => setCalculatorInputs({...calculatorInputs, monthlyRoyalty: Number(e.target.value)})}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-2 mb-1">رسوم التسويق (%)</label>
                    <input
                      type="number"
                      value={calculatorInputs.marketingFee}
                      onChange={(e) => setCalculatorInputs({...calculatorInputs, marketingFee: Number(e.target.value)})}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-2 mb-1">الإيرادات المتوقعة/شهر</label>
                    <input
                      type="number"
                      value={calculatorInputs.expectedRevenue}
                      onChange={(e) => setCalculatorInputs({...calculatorInputs, expectedRevenue: Number(e.target.value)})}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-2 mb-1">أشهر التشغيل</label>
                    <input
                      type="number"
                      value={calculatorInputs.operatingMonths}
                      onChange={(e) => setCalculatorInputs({...calculatorInputs, operatingMonths: Number(e.target.value)})}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="bg-dark-1 rounded-2xl p-6 text-white">
              <h3 className="font-bold mb-6 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                النتائج التقديرية
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-white/10 rounded-xl">
                  <span>التكلفة الأولية</span>
                  <span className="text-2xl font-bold text-primary">{results.initial.toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-white/10 rounded-xl">
                  <span>الرسوم السنوية المتوقعة</span>
                  <span className="text-2xl font-bold text-primary">{results.annual.toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-primary/20 rounded-xl border-2 border-primary">
                  <span className="font-bold">إجمالي التكلفة السنة الأولى</span>
                  <span className="text-3xl font-bold">{results.total.toLocaleString()} ر.س</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-white/5 rounded-xl">
                <p className="text-sm text-white/70">
                  <AlertCircle className="w-4 h-4 inline ml-2" />
                  هذه الأرقام تقديرية فقط. التكاليف الفعلية قد تختلف حسب نوع النشاط والموقع.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Checklists Section */}
      <section className="py-16 bg-primary/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark-1 mb-4">قوائم التحقق</h2>
            <p className="text-dark-2/70">تأكد من إنجاز كل البنود قبل الافتتاح وخلال السنة الأولى</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {checklists.map((checklist, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-dark-1 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  {checklist.title}
                </h3>
                <div className="space-y-3">
                  {checklist.items.map((item, itemIdx) => (
                    <label key={itemIdx} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        defaultChecked={item.done}
                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-dark-2 group-hover:text-dark-1 transition-colors">
                        {item.text}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-dark-1">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            جاهز لتحويل عملك إلى فرنشايز ناجح؟
          </h2>
          <p className="text-white/70 mb-8 text-lg">
            فريقنا متخصص في إعداد أنظمة الامتياز التجاري من الألف إلى الياء
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-primary text-dark-1 px-8 py-4 rounded-full font-bold hover:bg-primary/90 transition-colors"
            >
              <Users className="w-5 h-5" />
              استشارة مجانية
            </Link>
            <Link
              to="/gallery"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-dark-1 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              استعرض الفرص
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SystemSetupPage;
