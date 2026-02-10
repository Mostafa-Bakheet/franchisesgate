import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const services = [
  {
    id: 1,
    title: 'فحص العلامات التجارية',
    items: [
      'تحليل علامة المالك',
      'تسجيل علامة تجارية',
      'هندسة صنيو رقمية',
    ],
    image: '/Whisk_23a2aa534d1e794865444ee26b13b14adr 1 (1).png',
    imageAlt: 'خدمة فحص العلامات التجارية وتحليل علامة المالك',
    subtitle: 'مدرسة إسناد صغير',
  },
  {
    id: 2,
    title: 'التسويق لمانح الامتياز',
    items: [
      'الإدارة الأولى رقمي لتجربة العملاء',
      'هندسة صنيو رقمي للامتياز',
      'الإدارة الثالثة علامات وجهات تجمع',
    ],
    image: '/Whisk_226cfcf3b77194cb21f4b190d78e5aa5dr (1) 1 (1).png',
    subtitle: 'أرقى منصات فعاليات',
  },
  {
    id: 3,
    title: 'منظومة الامتياز الاحترافية',
    items: [
      'بناء الامتياز الجازي',
      'العقود عبر المنصة',
      'الاستشارات عن بعد',
    ],
    image: '/Whisk_2a36ba20b91e448849144b9b223eaf38dr 1 (1).png',
    subtitle: 'صناديق جاهز للتوسع',
  },
  {
    id: 4,
    title: 'الباقة الذهبية الشاملة',
    items: [
      'القطاع الخاصة للعلامة',
      'وثائق أنشطة تجارية',
      'سجلات منصة تجارية',
      '5 كويتة للمنصة مستمر',
      'دليل دلال منصاتين',
    ],
    image: '/Whisk_0f9636eac3c3778943e41f143ac09a4bdr 1.png',
    subtitle: 'منصة تواريخ إسناد صغير',
  },
  {
    id: 5,
    title: 'الباقة البروزنية المتكاملة',
    items: [
      'إعداد أنظمة الامتياز',
      'هندسة صنيو إدراجية',
      'الدليل المهندس الشامل',
    ],
    image: '/Whisk_eb9871ddd436a82888942a2198d98751dr (1) 1.png',
    subtitle: 'إسناد صنيو عبدالله',
  },
  {
    id: 6,
    title: 'الباقة الفضية المتكاملة',
    items: [
      'إعداد أنظمة الامتياز',
      'هندسة صنيو إدراجية',
    ],
    image: '/Whisk_d225b041da8f15a85184a40183e98912dr 1.png',
    subtitle: 'نظام تواريخ وتواريخ',
  },
  {
    id: 7,
    title: 'البرمجة وتقنية المعلومات',
    items: [
      'تصميم وبرامج الوظايفة',
      'تصميم تطبيقات كويتة',
      'تصميم ERP متكاملة',
    ],
    image: '/Whisk_7e5388ce7aa848291cd41ff9241bb3bcdr 1.png',
    subtitle: 'حلول برمجية متكاملة',
  },
  {
    id: 8,
    title: 'الإدارة الفنية المتكاملة',
    items: [
      'إعداد تواريخ دخول',
      'توجيه تشريح دخولية',
      'إعداد برامج عددانية',
    ],
    image: '/Whisk_a84330f3ac8a0faba4741cc2d7dd35fddr 1.png',
    subtitle: 'أنظمة منهاج ومناهج',
  },
  {
    id: 9,
    title: 'أعمال إنشاء وتشطيب',
    items: [
      'التشغيل الودي للمنصات',
      'تشغيل الدليل الودي',
    ],
    image: '/Whisk_cfd1f190ee2b8aca62d4337fe7395802dr 1.png',
    subtitle: 'التشغيل الودي الودي',
  },
  {
    id: 10,
    title: 'البرمجة وتقنية المعلومات',
    items: [
      'تصميم وبرامج الوظايفة',
      'تصميم تطبيقات كويتة',
      'تصميم ERP متكاملة',
    ],
    image: '/Whisk_23a2aa534d1e794865444ee26b13b14adr 1 (2).png',
    subtitle: 'حلول برمجية متكاملة',
  },
  {
    id: 11,
    title: 'الإدارة الفنية المتكاملة',
    items: [
      'إعداد تواريخ دخول',
      'توجيه تشريح دخولية',
      'إعداد برامج عددانية',
    ],
    image: '/Whisk_226cfcf3b77194cb21f4b190d78e5aa5dr (1) 1 (2).png',
    subtitle: 'أنظمة منهاج ومناهج',
  },
  {
    id: 12,
    title: 'فرص استثمار مطاعم',
    items: [
      'عروض ومنصات مستثمرين',
      'خطط إن اسناد',
    ],
    image: '/Whisk_2a36ba20b91e448849144b9b223eaf38dr 1 (2).png',
    subtitle: 'استثمار إفرادي مستثمر',
  },
];

const ServiceCard = ({ service }) => (
  <div className="bg-gradient-to-b from-primary/80 via-primary/40 to-white rounded-[24px] p-5 flex flex-col">
    {/* Title */}
    <h3 className="text-xl font-bold text-dark-1 text-right mb-4">
      {service.title}
    </h3>

    {/* Items List */}
    <ul className="space-y-2 mb-4 flex-1">
      {service.items.map((item, index) => (
        <li key={index} className="flex items-center gap-2 text-dark-2/80 text-sm text-right">
          <span className="w-1.5 h-1.5 bg-dark-1 rounded-full flex-shrink-0"></span>
          {item}
        </li>
      ))}
    </ul>

    {/* Image */}
    <div className=" rounded-[16px] p-4 mb-3 flex items-center justify-center h-40">
      <img
        src={service.image}
        alt={service.title}
        className="py-10 p-4"
      />
    </div>

    {/* Subtitle */}
    <p className="text-dark-2/60 text-xs text-center">
      {service.subtitle}
    </p>
  </div>
);

const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-light-1">
      <SEO 
        title="خدمات الامتياز التجاري | تأسيس وتطوير الفرنشايز"
        description="نقدم خدمات متكاملة لتأسيس نظام الامتياز التجاري، الاستشارات القانونية، التدريب، والتوسع الدولي. فريق متخصص لضمان نجاح مشروعك."
        keywords="خدمات فرنشايز, تأسيس امتياز تجاري, استشارات فرنشايز, تطوير علامة تجارية, نظام امتياز"
        canonical="/services"
      />
      <Navigation />

      {/* Header Section */}
      <section className="pt-28 pb-8">
        <div className="max-w-6xl mx-auto px-6">
          {/* Back Link */}
          <Link to="/" className="text-dark-2 hover:text-dark-1 text-sm mb-6 inline-block">
            ← العودة للرئيسية
          </Link>

          {/* Page Title */}
          <div className="text-center mb-4">
            <h1 className="text-4xl md:text-5xl font-bold text-dark-1 mb-4">
              الخدمات
            </h1>
            <p className="text-dark-2/70 max-w-2xl mx-auto">
              نقدم جميع الأنظمة المساندة لنماذج استثناء للمنصة التشغيلية لنظام الامتياز التجاري
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-8 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServicesPage;
