import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Users, 
  Store, 
  Award,
  MapPin,
  Quote,
  Star,
  ArrowLeft,
  Play,
  ChevronLeft,
  ChevronRight,
  Building2,
  BadgeCheck,
  Target,
  Globe
} from 'lucide-react';
import SEO from '../components/SEO';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const ClientsPage = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [animatedStats, setAnimatedStats] = useState({
    franchises: 0,
    investors: 0,
    cities: 0,
    successRate: 0
  });

  // Animation for stats
  useEffect(() => {
    const targetStats = { franchises: 150, investors: 320, cities: 25, successRate: 94 };
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setAnimatedStats({
        franchises: Math.floor(targetStats.franchises * progress),
        investors: Math.floor(targetStats.investors * progress),
        cities: Math.floor(targetStats.cities * progress),
        successRate: Math.floor(targetStats.successRate * progress)
      });
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { 
      icon: Store, 
      value: animatedStats.franchises, 
      suffix: '+', 
      label: 'فرنشايز ناجح',
      color: 'bg-blue-500'
    },
    { 
      icon: Users, 
      value: animatedStats.investors, 
      suffix: '+', 
      label: 'مستثمر سعيد',
      color: 'bg-green-500'
    },
    { 
      icon: MapPin, 
      value: animatedStats.cities, 
      suffix: '', 
      label: 'مدينة سعودية',
      color: 'bg-orange-500'
    },
    { 
      icon: TrendingUp, 
      value: animatedStats.successRate, 
      suffix: '%', 
      label: 'نسبة النجاح',
      color: 'bg-purple-500'
    }
  ];

  const testimonials = [
    {
      name: 'محمد العتيبي',
      role: 'مالك فرنشايز كوفي',
      location: 'الرياض',
      image: '/testimonial-1.jpg',
      quote: 'خلال 6 شهور فقط، حققنا عائد استثمار 35%. نظام بوابة الامتيازات ساعدنا في كل خطوة من الاختيار للافتتاح.',
      rating: 5,
      stats: { investment: '180K', roi: '35%', months: '6' }
    },
    {
      name: 'سارة الدوسري',
      role: 'مستثمرة - سلسلة مطاعم',
      location: 'جدة',
      image: '/testimonial-2.jpg',
      quote: 'الدعم الفني والتدريب المستمر كان مفتاح نجاحنا. الآن عندنا 3 فروع ونخطط للتوسع في المنطقة الشرقية.',
      rating: 5,
      stats: { investment: '450K', roi: '42%', months: '18' }
    },
    {
      name: 'فهد الشمري',
      role: 'مالك وكالة خدمات',
      location: 'الدمام',
      image: '/testimonial-3.jpg',
      quote: 'الحاسبة المالية ساعدتني أخطط بذكاء. توقعاتي كانت واقعية والنتائج أفضل من المتوقع بكثير.',
      rating: 5,
      stats: { investment: '120K', roi: '28%', months: '8' }
    }
  ];

  const successStories = [
    {
      franchise: 'كوفي لاونا',
      category: 'مقهى وكوفي شوب',
      owner: 'محمد العتيبي',
      startYear: 2023,
      branches: 3,
      investment: '180,000',
      revenue: '45,000',
      image: '/success-1.jpg',
      highlights: [
        'افتتاح أول فرع في 3 شهور',
        'تعافي سريع بعد الافتتاح',
        'قاعدة عملاء وفيّة',
        'خطط للفرع الرابع 2025'
      ]
    },
    {
      franchise: 'مطبخ زاد',
      category: 'مطعم وجبات سريعة',
      owner: 'عائلة الدوسري',
      startYear: 2022,
      branches: 5,
      investment: '350,000',
      revenue: '120,000',
      image: '/success-2.jpg',
      highlights: [
        'توسع من فرع إلى 5 فروع',
        '30+ موظف بدوام كامل',
        'شراكة مع تطبيقات التوصيل',
        'جائزة أفضل امتياز 2024'
      ]
    },
    {
      franchise: 'صيدلية الصحة',
      category: 'صيدلية ومنتجات صحية',
      owner: 'د. أحمد الغامدي',
      startYear: 2023,
      branches: 2,
      investment: '280,000',
      revenue: '65,000',
      image: '/success-3.jpg',
      highlights: [
        'ترخيص سريع من الهيئة',
        'شبكة موردين موثوقة',
        'نظام إدارة رقمي متكامل',
        'تخطيط للتوسع الإقليمي'
      ]
    }
  ];

  const partners = [
    { name: 'مطاعم السعودية', category: 'فنادق ومطاعم', count: 12 },
    { name: 'كوفي شوب', category: 'مقاهي', count: 28 },
    { name: 'صيدليات النهدي', category: 'صحة ودواء', count: 8 },
    { name: 'محلات عالمية', category: 'تجزئة', count: 15 },
    { name: 'خدمات توصيل', category: 'لوجستيات', count: 6 },
    { name: 'مراكز تجميل', category: 'صحة وجمال', count: 10 }
  ];

  const coverage = [
    { region: 'الرياض', branches: 45, growth: '+15%' },
    { region: 'جدة', branches: 38, growth: '+22%' },
    { region: 'الدمام', branches: 22, growth: '+18%' },
    { region: 'أبها', branches: 12, growth: '+30%' },
    { region: 'تبوك', branches: 8, growth: '+25%' },
    { region: 'القصيم', branches: 15, growth: '+12%' }
  ];

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-light-1">
      <SEO 
        title="عملاؤنا وقصص النجاح | بوابة الامتيازات"
        description="اكتشف قصص نجاح فرنشايزات سعودية حقيقية. 150+ فرنشايز ناجح، 320+ مستثمر سعيد، انتشار في 25 مدينة سعودية."
        keywords="عملاء بوابة الامتيازات، قصص نجاح فرنشايز، تجارب مستثمرين، فرنشايز ناجح السعودية"
        canonical="/clients"
      />
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-primary/10 via-light-1 to-blue-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block bg-primary/20 text-dark-1 px-4 py-2 rounded-full text-sm font-medium mb-6">
              شهادة نجاحنا
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-dark-1 mb-6">
              عملاؤنا يتحدثون عن <span className="text-primary">نجاحهم</span>
            </h1>
            <p className="text-xl text-dark-2/70 max-w-3xl mx-auto leading-relaxed">
              رحلة نجاح متكاملة مع 150+ فرنشايز ناجح في مختلف أنحاء المملكة. انضم لعائلة بوابة الامتيازات وابنِ مستقبلك.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index} 
                  className="bg-white rounded-2xl p-6 shadow-sm text-center hover:shadow-md transition-shadow"
                >
                  <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-dark-1 mb-1">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-sm text-dark-2/60">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark-1 mb-4">ماذا يقول عملاؤنا؟</h2>
            <p className="text-dark-2/70">تجارب حقيقية من مستثمرين حققوا النجاح معنا</p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-primary/5 to-blue-50 rounded-3xl p-8 md:p-12">
              <Quote className="w-12 h-12 text-primary/30 mb-6" />
              
              <div className="text-center">
                <p className="text-xl md:text-2xl text-dark-1 leading-relaxed mb-8">
                  "{testimonials[activeTestimonial].quote}"
                </p>

                {/* Stats Row */}
                <div className="flex justify-center gap-8 mb-6">
                  <div className="text-center">
                    <div className="text-xl font-bold text-primary">{testimonials[activeTestimonial].stats.investment}</div>
                    <div className="text-xs text-dark-2/60">رأس المال</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-500">{testimonials[activeTestimonial].stats.roi}</div>
                    <div className="text-xs text-dark-2/60">العائد</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-500">{testimonials[activeTestimonial].stats.months}</div>
                    <div className="text-xs text-dark-2/60">شهور</div>
                  </div>
                </div>

                {/* Author */}
                <div className="flex items-center justify-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {testimonials[activeTestimonial].name.charAt(0)}
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-dark-1">{testimonials[activeTestimonial].name}</div>
                    <div className="text-sm text-dark-2/70">{testimonials[activeTestimonial].role}</div>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-primary" />
                      <span className="text-xs text-dark-2/60">{testimonials[activeTestimonial].location}</span>
                    </div>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex justify-center gap-1 mt-4">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <button 
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-dark-1" />
            </button>
            <button 
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-dark-1" />
            </button>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === activeTestimonial ? 'bg-primary' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-primary/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark-1 mb-4">قصص النجاح</h2>
            <p className="text-dark-2/70">رحلات نجاح حقيقية من الفكرة إلى التوسع</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {successStories.map((story, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-primary/20 to-blue-100 flex items-center justify-center">
                  <Building2 className="w-16 h-16 text-primary/40" />
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs bg-primary/10 text-dark-1 px-3 py-1 rounded-full">
                      {story.category}
                    </span>
                    <span className="text-xs text-dark-2/60">منذ {story.startYear}</span>
                  </div>
                  
                  <h3 className="font-bold text-xl text-dark-1 mb-2">{story.franchise}</h3>
                  <p className="text-sm text-dark-2/70 mb-4">المالك: {story.owner}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="font-bold text-primary">{story.branches}</div>
                      <div className="text-xs text-dark-2/60">فروع</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="font-bold text-green-600">{story.investment}</div>
                      <div className="text-xs text-dark-2/60">استثمار</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2">
                      <div className="font-bold text-blue-600">{story.revenue}</div>
                      <div className="text-xs text-dark-2/60">شهري</div>
                    </div>
                  </div>

                  {/* Highlights */}
                  <ul className="space-y-2">
                    {story.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-dark-2">
                        <BadgeCheck className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark-1 mb-4">شركاء النجاح</h2>
            <p className="text-dark-2/70">فرنشايزات متنوعة حققت النجاح معنا</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {partners.map((partner, index) => (
              <div 
                key={index} 
                className="bg-gray-50 rounded-2xl p-6 text-center hover:bg-primary/5 transition-colors group"
              >
                <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-3 group-hover:shadow-md transition-shadow">
                  <Store className="w-8 h-8 text-primary/60" />
                </div>
                <div className="font-bold text-dark-1 text-sm mb-1">{partner.name}</div>
                <div className="text-xs text-dark-2/60 mb-2">{partner.category}</div>
                <div className="text-xs text-primary font-medium">{partner.count} فرنشايز</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage Map */}
      <section className="py-16 bg-dark-1">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">انتشارنا في المملكة</h2>
            <p className="text-white/70">فرنشايزاتنا منتشرة في 25 مدينة سعودية</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {coverage.map((city, index) => (
              <div key={index} className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
                <div className="font-bold text-white mb-1">{city.region}</div>
                <div className="text-2xl font-bold text-primary mb-1">{city.branches}</div>
                <div className="text-xs text-white/60">فرع</div>
                <div className="text-xs text-green-400 mt-2">{city.growth}</div>
              </div>
            ))}
          </div>

          {/* Map Visualization Placeholder */}
          <div className="mt-12 bg-white/5 rounded-3xl p-8 text-center">
            <Globe className="w-16 h-16 text-primary/40 mx-auto mb-4" />
            <p className="text-white/70">خريطة تفاعلية لانتشار الفرنشايزات قريباً</p>
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-yellow-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark-1 mb-4">جوائز واعتمادات</h2>
            <p className="text-dark-2/70">تقديرات حصلنا عليها لدعمنا لرواد الأعمال</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
              <Award className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="font-bold text-dark-1 mb-2">أفضل منصة فرنشايز</h3>
              <p className="text-sm text-dark-2/70">جائزة وزارة التجارة 2024</p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
              <Target className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-bold text-dark-1 mb-2">أعلى نسبة نجاح</h3>
              <p className="text-sm text-dark-2/70">94% نجاح الفرنشايز المدعومين</p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
              <BadgeCheck className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="font-bold text-dark-1 mb-2">اعتماد سعودي 100%</h3>
              <p className="text-sm text-dark-2/70">مرخصين من الهيئة العامة للاستثمار</p>
            </div>
          </div>
        </div>
      </section>

      {/* Video Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark-1 mb-4">فيديوهات النجاح</h2>
            <p className="text-dark-2/70">شاهد قصص النجاح بأسلوب مرئي</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative bg-gradient-to-br from-dark-1 to-dark-2 rounded-2xl overflow-hidden aspect-video group cursor-pointer">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-white ml-1" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <div className="font-bold text-white mb-1">رحلة محمد مع كوفي لاونا</div>
                <div className="text-sm text-white/70">من الفكرة إلى 3 فروع ناجحة</div>
              </div>
            </div>

            <div className="relative bg-gradient-to-br from-primary/80 to-primary rounded-2xl overflow-hidden aspect-video group cursor-pointer">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-white ml-1" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <div className="font-bold text-white mb-1">تجربة عائلة الدوسري</div>
                <div className="text-sm text-white/70">كيف بنوا إمبراطورية مطاعم؟</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-dark-1 mb-6">
            كن جزءاً من قصص نجاحنا القادمة
          </h2>
          <p className="text-dark-1/70 mb-8 text-lg">
            انضم لـ 320+ مستثمر نجحوا في تحقيق أحلامهم عبر الامتياز التجاري
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/gallery"
              className="inline-flex items-center justify-center gap-2 bg-dark-1 text-white px-8 py-4 rounded-full font-bold hover:bg-dark-2 transition-colors"
            >
              <Store className="w-5 h-5" />
              استعرض الفرص
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white text-dark-1 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              احجز استشارة مجانية
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ClientsPage;
