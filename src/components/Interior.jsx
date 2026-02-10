import React from 'react';

const opportunities = [
  {
    id: 1,
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="8" r="4" />
        <path d="M20 21a8 8 0 1 0-16 0" />
        <path d="M12 14v2" />
        <path d="M15 17l3-3" />
        <path d="M9 17l-3-3" />
      </svg>
    ),
    title: 'الدعم اللوجستي وسلسل الإمداد',
    description: 'تأمين مصادر توريد المواد الخام والمعدات بأسعار تنافسية، وضمان استمرارية التوريد وفق المواصفات المعتمدة للعلامة التجارية.'
  },
  {
    id: 2,
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 8V4H8" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
        <path d="M9 18h3l5-10" />
        <path d="M6 15l3 3" />
        <path d="M18 13l2-2" />
      </svg>
    ),
    title: 'المساندة التسويقية والتقنية',
    description: 'وفير خطط تسويقية جاهزة وحملات إعلانية مركزة، بالإضافة إلى أنظمة تقنية وبرمجيات متطورة لإدارة المبيعات والعمليات بفعالية.'
  },
  {
    id: 3,
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    title: 'منح حقوق العلامة التجارية:',
    description: 'تزويد المستثمر بحق استخدام علامة تجارية معروفة وناجحة، مما يقلل من مخاطر الفشل التجاري ويسهل عملية كسب ثقة العملاء من اليوم الأول.'
  },
  {
    id: 4,
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 14l9-5-9-5-9 5 9 5z" />
        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
    title: 'نقل المعرفة والتدريب',
    description: 'قديم أدلة التشغيل التفصيلية وتدريب مكثف للمستثمر وفريقه على كيفية إدارة المشروع بنفس معايير الجودة العالمية للشركة الأم.'
  }
];

const Interior = () => {
  return (
    <section className=" py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            فرص الامتياز
          </h2>
          <p class="text-dark-2/70 max-w-2xl mx-auto leading-relaxed mb-1">فرص الامتياز هي نماذج تجارية تسمح لك بامتلاك وإدارة مشروع يحمل علامة تجارية معروفة، مقابل رسوم امتياز وتطبيق معايير الشركة الأم. بدلاً من أن تبدأ من الصفر، تحصل على اسم مشهور، نظام عمل جاهز، تدريب، ودعم تشغيل وتسويق مستمر.</p>
        </div>

        {/* Opportunities Grid - 2x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {opportunities.map((item) => (
            <div
              key={item.id}
              className="bg-[#e8e8e8] rounded-2xl p-6 text-right"
            >
              {/* Icon */}
              <div className="flex justify-start mb-4">
                <div className="w-12 h-12 rounded-full border border-gray-400 flex items-center justify-center text-dark-1">
                  {item.icon}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-dark-1 mb-3">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-dark-2/80 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Interior;
