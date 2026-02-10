import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import SEO from '../components/SEO';
import Navigation from '../components/Navigation';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(text || 'فشل في تسجيل الدخول');
      }

      if (!response.ok) {
        throw new Error(data.message || 'فشل في تسجيل الدخول');
      }

      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));

      if (data.data.user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/owner/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-light-1" dir="rtl">
      <SEO 
        title="تسجيل الدخول"
        description="تسجيل الدخول إلى حسابك في بوابة الامتيازات"
        noindex={true}
      />
      <Navigation />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-dark-1 mb-2">تسجيل الدخول</h1>
            <p className="text-dark-2/60">سجل الدخول إلى حسابك</p>
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
                  كلمة المرور
                </label>
                <div className="relative">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-2/40" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
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

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-dark-1 text-white py-4 rounded-xl font-semibold hover:bg-dark-2 transition-colors disabled:opacity-50"
              >
                {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
              </button>
            </form>

            <div className="mt-6 text-center space-y-3">
              <p className="text-sm text-dark-2/60">
                ليس لديك حساب؟{' '}
                <Link to="/register" className="text-primary font-medium hover:underline">
                  إنشاء حساب جديد
                </Link>
              </p>
              <Link to="/" className="text-sm text-dark-2/40 hover:text-dark-2 block">
                العودة للرئيسية
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-xs text-dark-2/40 text-center mb-3">حسابات تجريبية:</p>
              <div className="space-y-2 text-xs text-dark-2/60">
                <div className="bg-gray-50 p-2 rounded-lg text-center">
                  <span className="font-medium">مدير:</span> admin@franchisegate.com / AdminPass123!
                </div>
                <div className="bg-gray-50 p-2 rounded-lg text-center">
                  <span className="font-medium">مالك:</span> owner1@example.com / OwnerPass123!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
