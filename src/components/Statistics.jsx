import React from 'react';
import { Globe, MapPin, Users, DollarSign } from 'lucide-react';

const stats = [
  { 
    icon: '/analytics-up.png',
    value: '+200',
    label: 'امتياز مباع',
    bgColor: 'bg-white'
  },
  { 
    icon: '/Frame 427320725.png',
    value: '380+',
    label: 'عملاء راضيون',
    bgColor: 'bg-white'
  },
  { 
    icon: 'rocket.png',
    value: '+30',
    label: 'مشاريع قائمة',
    bgColor: 'bg-white'
  },
  { 
    icon: '/user-group.png',
    value: '+60',
    label: 'شركاء ذهبيون',
    bgColor: 'bg-white'
  },
    { 
    icon: '/store-add-02.png',
    value: '+10',
    label: 'معارض',
    bgColor: 'bg-white'
  }
];


const Statistics = () => {
  return (
    <section className="bg-white-1 py-16 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, #9CFFC2 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-black text-center mb-12 leading-relaxed">
انجازاتنا        </h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className=" rounded-2xl p-6 text-center border border-white/10 hover:border-primary/50 transition-colors"
            >
              {/* Icon Circle */}
              {/* Icon Circle */}
<div
  className={`
    w-16 h-16 rounded-full
    flex items-center justify-center
    mx-auto mb-4
    ${stat.bgColor}
    shadow-md
  `}
>
  <img
    src={stat.icon}
    alt={stat.label}
    className="w-8 h-8 object-contain"
    loading="lazy"
  />
</div>

              
              {/* Value */}
              <div className="text-4xl font-bold text-black mb-2">
                {stat.value}
              </div>
              
              {/* Label */}
              <div className="text-black/70 text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
