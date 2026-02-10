import React from 'react';
import { MapPin, Phone, Mail, ArrowUp, ChevronRight } from 'lucide-react';
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
  FaTiktok,
  FaSnapchatGhost,
  FaPinterestP,
  FaWhatsapp,
  FaTelegramPlane,
  FaDiscord,
  FaRedditAlien,
  FaGithub,
  FaBehance,
  FaDribbble,
} from "react-icons/fa";

import { BsThreads } from "react-icons/bs";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="text-white">
      {/* CTA Section */}
      <div className="bg-[#7bfeca] relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            

            {/* Content */}
            <div className="text-right">
              <h2 className="text-4xl md:text-5xl font-bold text-dark-1 mb-4 leading-tight">
                جاهز لبدء رحلة الامتياز التجاري؟
              </h2>
              <p className="text-dark-2/80 mb-8 text-lg">
                نساعدك تبني نظام امتياز قوي وقابل للتوسع
              </p>
              <button className="bg-dark-1 text-white px-6 py-3 rounded-full font-semibold hover:bg-dark-2 transition-colors flex items-center gap-2">
                <Phone className="w-5 h-5" />
                احجز الآن
              </button>
            </div>
            {/* Building Image */}
            <div className="relative h-80 rounded-2xl overflow-hidden">
              <img 
                src="/Whisk_2fef9ce090ef574b93e4c2ba0394e512dr 2.png" 
                alt="Building Exterior"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-[#1a1a1a] py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Logo & Description */}
            <div className="md:col-span-3 md:-mt-[50px]" >
              
              <div className="mb-4">
                <img src="/479569041_1354548969035761_60393241c 1.png" alt="Franchises Gate" className="h-21 w-auto" />
              </div>
              <p className="text-white/60 text-xs leading-relaxed mb-4">
                نحن نؤمن بأن نجاحنا مرتبط بنجاح شركائنا وعملائنا، في هذه الصفحة، ستجدون تجارب حقيقية وآراء عاصفة من الذين خاضوا رحلة تمكين الامتياز التجاري.
              </p>
            </div>

            {/* روابط سريعة */}
            <div className="md:col-span-2">
              <h4 className="font-bold text-sm mb-4 text-white/90 min-h-[24px] flex items-center">روابط سريعة</h4>
              <ul className="space-y-2 text-white/60 text-xs">
                <li><a href="#" className="hover:text-white transition-colors flex items-center gap-1"><ChevronRight className="w-3 h-3" />من نحن</a></li>
                <li><a href="#" className="hover:text-white transition-colors flex items-center gap-1"><ChevronRight className="w-3 h-3" />خدماتنا</a></li>
                <li><a href="#" className="hover:text-white transition-colors flex items-center gap-1"><ChevronRight className="w-3 h-3" />دراسات الحالة</a></li>
                <li><a href="#" className="hover:text-white transition-colors flex items-center gap-1"><ChevronRight className="w-3 h-3" />المحتوى</a></li>
                <li><a href="#" className="hover:text-white transition-colors flex items-center gap-1"><ChevronRight className="w-3 h-3" />تواصل معنا</a></li>
              </ul>
            </div>

            {/* الخدمات */}
            <div className="md:col-span-2">
              <h4 className="font-bold text-sm mb-4 text-white/90 min-h-[24px] flex items-center">الخدمات</h4>
              <ul className="space-y-2 text-white/60 text-xs">
                <li><a href="#" className="hover:text-white transition-colors">• إعداد أنظمة الامتياز</a></li>
                <li><a href="#" className="hover:text-white transition-colors">• إعداد دليل التشغيل</a></li>
                <li><a href="#" className="hover:text-white transition-colors">• تطوير نموذج العمل</a></li>
                <li><a href="#" className="hover:text-white transition-colors">• دعم وتشغيل أصحاب الامتياز</a></li>
                <li><a href="#" className="hover:text-white transition-colors">• الاستشارات التوسع</a></li>
              </ul>
            </div>

            {/* تواصل معنا */}
            <div className="md:col-span-2">
              <h4 className="font-bold text-sm mb-4 text-white/90 min-h-[24px] flex items-center">تواصل معنا</h4>
      

              <div className="space-y-2 text-white/60 text-xs">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-white/40" />
                  <span dir="ltr">+966 562 959 007</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-white/40" />
                  <span>info@nft.com.sa</span>
                </div>
              </div>
              <div>

                  <div className="flex items-center gap-2 py-3">
                    <FaFacebookF className="hover:text-blue-600 cursor-pointer transition" />
<FaInstagram className="hover:text-pink-500 cursor-pointer transition" />
<FaTwitter className="hover:text-sky-400 cursor-pointer transition" />
<FaLinkedinIn className="hover:text-blue-500 cursor-pointer transition" />
<FaWhatsapp className="hover:text-green-500 cursor-pointer transition" />

                </div>
              </div>
            </div>
            {/* تواصل معنا */}
            <div className="md:col-span-3">
              
              <p className="text-white/60 text-xs leading-relaxed mb-4">
                اشترك في النشرة الوريدية للحصول على أحدث النصائح والأدوات لبناء وتنظيم نظام امتياز تجاري ناجح.
              </p>
              <div className="flex gap-2 mb-6">
                <input 
                  type="email" 
                  placeholder="example@email.com" 
                  className="flex-1 bg-white rounded-lg px-3 py-2 text-sm text-dark-1 placeholder:text-gray-400"
                />
                <button className="bg-[#a8f0c0] text-dark-1 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#90e0a8] transition-colors">
                  اشترك الآن
                </button>
              </div>
              
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-[#2a2a2a] h-48 relative">
        <div className="absolute inset-0 flex items-center justify-center text-white/40 text-sm">
          <MapPin className="w-6 h-6 mr-2" />
          خريطة الموقع
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#1a1a1a] border-t border-white/10 py-4">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-2">
          <p className="text-white/40 text-xs">
            ©2026 by National Franchise. Powered and secured by National Franchise
          </p>
        </div>
      </div>

      {/* Scroll to Top */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-8 left-8 w-12 h-12 bg-[#a8f0c0] text-dark-1 rounded-full flex items-center justify-center shadow-lg hover:bg-[#90e0a8] transition-colors z-50"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </footer>
  );
};

export default Footer;
