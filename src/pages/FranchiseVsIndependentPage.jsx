import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Check, X, ArrowLeft, TrendingUp, Shield, DollarSign, Clock } from 'lucide-react';

const ComparisonPage = () => {
  const features = [
    {
      feature: 'رأس المال المطلوب',
      franchise: 'يختلف حسب العلامة (100K - 2M ريال)',
      independent: 'أقل تكلفة أولية (50K - 500K ريال)',
      winner: 'independent',
      icon: DollarSign
    },
    {
      feature: 'نموذج العمل المجرب',
      franchise: 'نظام مثبت وناجح',
      independent: 'تجربة وتعلم من الأخطاء',
      winner: 'franchise',
      icon: Shield
    },
    {
      feature: 'الدعم والتدريب',
      franchise: 'تدريب شامل ودعم مستمر',
      independent: 'لا يوجد دعم خارجي',
      winner: 'franchise',
      icon: TrendingUp
    },
    {
      feature: 'العلامة التجارية',
      franchise: 'سمعة معروفة وثقة العملاء',
      independent: 'بناء السمعة من الصفر',
      winner: 'franchise',
      icon: Shield
    },
    {
      feature: 'حرية القرار',
      franchise: 'ت following نظام محدد',
      independent: 'حرية كاملة في القرارات',
      winner: 'independent',
      icon: TrendingUp
    },
    {
      feature: 'رسوم الرويالتي',
      franchise: 'نسبة شهرية/سنوية للمانح',
      independent: 'لا توجد رسوم',
      winner: 'independent',
      icon: DollarSign
    },
    {
      feature: 'وقت الإطلاق',
      franchise: 'أسرع (3-6 أشهر)',
      independent: 'أطول (6-12 شهر)',
      winner: 'franchise',
      icon: Clock
    },
    {
      feature: 'معدل النجاح',
      franchise: 'أعلى (90%+ نجاح)',
      independent: 'أقل (20% نجاح)',
      winner: 'franchise',
      icon: TrendingUp
    }
  ];

  return (
    <div className="min-h-screen bg-light-1">
      <SEO 
        title="فرنشايز vs مشروع مستقل | أيهما أفضل للاستثمار؟"
        description="مقارنة شاملة بين الامتياز التجاري والمشروع المستقل. تعلم الفروقات في التكاليف، المخاطر، العوائد، وأيهما يناسبك كمستثمر."
        keywords="فرنشايز vs مشروع مستقل, مقارنة الامتياز التجاري, استثمار فرنشايز, بدء مشروع تجاري, مزايا الفرنشايز"
        canonical="/blog/franchise-vs-independent"
      />
      <Navigation />

      <article className="pt-28 pb-16">
        <div className="max-w-5xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="text-sm text-dark-2 mb-6" aria-label="breadcrumb">
            <ol className="flex items-center gap-2">
              <li><Link to="/" className="hover:text-dark-1">الرئيسية</Link></li>
              <li>/</li>
              <li><Link to="/blog" className="hover:text-dark-1">المدونة</Link></li>
              <li>/</li>
              <li className="text-dark-1">فرنشايز vs مستقل</li>
            </ol>
          </nav>

          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-block bg-primary/20 text-dark-1 px-4 py-1 rounded-full text-sm font-medium mb-4">
              مقارنة استثمارية
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-dark-1 mb-4">
              فرنشايز vs مشروع مستقل: أيهما أفضل لك؟
            </h1>
            <p className="text-dark-2 text-lg max-w-2xl mx-auto">
              دليل المقارنة الشامل يساعدك في اختيار الطريق الأنسب لرحلتك الاستثمارية
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="text-3xl font-bold text-primary mb-2">90%</div>
              <div className="text-dark-2 text-sm">معدل نجاح الفرنشايز</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="text-3xl font-bold text-dark-1 mb-2">20%</div>
              <div className="text-dark-2 text-sm">معدل نجاح المشاريع المستقلة</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm">
              <div className="text-3xl font-bold text-green-500 mb-2">3-6</div>
              <div className="text-dark-2 text-sm">أشهر لإطلاق الفرنشايز</div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-12">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-1 text-white">
                  <tr>
                    <th className="py-4 px-6 text-right w-1/4">معيار المقارنة</th>
                    <th className="py-4 px-6 text-center w-3/8">
                      <div className="flex items-center justify-center gap-2">
                        <span className="bg-primary text-dark-1 px-3 py-1 rounded-full text-sm">الامتياز التجاري</span>
                      </div>
                    </th>
                    <th className="py-4 px-6 text-center w-3/8">
                      <div className="flex items-center justify-center gap-2">
                        <span className="bg-gray-200 text-dark-1 px-3 py-1 rounded-full text-sm">المشروع المستقل</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <tr key={index} className="border-b border-gray-100 last:border-0">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                              <Icon className="w-5 h-5 text-dark-1" />
                            </div>
                            <span className="font-semibold text-dark-1">{item.feature}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className={`p-3 rounded-lg ${item.winner === 'franchise' ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                            <div className="flex items-start gap-2">
                              {item.winner === 'franchise' && <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />}
                              <span className={item.winner === 'franchise' ? 'text-green-800' : 'text-dark-2'}>
                                {item.franchise}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className={`p-3 rounded-lg ${item.winner === 'independent' ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                            <div className="flex items-start gap-2">
                              {item.winner === 'independent' && <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />}
                              <span className={item.winner === 'independent' ? 'text-green-800' : 'text-dark-2'}>
                                {item.independent}
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* When to Choose What */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-dark-1" />
              </div>
              <h2 className="text-2xl font-bold text-dark-1 mb-4">اختر الفرنشايز إذا:</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-dark-2">تبحث عن استثمار أقل مخاطرة</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-dark-2">تريد بدء سريع مع دعم مستمر</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-dark-2">تفضل نظام عمل جاهز ومثبت</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-dark-2">تريد الاستفادة من سمعة علامة معروفة</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-dark-2">لديك رأس مال متوسط إلى عالي</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-dark-1" />
              </div>
              <h2 className="text-2xl font-bold text-dark-1 mb-4">اختر المشروع المستقل إذا:</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-dark-2">لديك فكرة فريدة ومبتكرة</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-dark-2">تريد حرية كاملة في القرارات</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-dark-2">رأس المال المحدود</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-dark-2">خبرة سابقة في نفس المجال</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-dark-2">تريد الاحتفاظ بجميع الأرباح</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Conclusion */}
          <div className="bg-dark-1 rounded-2xl p-8 text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">الخلاصة</h2>
            <p className="text-white/80 text-lg mb-6 max-w-3xl mx-auto">
              الامتياز التجاري هو الخيار الأفضل لمعظم المستثمرين المبتدئين بفضل دعم النظام المجرب 
              ومعدلات النجاح العالية. أما المشروع المستقل فيناسب رواد الأعمال المبتكرين 
              الذين يريدون بناء علامتهم الخاصة.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link 
                to="/gallery" 
                className="bg-primary text-dark-1 px-8 py-3 rounded-full font-bold hover:bg-primary/90 transition-colors"
              >
                استكشف الفرنشايز
              </Link>
              <Link 
                to="/blog/franchise-investment-guide" 
                className="border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition-colors"
              >
                اقرأ دليل الاستثمار
              </Link>
            </div>
          </div>

          {/* Share */}
          <div className="border-t border-gray-200 pt-8">
            <p className="text-dark-2 mb-4">شارك المقال:</p>
            <div className="flex gap-3">
              <button 
                onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('مقارنة رائعة بين الفرنشايز والمشروع المستقل')}&url=${encodeURIComponent('https://franchisegate.sa/blog/franchise-vs-independent')}`, '_blank')}
                className="bg-[#1DA1F2] text-white px-4 py-2 rounded-lg hover:opacity-90"
              >
                تويتر
              </button>
              <button 
                onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://franchisegate.sa/blog/franchise-vs-independent')}`, '_blank')}
                className="bg-[#0A66C2] text-white px-4 py-2 rounded-lg hover:opacity-90"
              >
                لينكدإن
              </button>
              <button 
                onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent('مقارنة رائعة: https://franchisegate.sa/blog/franchise-vs-independent')}`, '_blank')}
                className="bg-[#25D366] text-white px-4 py-2 rounded-lg hover:opacity-90"
              >
                واتساب
              </button>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default ComparisonPage;
