import React, { useState } from 'react';
import { ChevronDown, Star, Quote } from 'lucide-react';

const faqItems = [
  {
    question: 'كم يستغرق إعداد نظام الامتياز التجاري؟',
    answer: 'عادةً يستغرق إعداد نظام الامتياز التجاري ما بين 4 إلى 8 أسابيع، حسب حجم المشروع وتعقيد العمليات المطلوبة.',
  },
  {
    question: 'ماذا لو لم يكن مشروعي جاهزًا للامتياز بعد؟',
    answer: 'لا مشكلة، يمكنك البدء بخطة إعداد تدريجية، وسنساعدك على تجهيز مشروعك للامتياز عند جاهزيته.',
  },
  {
    question: 'هل الخدمات التي تقدمونها آمنة وسرية؟',
    answer: 'نعم، نضمن الحفاظ على سرية بيانات عملائنا ونطبق أعلى معايير الأمان لحماية المعلومات.',
  },
  {
    question: 'كيف تعملون بالضبط؟',
    answer: 'نقوم بتحليل مشروعك، تصميم خطة الامتياز، إعداد الوثائق القانونية والتشغيلية، ثم تقديم الدعم المستمر لإطلاق الامتياز.',
  },
  {
    question: 'هل تعملون مع جميع أنواع المشاريع؟',
    answer: 'نعم، نحن نعمل مع معظم أنواع المشاريع سواء كانت صغيرة أو متوسطة، مع دراسة كل حالة لضمان نجاح نموذج الامتياز.',
  },
  {
    question: 'من يتولى إعداد وثائق الامتياز؟',
    answer: 'فريقنا المتخصص في الامتيازات التجارية يتولى إعداد جميع الوثائق القانونية والتشغيلية لضمان الامتثال الكامل.',
  }
];

const testimonials = [
  {
    id: 1,
    name: 'طلال الحويجي',
    role: 'رائد أعمال',
    content: '"تجربتي معهم كانت أكثر من ممتازة. الفريق ساعدني أفهم كل تفاصيل الامتياز ووفروا لي استشارات واضحة ساعدتني أتخذ القرار الصحيح بثقة."',
    rating: 5,
  },
  {
    id: 2,
    name: 'محمد المالكي',
    role: 'مالك مطعم المالكي',
    content: '"خدمتهم احترافية وسريعة. قدرت من خلالهم اختار الامتياز اللي يناسبني بدون تعقيد أو معلومات ناقصة. أنصح أي شخص يبغى يدخل عالم الفرنشايز يتعامل معهم."',
    rating: 4,
  },
  {
    id: 3,
    name: 'عبدالله الضريفي',
    role: 'رجل أعمال',
    content: '"سرعة الاستجابة والمتابعة عندهم شيء يذكر ويشكر. مهما كان السؤال يردون بسرعة ويعطونك معلومات صحيحة ومفيدة."',
    rating: 5,
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-[#e0f2f0] pt-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Title and Description - Right Side */}
          <div className="text-right pt-4">
            <h2 className="text-4xl md:text-5xl font-bold text-dark-1 mb-6">
              الأسئلة الشائعة
            </h2>
            <p className="text-dark-2/70 leading-relaxed">
              نقدم لك إجابات واضحة لأكثر الأسئلة التي نسمعها من أصحاب المشاريع الراغبين في التوسع عبر نظام الامتياز التجاري، لتفهم رحلتك معنا بكل سهولة وثقة.
            </p>
          </div>
          {/* FAQ Items - Left Side */}
          <div className="bg-white rounded-3xl p-3">
            <div className="space-y-3">
              {faqItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-[#d4eae7] rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-right hover:bg-[#c5e0dc] transition-colors"
                  >
                    <span className="font-medium text-dark-1">{item.question}</span>
                    <span className="text-2xl font-light text-dark-1">+</span>
                  </button>
                  {openIndex === index && (
                    <div className="px-6 pb-4 text-right">
                      <p className="text-dark-2/80 text-sm">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white py-20 mt-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header Text */}
          <h2 class="text-4xl md:text-5xl font-bold text-black mb-4 text-center">آراء عملائنا</h2>
          <p className="text-gray-400 text-center text-sm leading-relaxed max-w-3xl mx-auto mb-12">
            نحن نؤمن بأن نجاحنا مرتبط بنجاح شركائنا وعملائنا، في هذه الصفحة، ستجدون تجارب حقيقية وآراء عاصفة من الذين خاضوا رحلة تمكين الامتياز التجاري. دعم مراحل النمو، كل تجربة تعكس التزامنا بتمكين الاستثمار الراغبين والمشاركة حقيقية حول مبتكرين.
          </p>

          {/* Testimonials Carousel */}
          <div className="relative">
            {/* Left Arrow */}
            <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-dark-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-[#e8e8e8] rounded-[24px] p-6 text-right">
                  {/* Stars */}
                  <div className="flex justify-start gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Name */}
                  <h4 className="text-xl font-bold text-dark-1 mb-1">{testimonial.name}</h4>
                  
                  {/* Role */}
                  <span className="text-sm text-gray-500 block mb-4">{testimonial.role}</span>

                  {/* Content */}
                  <p className="text-dark-2/80 text-sm leading-relaxed">{testimonial.content}</p>
                </div>
              ))}
            </div>

            {/* Right Arrow */}
            <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5 text-dark-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
