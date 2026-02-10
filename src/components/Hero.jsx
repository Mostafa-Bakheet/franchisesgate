import React from 'react';
import { ArrowLeft, Star } from 'lucide-react';
import Marquee from 'react-marquee-slider';

const Hero = () => {
  const marqueeItems = Array.from({ length: 10 }).map((_, i) => (
    <span key={i} className="text-dark-1 font-bold text-sm mx-6">
      بوابة الامتيازات ★
    </span>
  ));

  return (
    <section className="relative w-full min-h-[600px] overflow-hidden bg-dark-1 pb-24 lg:pb-28">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/Office Meeting Scene 1.png"
          alt="Business Meeting"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-dark-1/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 pt-24 pb-32 flex flex-col text-right">
        {/* Avatar Stack with Rating */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex -space-x-3 space-x-reverse">
            <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden">
              <img src="/Frame 427320003.png" alt="Client" className="w-full h-full object-cover" />
            </div>
            <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden -mr-3">
              <img src="/Frame 427320002.png" alt="Client" className="w-full h-full object-cover" />
            </div>
            <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden -mr-3">
              <img src="/Frame 427320005.png" alt="Client" className="w-full h-full object-cover" />
            </div>
            <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden -mr-3">
              <img src="/Frame 427320004.png" alt="Client" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="text-right mr-2">
            <div className="flex items-center gap-1 justify-end mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
              <span className="text-white font-bold text-lg mr-2">1,760+</span>
            </div>
            <span className="text-white/80 text-sm">عميل راضٍ بخدماتنا</span>
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="text-2xl md:text-3xl lg:text-3xl font-bold text-white mb-6 leading-tight max-w-2xl">
          حول مشروعك الى فرنشايز ناجح
          <br />
          نجهز لك نظام امتياز احترافي يسرع توسعك ويزيد ارباح فروعك
        </h1>

        {/* Description */}
        <p className="text-white/80 text-lg mb-8 max-w-xl leading-relaxed">
          في تمكين امتيازات نساعد الشركات وزواد الاعمال على إطلاق وتطوير أنظمة الامتياز التجاري باحترافية من خلال خبرات متراكمة ونماذج تشغيل دقيقة وحلول مصممة لضمان أنفع المستدام
        </p>

        {/* CTA Buttons */}
        <div class="flex gap-3 flex-wrap">
  <button class="bg-primary text-dark-1 px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
      <path d="m12 19-7-7 7-7"></path>
      <path d="M19 12H5"></path>
    </svg>
    ابدأ الآن
  </button>

  <button class="border-2 border-white text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-white/10 transition-colors flex items-center gap-2">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
      <path d="m12 19-7-7 7-7"></path>
      <path d="M19 12H5"></path>
    </svg>
    احجز استشارتك
  </button>
</div>
      </div>

      {/* Bottom Green Strip – True Loop Marquee */}
      <div className="absolute bottom-0 left-0 right-0 bg-primary py-3 overflow-hidden">
        <Marquee velocity={45} resetAfterTries={1} >
          {/* نسخة أولى */}
          {marqueeItems}
          {/* نسخة ثانية مكررة لضمان loop سلس */}
          {marqueeItems}
        </Marquee>
      </div>
    </section>
  );
};

export default Hero;