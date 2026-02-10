import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import { Star, TrendingUp, MapPin, Calendar, ArrowLeft, Quote } from 'lucide-react';

const SuccessStoryPage = () => {
  const milestones = [
    { year: '2021', event: 'افتتاح أول فرع في الرياض' },
    { year: '2022', event: 'توسيع إلى 3 فروع' },
    { year: '2023', event: 'تحقيق ربح 40% زيادة' },
    { year: '2024', event: 'الفوز بجائزة أفضل امتياز' }
  ];

  const stats = [
    { value: '4', label: 'عدد الفروع' },
    { value: '2.5M', label: 'إجمالي الاستثمار' },
    { value: '45', label: 'عدد الموظفين' },
    { value: '180%', label: 'نمو الإيرادات' }
  ];

  return (
    <div className="min-h-screen bg-light-1">
      <SEO 
        title="قصة نجاح: من فرع واحد إلى امتياز وطني"
        description="اقرأ قصة نجاح أحمد الذي بدأ بفرع واحد وصار صاحب امتياز تجاري ناجح بـ4 فروع. تعرف على رحلته والنصائح التي يقدمها للمستثمرين الجدد."
        keywords="قصة نجاح فرنشايز, تجربة استثمار ناجحة, نجاح امتياز تجاري, ريادة الأعمال السعودية, استثمار ناجح"
        canonical="/blog/success-story-ahmed"
      />
      <Navigation />

      <article className="pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="text-sm text-dark-2 mb-6" aria-label="breadcrumb">
            <ol className="flex items-center gap-2">
              <li><Link to="/" className="hover:text-dark-1">الرئيسية</Link></li>
              <li>/</li>
              <li><Link to="/blog" className="hover:text-dark-1">المدونة</Link></li>
              <li>/</li>
              <li className="text-dark-1">قصة نجاح</li>
            </ol>
          </nav>

          {/* Hero */}
          <div className="text-center mb-12">
            <span className="inline-block bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-medium mb-4">
              قصة نجاح
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-dark-1 mb-4">
              من موظف حكومي إلى صاحب امتياز ناجح
            </h1>
            <p className="text-dark-2 text-lg max-w-2xl mx-auto">
              كيف حول أحمد استثماره 500 ألف ريال إلى امتياز بـ 4 فروع وإيرادات تتجاوز 3 ملايين سنوياً
            </p>
          </div>

          {/* Author Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-12 flex items-center gap-6">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center text-2xl font-bold text-dark-1">
              أ
            </div>
            <div>
              <h2 className="text-xl font-bold text-dark-1">أحمد العتيبي</h2>
              <p className="text-dark-2">صاحب امتياز - 4 فروع كوفي شوب</p>
              <div className="flex items-center gap-2 mt-2 text-sm text-dark-2">
                <MapPin className="w-4 h-4" />
                <span>الرياض، السعودية</span>
                <span>•</span>
                <Calendar className="w-4 h-4" />
                <span>3 سنوات خبرة</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-dark-2 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Quote */}
          <div className="bg-primary/10 rounded-2xl p-8 mb-12 relative">
            <Quote className="w-12 h-12 text-primary/30 absolute top-4 right-4" />
            <blockquote className="text-xl text-dark-1 text-center relative z-10">
              "أفضل قرار اتخذته في حياتي كان ترك الوظيفة الحكومية والاستثمار في الفرنشايز. 
              النظام المجرب والدعم المستمر منحاني الثقة والأمان لبناء مشروع ناجح."
            </blockquote>
          </div>

          {/* Story Content */}
          <div className="prose prose-lg max-w-none text-dark-1 space-y-6 mb-12">
            <h2 className="text-2xl font-bold text-dark-1">البداية: من الصفر</h2>
            <p className="leading-relaxed text-dark-2">
              كان أحمد يعمل موظفاً حكومياً في الرياض براتب شهري 12 ألف ريال. لطالما حلم بامتلاك 
              مشروعه الخاص، لكن الخوف من الفشل والمخاطر كان يمنعه. في عام 2021، قرر أخيراً 
              أن يتخذ الخطوة الأولى.
            </p>

            <p className="leading-relaxed text-dark-2">
              "بحثت كثيراً عن فرص استثمارية، ووجدت أن الفرنشايز هو الأنسب لشخص مثلي 
              لا يملك خبرة ريادية سابقة. اخترت علامة تجارية معروفة في مجال الكوفي شوب 
              لأن هذا المجال كان يشهد نمواً كبيراً في السعودية."
            </p>

            <h2 className="text-2xl font-bold text-dark-1 mt-8">الاستثمار الأولي</h2>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold mb-4">تفاصيل الاستثمار:</h3>
              <ul className="space-y-2 text-dark-2">
                <li>• رسوم الامتياز: 150,000 ريال</li>
                <li>• تجهيز الموقع: 200,000 ريال</li>
                <li>• المعدات والأثاث: 80,000 ريال</li>
                <li>• رأس المال العامل: 70,000 ريال</li>
                <li className="font-bold text-dark-1 pt-2 border-t">• الإجمالي: 500,000 ريال</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-dark-1 mt-8">التحديات والحلول</h2>
            <p className="leading-relaxed text-dark-2">
              لم تكن الرحلة سهلة. في الأشهر الأولى، واجه أحمد صعوبات في جذب العملاء 
              والتنافس مع المقاهي الموجودة. لكن بفضل الدعم من شركة الامتياز والتدريب 
              المستمر، تمكن من تطوير استراتيجيات تسويقية ناجحة.
            </p>

            <p className="leading-relaxed text-dark-2">
              "المفتاح كان في خدمة العملاء والجودة. في السعودية، إذا أعجب العميل بخدمتك، 
              سيخبر 10 من أصدقائه. والعكس صحيح. ركزت على تجربة العملاء أكثر من أي شيء آخر."
            </p>

            <h2 className="text-2xl font-bold text-dark-1 mt-8">مراحل النمو</h2>
            <div className="relative">
              <div className="absolute right-4 top-0 bottom-0 w-0.5 bg-primary/30"></div>
              {milestones.map((milestone, index) => (
                <div key={index} className="relative flex items-center gap-4 mb-6 mr-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold z-10">
                    {index + 1}
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm flex-1">
                    <span className="font-bold text-primary">{milestone.year}:</span>
                    <span className="text-dark-2 mr-2">{milestone.event}</span>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-dark-1 mt-8">النتائج الحالية</h2>
            <p className="leading-relaxed text-dark-2">
              اليوم، أصبح أحمد صاحب واحد من أنجح امتيازات الكوفي شوب في الرياض. 
              فروعه الأربعة تحقق إيرادات شهرية تتجاوز 250,000 ريال، ويعمل لديه أكثر من 45 موظفاً.
            </p>

            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <h3 className="font-bold text-green-800 mb-3">إنجازاته:</h3>
              <ul className="space-y-2 text-green-700">
                <li>• أفضل امتياز في المنطقة لعام 2024</li>
                <li>• نسبة رضا عملاء 95%</li>
                <li>• معدل زيادة سنوية 40%</li>
                <li>• خطط للتوسع إلى جدة والدمام</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-dark-1 mt-8">نصائح أحمد للمستثمرين الجدد</h2>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <ol className="space-y-4 text-dark-2 list-decimal list-inside">
                <li>
                  <span className="font-bold text-dark-1">اختر العلامة بعناية:</span>
                  <span className="block mr-6">بحث عن علامة لديها سمعة جيدة ودعم حقيقي للمستثمرين</span>
                </li>
                <li>
                  <span className="font-bold text-dark-1">الموقع هو كل شيء:</span>
                  <span className="block mr-6">لا تستعجل في اختيار الموقع. خذ وقتك لإيجاد المكان المناسب</span>
                </li>
                <li>
                  <span className="font-bold text-dark-1">ركز على الفريق:</span>
                  <span className="block mr-6">اختر موظفين ممتازين ودربهم جيداً. هم سر نجاحك</span>
                </li>
                <li>
                  <span className="font-bold text-dark-1">اصبر واحتسب:</span>
                  <span className="block mr-6">الشهور الستة الأولى هي الأصعب. لا تستسلم</span>
                </li>
                <li>
                  <span className="font-bold text-dark-1">استخدم التسويق الرقمي:</span>
                  <span className="block mr-6">تواجد قوي على انستغرام وسناب شات ضروري في السعودية</span>
                </li>
              </ol>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-dark-1 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-bold text-white mb-4">
              هل تريد كتابة قصة نجاحك؟
            </h3>
            <p className="text-white/80 mb-6">
              ابدأ رحلتك الاستثمارية اليوم وكن قصة النجاح القادمة
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
          <div className="border-t border-gray-200 mt-12 pt-8">
            <p className="text-dark-2 mb-4">شارك قصة النجاح:</p>
            <div className="flex gap-3">
              <button 
                onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent('قصة نجاح ملهمة في عالم الفرنشايز')}&url=${encodeURIComponent('https://franchisesgate.com/blog/success-story-ahmed')}`, '_blank')}
                className="bg-[#1DA1F2] text-white px-4 py-2 rounded-lg hover:opacity-90"
              >
                تويتر
              </button>
              <button 
                onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://franchisesgate.com/blog/success-story-ahmed')}`, '_blank')}
                className="bg-[#0A66C2] text-white px-4 py-2 rounded-lg hover:opacity-90"
              >
                لينكدإن
              </button>
              <button 
                onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent('قصة نجاح ملهمة: https://franchisesgate.com/blog/success-story-ahmed')}`, '_blank')}
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

export default SuccessStoryPage;
