import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

const partners = [
  { name: "Khalid Arena", src: "/Clip path group.png" },
  { name: "Partner 2", src: "/شعار فلافل قنا جديد 1.png" },
  { name: "Partner 3", src: "الشعار-المعتمد-الألوان-الرئيسية كثر رز 1.png" },
  { name: "Partner 4", src: "/g10.png" },
  { name: "Partner 5", src: "Clip path group (1).png" },
  { name: "Partner 6", src: "/g1.png" },
  { name: "Partner 7", src: "/Group.png" },
];

const Partners = () => {
  return (
    <section className="bg-light-3 py-20">
      <h3 className="text-center text-dark-2/60 text-sm font-medium mb-14 tracking-wider">
        شركاؤنا الموثوقون
      </h3>

      <Swiper
      
        modules={[Autoplay]}
        slidesPerView="auto"
        spaceBetween={40}
        loop={true}
        speed={4000}               // كل ما الرقم أكبر الحركة أنعم
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
        }}
        allowTouchMove={false}
        className="partners-swiper"
      >
        {partners.map((partner, index) => (
          <SwiperSlide
          
            key={index}
           style={{
    width: "260px",
    height: "140px",
  }}   // 👈 تحكم كامل في حجم اللوجو
            className="flex items-center justify-center"
          >
            <img
              src={partner.src}
              alt={partner.name}
              className=" max-w-full
    max-h-full
    object-contain
    opacity-70
    grayscale
    hover:opacity-100
    hover:grayscale-0
    transition"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Partners;
