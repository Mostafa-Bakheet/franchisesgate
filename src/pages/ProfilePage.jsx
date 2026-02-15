import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, MapPin, Users, Calendar, Clock, CheckCircle, Building, ArrowLeft, Maximize, Briefcase, DollarSign, Percent, FileText, Loader2, Send } from 'lucide-react';
import SEO from '../components/SEO';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import BranchesMap from '../components/BranchesMap';
import { API_BASE_URL, getImageUrl } from '../config.js';

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [franchise, setFranchise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Contact form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    companyName: '',
    message: '',
    businessType: 'individual',
    hasExperience: 'no',
    franchiseType: 'single',
    cityOfOpening: '',
    confirmed: 'yes'
  });

  useEffect(() => {
    if (!id) {
      navigate('/gallery');
      return;
    }
    fetchFranchise();
  }, [id, navigate]);

  const fetchFranchise = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/gallery/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'فشل في تحميل بيانات الفرنشايز');
      }

      setFranchise(data.data?.franchise);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitSuccess(false);

    try {
      const response = await fetch(`${API_BASE_URL}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          franchiseId: id,
          senderName: formData.name,
          senderEmail: formData.email,
          senderPhone: formData.phone,
          content: `طلب فرنشايز: ${franchise?.name || ''}\nالشركة: ${formData.companyName}\nالدولة: ${formData.country}\nالمدينة: ${formData.city}\nنوع العمل: ${formData.businessType}\nلديه خبرة: ${formData.hasExperience}\nنوع الفرنشايز: ${formData.franchiseType}\nمدينة الافتتاح: ${formData.cityOfOpening}\nرسالة: ${formData.message}`
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'فشل في إرسال الرسالة');
      }

      setSubmitSuccess(true);
      setFormData({
        name: '', email: '', phone: '', country: '', city: '',
        companyName: '', message: '', businessType: 'individual',
        hasExperience: 'no', franchiseType: 'single', cityOfOpening: '', confirmed: 'yes'
      });

      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light-1 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !franchise) {
    return (
      <div className="min-h-screen bg-light-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'الفرنشايز غير موجود'}</p>
          <Link to="/gallery" className="text-primary hover:underline">
            العودة إلى المعرض
          </Link>
        </div>
      </div>
    );
  }

  const stats = franchise.stats || [];
  const characteristics = franchise.characteristics || [];
  const gallery = franchise.gallery || [];
const staticIcons = [
  "/Frame 427320589.png",
  "/Frame 427320589 (1).png",
  "/Frame 427320589 (2).png",
  "/Frame 427320589 (3).png",
];

  return (
    <div className="min-h-screen bg-light-1" dir="rtl">
      <SEO 
        title={`${franchise?.name || 'فرنشايز'} | فرصة استثمارية في ${franchise?.city || 'السعودية'}`}
        description={`${franchise?.description?.substring(0, 150) || 'فرصة استثمارية مميزة'} - استثمار من ${franchise?.investment?.minInvestment?.toLocaleString() || '0'} إلى ${franchise?.investment?.maxInvestment?.toLocaleString() || '0'} ريال. تفاصيل الامتياز التجاري والتكاليف والعوائد المتوقعة.`}
        keywords={`${franchise?.name || ''}, ${franchise?.category || ''}, امتياز تجاري ${franchise?.city || ''}, استثمار ${franchise?.category || ''}, فرنشايز ${franchise?.country || 'السعودية'}`}
        canonical={`/profile/${id}`}
      />
      <Navigation />

      {/* Header Section */}
      <section className="pt-24 pb-8 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <Link to="/gallery" className="text-dark-2 hover:text-dark-1 text-sm mb-6 inline-block">
            ← العودة إلى سوق الفرنشايز
          </Link>

          <div className="bg-[#f5f5f5] rounded-[32px] p-6 md:p-8">
            <div className="flex flex-col lg:flex-row gap-6">
              
              {/* Logo Section */}
              <div className="flex-1 flex flex-col items-center text-center gap-6">
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-white rounded-[28px] p-8 shadow-md">
                    <img 
                      src={getImageUrl(franchise.logo) || 'placeholder-logo.png'} 
                      alt={franchise.name}
                      className="w-36 h-36 object-contain"
                    />
                  </div>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-dark-1 mt-4">
                  جاهز للانطلاق؟ احجز الآن
                </h2>

                <div className="flex flex-wrap justify-center gap-4 mt-2">
                  <button className="bg-primary text-dark-1 px-7 py-3 rounded-full font-semibold flex items-center gap-2 hover:bg-primary/80 transition">
                    ابدأ الآن
                  </button>
                  <button className="bg-white text-dark-1 px-7 py-3 rounded-full font-semibold border-2 border-dark-1 flex items-center gap-2 hover:bg-gray-50 transition">
                    احجز استشارتك
                  </button>
                </div>
              </div>

              {/* Info Section */}
              <div className="flex-1 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-dark-1">{franchise.name}</h1>
                  {franchise.status === 'PUBLISHED' && <CheckCircle className="w-6 h-6 text-green-500" />}
                </div>
                
                <p className="text-dark-2/60 mb-3">{franchise.tagline || franchise.category}</p>
                <p className="text-dark-1 font-medium mb-4">{franchise.description || ''}</p>

                <div className="flex items-center justify-center gap-8 mb-4">
                  <div className="text-center">
                    <p className="text-xs text-dark-2/60 mb-1">المدينة</p>
                    <p className="text-sm font-semibold text-dark-1">{franchise.city}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-dark-2/60 mb-1">الدولة</p>
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-lg">{franchise.country?.slice(0, 2)}</span>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {stats.length > 0 ? stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-[16px] p-4 text-center shadow-sm">
                      <p className="text-xs text-dark-2/60 mb-1">{stat.label}</p>
                      <p className="text-xl font-bold text-dark-1">
                        {stat.value}{stat.suffix || ''}
                      </p>
                      {stat.subtext && <p className="text-xs text-dark-2/70">{stat.subtext}</p>}
                    </div>
                  )) : (
                    <>
                      <div className="bg-white rounded-[16px] p-4 text-center shadow-sm">
                        <p className="text-xs text-dark-2/60 mb-1">الفئة</p>
                        <p className="text-xl font-bold text-dark-1">{franchise.category}</p>
                      </div>
                      {franchise.investment && (
                        <div className="bg-white rounded-[16px] p-4 text-center shadow-sm">
                          <p className="text-xs text-dark-2/60 mb-1">الاستثمار</p>
                          <p className="text-lg font-bold text-dark-1">
                            ${franchise.investment.minInvestment?.toLocaleString()} - ${franchise.investment.maxInvestment?.toLocaleString()}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Flag */}
              <div className="flex-1 flex flex-col items-center text-center gap-6">
                <div className="flex flex-col items-center gap-4">
                  <img src="/icons8-saudi-arabia-48.png" alt="Saudi Arabia" className="w-16 h-16" />
                </div>
              </div>
            </div>

            {/* Franchise Characteristics */}
            {characteristics.length > 0 && ( 
  <div className="mt-10">
    <h2 className="text-2xl font-bold text-dark-1 text-center mb-8">
      مميزات الفرنشايز
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {characteristics.map((item, index) => (
        <div
          key={index}
          className="flex items-start gap-4 bg-white rounded-2xl p-4 shadow-sm"
        >
          <div className="w-16 h-16 bg-[#f5f5f5] rounded-lg flex items-center justify-center flex-shrink-0">
            <img
              src={staticIcons[index] || "icons/Frame-1.png"}
              alt=""
              className="w-10 h-10 object-contain"
            />
          </div>

          <div className="text-right">
            <h3 className="text-sm font-semibold text-dark-1 mb-1">
              {item.title}
            </h3>
            <p className="text-lg font-bold text-dark-1">
              {item.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

          </div>
        </div>
      </section>
    {/* Branches Map Section */}
      {franchise && (
        <BranchesMap franchiseName={franchise.name} />
      )}
      {/* Gallery Section */}
      {gallery.length > 0 && (
        <section className="py-8 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-xl font-bold text-dark-1 mb-4 text-center">معرض الصور</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {gallery.slice(0, 4).map((img, index) => (
                <div key={index} className="rounded-[16px] overflow-hidden h-64">
                  <img src={img.url} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

  

      {/* Contact Form Section */}
      <section className="py-16 bg-[#F7F7F7]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div className="hidden lg:block">
              <img src="/Whisk_554fe5053c4db958c9342f7bd58c8864dr 1 (1).png" alt="" className="w-full h-full object-cover rounded-[24px]" />
            </div>

            <div className="bg-white rounded-[24px] p-8">
              <h2 className="text-xl font-semibold text-dark-1 mb-6 text-center">
                أكمل طلبك
              </h2>

              {submitSuccess && (
                <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-4 text-center">
                  تم إرسال طلبك بنجاح! سنتواصل معك قريباً
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <input
                  type="text"
                  value={franchise.name}
                  disabled
                  className="w-full bg-[#EFEFEF] text-center text-sm px-5 py-3 rounded-full text-gray-500"
                />

                <input
                  type="text"
                  placeholder="الاسم الكامل"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-[#EFEFEF] px-5 py-3 rounded-full text-sm outline-none"
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="tel"
                    placeholder="رقم الهاتف"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="bg-[#EFEFEF] px-5 py-3 rounded-full text-sm outline-none"
                  />
                  <input
                    type="email"
                    placeholder="البريد الإلكتروني"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="bg-[#EFEFEF] px-5 py-3 rounded-full text-sm outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="الدولة"
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    className="bg-[#EFEFEF] px-5 py-3 rounded-full text-sm outline-none"
                  />
                  <input
                    type="text"
                    placeholder="المدينة"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="bg-[#EFEFEF] px-5 py-3 rounded-full text-sm outline-none"
                  />
                </div>

                <input
                  type="text"
                  placeholder="اسم الشركة"
                  value={formData.companyName}
                  onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                  className="w-full bg-[#EFEFEF] px-5 py-3 rounded-full text-sm outline-none"
                />

                <textarea
                  placeholder="رسالتك..."
                  rows="3"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-[#EFEFEF] px-5 py-3 rounded-xl text-sm outline-none resize-none"
                />

                <div className="grid grid-cols-2 gap-6 pt-2 text-xs text-dark-1">
                  <div>
                    <p className="font-semibold mb-2">نوع العمل</p>
                    <label className="flex items-center gap-2 mb-1">
                      <input 
                        type="radio" 
                        name="business" 
                        checked={formData.businessType === 'individual'}
                        onChange={() => setFormData({...formData, businessType: 'individual'})}
                      />
                      فرد
                    </label>
                    <label className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        name="business" 
                        checked={formData.businessType === 'company'}
                        onChange={() => setFormData({...formData, businessType: 'company'})}
                      />
                      شركة
                    </label>
                  </div>

                  <div>
                    <p className="font-semibold mb-2">هل لديك خبرة في الفرنشايز؟</p>
                    <label className="flex items-center gap-2 mb-1">
                      <input 
                        type="radio" 
                        name="experience" 
                        checked={formData.hasExperience === 'yes'}
                        onChange={() => setFormData({...formData, hasExperience: 'yes'})}
                      />
                      نعم
                    </label>
                    <label className="flex items-center gap-2">
                      <input 
                        type="radio" 
                        name="experience" 
                        checked={formData.hasExperience === 'no'}
                        onChange={() => setFormData({...formData, hasExperience: 'no'})}
                      />
                      لا
                    </label>
                  </div>
                </div>

                <hr className="my-4" />

                <div className="text-xs">
                  <p className="font-semibold mb-2">نوع الفرنشايز</p>
                  <label className="flex items-center gap-2 mb-1">
                    <input 
                      type="radio" 
                      name="franchise" 
                      checked={formData.franchiseType === 'single'}
                      onChange={() => setFormData({...formData, franchiseType: 'single'})}
                    />
                    فرنشايز واحد
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      name="franchise" 
                      checked={formData.franchiseType === 'regional'}
                      onChange={() => setFormData({...formData, franchiseType: 'regional'})}
                    />
                    فرنشايز إقليمي
                  </label>
                </div>

                <input
                  type="text"
                  placeholder="مدينة الافتتاح"
                  value={formData.cityOfOpening}
                  onChange={(e) => setFormData({...formData, cityOfOpening: e.target.value})}
                  className="w-full bg-[#EFEFEF] px-5 py-3 rounded-full text-sm outline-none mt-4"
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-6 bg-black text-white w-full py-3 rounded-xl text-sm font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {submitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
                </button>

                <p className="text-[10px] text-center text-dark-2/60 mt-4">
                  شركة الامتياز الوطنية هي الوسيط للعلامة التجارية ويحق لها عمولة وساطة بعد إتمام وموافقة طلب الفرنشايز
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProfilePage;
