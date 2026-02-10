import React from 'react';
      import { Link } from 'react-router-dom';

const services = [
  {
    id: 1,
    title: 'إعداد الأنظمة الامتياز',
    bulletPoints: [
      'الباقة(أ): الفرنشايز الأساسية',
      'باقة(ب): جاهزية الإطلاق للفرنشايز',
      'باقة(ت): باقة حوكمة وتشغيل الامتياز'
    ],
    image: '/Whisk_23a2aa534d1e794865444ee26b13b14adr 1.png',
    description: 'باقات متعددة، لتناسب منشآتك مهما كان حجمها وتواكب نموها خطوة بخطوة.'
  },
  {
    id: 2,
    title: 'فرص الامتياز',
    bulletPoints: [
      'محلي',
      'أجنبي'
    ],
    image: '/Whisk_226cfcf3b77194cb21f4b190d78e5aa5dr (1) 1.png',
    description: 'باقات متعددة، لتناسب منشآتك مهما كان حجمها وتواكب نموها خطوة بخطوة.'
  },
  {
    id: 3,
    title: 'الخدمات المساندة',
    bulletPoints: [
      'الهوية البصرية',
      'تسجيل العلامة والاسم التجاري'
    ],
    image: '/Whisk_2a36ba20b91e448849144b9b223eaf38dr 1.png',
    description: 'باقات متعددة، لتناسب منشآتك مهما كان حجمها وتواكب نموها خطوة بخطوة.'
  }
];

const ServiceCard = ({ service }) => (
  <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-primary/80 via-primary/40 to-white hover:shadow-xl transition-shadow flex flex-col">
    {/* Content Container */}
    <div className="p-4 flex flex-col h-full">
      {/* Title */}
      <h3 className="text-xl font-bold text-dark-1 text-right mb-2">
        {service.title}
      </h3>

      {/* Bullet Points */}
      <ul className="text-right mb-4 space-y-1 flex-grow">
        {service.bulletPoints.map((point, index) => (
          <li key={index} className="flex items-center gap-2 text-dark-2/80 text-sm text-right">
              <span className="w-1.5 h-1.5 bg-dark-1 rounded-full flex-shrink-0"></span>
            <span >{point}</span>
            
            
          </li>
        ))}
      </ul>

    {/* Image */}
<div className="relative w-full h-64 mb-3">
  <img
    src={service.image}
    alt={service.title}
    className="w-full h-full object-cover rounded-xl"
  />
</div>


      {/* Description */}
      <p className="text-dark-2/80 text-center text-sm leading-snug">
        {service.description}
      </p>
    </div>
  </div>
);

const MenuCards = () => {
  return (
    <section className="bg-light-1 py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-dark-1 mb-2">
            الخدمات المقدمة من قبل بوابة الامتيازات
          </h2>
          <p className="text-dark-2/70 max-w-2xl mx-auto leading-relaxed mb-1">
            إعداد جميع انظمة الامتياز التجاري استناداً للائحة التنفيذية لنظام الامتياز التجاري
          </p>
          <p className="text-dark-2/70 text-sm">
            (مطعم - مغسلة - محطة - كوفي ..... )
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* View More Button */}

<div className="text-center mt-10">
  <Link
    to="/services"
    className="bg-dark-1 text-white px-10 py-3 rounded-full font-semibold hover:bg-dark-2 transition-colors inline-block"
  >
    شاهد المزيد
  </Link>
</div>
      </div>
    </section>
  );
};

export default MenuCards;
