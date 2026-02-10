import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone } from 'lucide-react';
import SEO from '../components/SEO';
import Navigation from '../components/Navigation';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        })
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(text || 'فشل في إنشاء الحساب');
      }

      if (!response.ok) {
        // Handle Zod validation errors
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors.map(e => e.message).join(', ');
          throw new Error(errorMessages || data.message || 'فشل في إنشاء الحساب');
        }
        throw new Error(data.message || 'فشل في إنشاء الحساب');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-light-1" dir="rtl">
        <Navigation />
        <div className="pt-24 pb-16 px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-green-50 rounded-[24px] p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-green-800 mb-2">تم إنشاء الحساب بنجاح!</h2>
              <p className="text-green-700 mb-4">
                حسابك قيد المراجعة من قبل الإدارة. سيتم إعلامك عند الموافقة.
              </p>
              <Link to="/login" className="text-primary font-medium hover:underline">
                الذهاب إلى تسجيل الدخول
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-1" dir="rtl">
      <SEO 
        title="إنشاء حساب جديد"
        description="إنشاء حساب جديد في بوابة الامتيازات للمستثمرين وأصحاب العلامات التجارية"
        noindex={true}
      />
      <Navigation />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-dark-1 mb-2">إنشاء حساب جديد</h1>
            <p className="text-dark-2/60">سجل كمالك فرنشايز</p>
          </div>

          <div className="bg-white rounded-[24px] p-8 shadow-sm">
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-dark-1 mb-2">
                  الاسم الكامل
                </label>
                <div className="relative">
                  <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-2/40" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:outline-none transition-colors"
                    placeholder="محمد أحمد"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-1 mb-2">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-2/40" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:outline-none transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-1 mb-2">
                  رقم الهاتف
                </label>
                <div className="relative">
                  <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-2/40" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:outline-none transition-colors"
                    placeholder="05xxxxxxxx"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-1 mb-2">
                  كلمة المرور
                </label>
                <div className="relative">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-2/40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength="8"
                    className="w-full pr-12 pl-12 py-3 rounded-xl border border-gray-200 focus:border-primary focus:outline-none transition-colors"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-2/40 hover:text-dark-2"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-1 mb-2">
                  تأكيد كلمة المرور
                </label>
                <div className="relative">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-2/40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    className="w-full pr-12 pl-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:outline-none transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-dark-1 text-white py-4 rounded-xl font-semibold hover:bg-dark-2 transition-colors disabled:opacity-50"
              >
                {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
              </button>
            </form>

            <div className="mt-6 text-center space-y-3">
              <p className="text-sm text-dark-2/60">
                لديك حساب بالفعل؟{' '}
                <Link to="/login" className="text-primary font-medium hover:underline">
                  تسجيل الدخول
                </Link>
              </p>
              <Link to="/" className="text-sm text-dark-2/40 hover:text-dark-2 block">
                العودة للرئيسية
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
