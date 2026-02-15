import React from 'react';

const systems = [
  {
    id: 1,
    image: 'Whisk_6dd298a7d0c0c229ec3491c6e3664b11dr 1.png',
    description: 'بناء الأنظمة المتابعة والتقارير لقياس الأداء وتحسين العمليات.'
  },
  {
    id: 2,
    image: 'Whisk_6dd298a7d0c0c229ec3491c6e3664b11dr 1 (1).png',
    description: 'تصميم الهيكل الإداري وتوصيف الوظائف والصلاحيات.'
  },
  {
    id: 3,
    image: 'Whisk_6dd298a7d0c0c229ec3491c6e3664b11dr 1 (2).png',
    description: 'إعداد السياسات والإجراءات التشغيلية (SOPs) لتنظيم العمل وضمان الجودة.'
  }
];

const SystemSetup = () => {
  return (
    <section className="bg-light-1 pt-5">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            إعداد الأنظمة
          </h2>
          <p className='text-dark-2/70 max-w-2xl mx-auto leading-relaxed mb-1'>
        نقدّم خدمة إعداد منظومة الامتياز التجاري (الفرنشايز) بشكل متكامل، وتشمل اتفاقية منح الامتياز ووثيقة الإفصاح والدليل التشغيلي و جاهزة للاعتماد والتطبيق.</p>
          
        </div>

        {/* Systems Grid - 3 columns with dividers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {systems.map((system, index) => (
            <div 
              key={system.id} 
              className={`flex flex-col items-center text-center px-8 py-4 ${
                index < systems.length - 1 ? '' : ''
              }`}
            >
              {/* Isometric Illustration */}
              <div className="mb-8 w-full flex justify-center">
                <img 
                  src={system.image} 
                  alt=""
                  className="w-48 h-48 object-cover"
                />
              </div>
              
              {/* Description */}
              <p className="text-black-400 text-lg leading-relaxed md:border-l border-gray-300">
                {system.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Brand Success Story Section */}
      <div className="bg-[#a8f0c0] mt-20 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Content */}
            <div className="text-right">
              <p className="text-sm text-dark-2/60 mb-2">تطوير الامتياز التجاري الفرنشايز 
</p>
              <h3 className="text-3xl md:text-4xl font-bold text-black mb-6 leading-tight">
إحدى أبرز العلامات التجارية زاد
 انتشارها بعد إعداد منظومة
 الامتياز التجاري (الفرنشايز)
 بالكامل من قِبل بوابة الامتيازات              </h3>
              <p className="text-dark-2/80 text-sm leading-relaxed mb-8">
نطوّر منظومة الامتياز التجاري 
من الصفر… لين تصير جاهزة للتوسع
 والانتشار.              </p>
              <button className="bg-black text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2 ">
                اقرأ دراسة الحالة الكاملة
                <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
            {/* Restaurant Image */}
            <div className="rounded-3xl overflow-hidden">
              <img 
                src="/Whisk_554fe5053c4db958c9342f7bd58c8864dr 1 (1).png" 
                alt="Restaurant Interior"
                className="w-full h-[400px] object-cover"
              />
            </div>

          
          </div>
        </div>
      </div>
    </section>
  );
};

export default SystemSetup;
