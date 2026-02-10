import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Save, Plus, Trash2, Building2, Image as ImageIcon, Upload, Star } from 'lucide-react';

const FranchiseEdit = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    description: '',
    category: 'RESTAURANTS',
    country: '',
    city: '',
    logo: '',
    coverImage: ''
  });

  const [investmentData, setInvestmentData] = useState({
    minInvestment: '',
    maxInvestment: '',
    franchiseFee: '',
    franchiseFeeLocal: 'SAR',
    royaltyFee: '',
    marketingFee: ''
  });

  const [stats, setStats] = useState([]);
  const [characteristics, setCharacteristics] = useState([]);
  const [logoUploading, setLogoUploading] = useState(false);
  const [hasFranchise, setHasFranchise] = useState(false);

  const categories = [
    { value: 'RESTAURANTS', label: 'مطاعم' },
    { value: 'RETAIL', label: 'تجزئة' },
    { value: 'SERVICES', label: 'خدمات' },
    { value: 'HEALTH', label: 'صحة' },
    { value: 'EDUCATION', label: 'تعليم' },
    { value: 'FASHION', label: 'أزياء' },
    { value: 'CAFE', label: 'مقاهي' },
    { value: 'OTHER', label: 'أخرى' }
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    loadFranchiseData();
  }, [navigate]);

  const loadFranchiseData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/franchises/my-franchise', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        const franchise = data.data?.franchise;
        
        if (franchise) {
          setHasFranchise(true);
          setFormData({
            name: franchise.name || '',
            tagline: franchise.tagline || '',
            description: franchise.description || '',
            category: franchise.category || 'RESTAURANTS',
            country: franchise.country || '',
            city: franchise.city || '',
            logo: franchise.logo || '',
            coverImage: franchise.coverImage || ''
          });

          if (franchise.investment) {
            setInvestmentData({
              minInvestment: franchise.investment.minInvestment || '',
              maxInvestment: franchise.investment.maxInvestment || '',
              franchiseFee: franchise.investment.franchiseFee || '',
              franchiseFeeLocal: franchise.investment.franchiseFeeLocal || 'SAR',
              royaltyFee: franchise.investment.royaltyFee || '',
              marketingFee: franchise.investment.marketingFee || ''
            });
          }

          setStats(franchise.stats || []);
          setCharacteristics(franchise.characteristics || []);
        }
      }
    } catch (err) {
      console.error('فشل في تحميل الفرنشايز:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBasic = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem('token');
      const method = hasFranchise ? 'PATCH' : 'POST';
      const url = 'http://localhost:5000/api/franchises' + (hasFranchise ? '/my-franchise' : '');
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'فشل في الحفظ');
      }

      setHasFranchise(true);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveInvestment = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    
    try {
      const token = localStorage.getItem('token');
      
      // Convert string values to numbers for API
      const payload = {
        ...investmentData,
        minInvestment: investmentData.minInvestment ? parseFloat(investmentData.minInvestment) : 0,
        maxInvestment: investmentData.maxInvestment ? parseFloat(investmentData.maxInvestment) : 0,
        franchiseFee: investmentData.franchiseFee ? parseFloat(investmentData.franchiseFee) : 0
      };
      
      const response = await fetch('http://localhost:5000/api/franchises/my-franchise/investment', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'فشل في حفظ تفاصيل الاستثمار');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const addStat = () => {
    setStats([...stats, { label: '', value: '', suffix: '', subtext: '', order: stats.length }]);
  };

  const removeStat = (index) => {
    setStats(stats.filter((_, i) => i !== index));
  };

  const updateStat = (index, field, value) => {
    const newStats = [...stats];
    newStats[index][field] = value;
    setStats(newStats);
  };

  const saveStats = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/franchises/my-franchise/stats', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ stats })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'فشل في حفظ الإحصائيات');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const addCharacteristic = () => {
    setCharacteristics([...characteristics, { title: '', value: '', items: [], icon: '', order: characteristics.length }]);
  };

  const removeCharacteristic = (index) => {
    setCharacteristics(characteristics.filter((_, i) => i !== index));
  };

  const updateCharacteristic = (index, field, value) => {
    const newChars = [...characteristics];
    if (field === 'items') {
      newChars[index][field] = value.split(',').map(item => item.trim()).filter(item => item);
    } else {
      newChars[index][field] = value;
    }
    setCharacteristics(newChars);
  };

  const saveCharacteristics = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/franchises/my-franchise/characteristics', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ characteristics })
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLogoUploading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('http://localhost:5000/api/upload/logo', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({ ...formData, logo: data.data.logo });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const errorData = await response.json();
        alert('فشل في رفع الشعار: ' + (errorData.message || 'خطأ غير معروف'));
      }
    } catch (err) {
      alert('فشل في رفع الشعار: ' + err.message);
    } finally {
      setLogoUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-1" dir="rtl">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/owner/dashboard" className="text-dark-2 hover:text-dark-1">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-xl font-bold text-dark-1">تعديل الفرنشايز</h1>
            </div>
              <Link to="#" className="flex items-center gap-2">
  <div className="px-3 py-2 rounded-full border-2 flex flex-col items-center leading-tight border-dark-1">
    <span className="text-xs font-bold tracking-wider text-dark-1">
      FRANCHISES GATE
    </span>
    <span className="text-sm font-bold text-dark-1">
      بـوابــة الامتيـــازات
    </span>
  </div>
</Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {success && (
          <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6">
            تم الحفظ بنجاح!
          </div>
        )}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-bold text-dark-1 mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            المعلومات الأساسية
          </h2>
          
          <form onSubmit={handleSaveBasic} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-1 mb-1">اسم الفرنشايز</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dark-1 mb-1">الشعار</label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({...formData, tagline: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-1 mb-1">الوصف</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows="3"
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-1 mb-1">الفئة</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:outline-none"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dark-1 mb-1">الدولة</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dark-1 mb-1">المدينة</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-dark-1 text-white px-6 py-2 rounded-xl hover:bg-dark-2 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'جاري الحفظ...' : 'حفظ المعلومات'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-bold text-dark-1 mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            شعار الفرنشايز
          </h2>
          
          <div className="flex items-center gap-6">
            <div className="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
              {formData.logo ? (
                <img src={formData.logo} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <ImageIcon className="w-12 h-12 text-gray-400" />
              )}
            </div>
            
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={logoUploading}
                className="hidden"
                id="logo-upload"
              />
              <label
                htmlFor="logo-upload"
                className="flex items-center gap-2 bg-primary text-dark-1 px-6 py-3 rounded-xl font-medium hover:bg-primary/80 transition-colors cursor-pointer disabled:opacity-50"
              >
                {logoUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    جاري الرفع...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    {formData.logo ? 'تغيير الشعار' : 'رفع شعار'}
                  </>
                )}
              </label>
              <p className="text-sm text-gray-500 mt-2">JPG, PNG - الحد الأقصى 2 ميجابايت</p>
              
              {formData.logo && (
                <button
                  onClick={handleSaveBasic}
                  disabled={saving}
                  className="flex items-center gap-2 bg-dark-1 text-white px-6 py-2 rounded-xl hover:bg-dark-2 transition-colors disabled:opacity-50 mt-4"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'جاري الحفظ...' : 'حفظ الشعار'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-bold text-dark-1 mb-4">تفاصيل الاستثمار</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-dark-1 mb-1">الحد الأدنى للاستثمار (دولار)</label>
              <input
                type="number"
                value={investmentData.minInvestment}
                onChange={(e) => setInvestmentData({...investmentData, minInvestment: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-dark-1 mb-1">الحد الأقصى للاستثمار (دولار)</label>
              <input
                type="number"
                value={investmentData.maxInvestment}
                onChange={(e) => setInvestmentData({...investmentData, maxInvestment: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-dark-1 mb-1">رسوم الفرنشايز</label>
              <input
                type="number"
                value={investmentData.franchiseFee}
                onChange={(e) => setInvestmentData({...investmentData, franchiseFee: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-dark-1 mb-1">العملة</label>
              <select
                value={investmentData.franchiseFeeLocal}
                onChange={(e) => setInvestmentData({...investmentData, franchiseFeeLocal: e.target.value})}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:outline-none"
              >
                <option value="SAR">ريال سعودي</option>
                <option value="USD">دولار أمريكي</option>
                <option value="AED">درهم إماراتي</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-dark-1 mb-1">رسوم الرويالتي</label>
              <input
                type="text"
                value={investmentData.royaltyFee}
                onChange={(e) => setInvestmentData({...investmentData, royaltyFee: e.target.value})}
                placeholder="مثال: 4% - 3%"
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-dark-1 mb-1">رسوم التسويق</label>
              <input
                type="text"
                value={investmentData.marketingFee}
                onChange={(e) => setInvestmentData({...investmentData, marketingFee: e.target.value})}
                placeholder="مثال: 1%"
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleSaveInvestment}
            disabled={saving}
            className="flex items-center gap-2 bg-dark-1 text-white px-6 py-2 rounded-xl hover:bg-dark-2 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'جاري الحفظ...' : 'حفظ الاستثمار'}
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-dark-1">إحصائيات الفرنشايز</h2>
            <button
              onClick={addStat}
              className="flex items-center gap-1 text-primary text-sm hover:underline"
            >
              <Plus className="w-4 h-4" />
              إضافة إحصائية
            </button>
          </div>
          
          <div className="space-y-3 mb-4">
            {stats.map((stat, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-center bg-gray-50 p-3 rounded-xl">
                <div className="col-span-4">
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => updateStat(index, 'label', e.target.value)}
                    placeholder="التسمية"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => updateStat(index, 'value', e.target.value)}
                    placeholder="القيمة"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="text"
                    value={stat.suffix}
                    onChange={(e) => updateStat(index, 'suffix', e.target.value)}
                    placeholder="اللاحقة"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <input
                    type="text"
                    value={stat.subtext}
                    onChange={(e) => updateStat(index, 'subtext', e.target.value)}
                    placeholder="نص إضافي"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                  />
                </div>
                <div className="col-span-1">
                  <button
                    onClick={() => removeStat(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {stats.length > 0 && (
            <button
              onClick={saveStats}
              disabled={saving}
              className="flex items-center gap-2 bg-dark-1 text-white px-6 py-2 rounded-xl hover:bg-dark-2 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'جاري الحفظ...' : 'حفظ الإحصائيات'}
            </button>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-dark-1 flex items-center gap-2">
              <Star className="w-5 h-5" />
              مميزات الفرنشايز
            </h2>
            <button
              onClick={addCharacteristic}
              className="flex items-center gap-1 text-primary text-sm hover:underline"
            >
              <Plus className="w-4 h-4" />
              إضافة ميزة
            </button>
          </div>
          
          <div className="space-y-3 mb-4">
            {characteristics.map((char, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-start bg-gray-50 p-3 rounded-xl">
                <div className="col-span-3">
                  <input
                    type="text"
                    value={char.title}
                    onChange={(e) => updateCharacteristic(index, 'title', e.target.value)}
                    placeholder="عنوان الميزة"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="text"
                    value={char.value}
                    onChange={(e) => updateCharacteristic(index, 'value', e.target.value)}
                    placeholder="القيمة (اختياري)"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                  />
                </div>
                <div className="col-span-4">
                  <input
                    type="text"
                    value={char.items?.join(', ') || ''}
                    onChange={(e) => updateCharacteristic(index, 'items', e.target.value)}
                    placeholder="عناصر (مفصولة بفاصلة)"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                  />
                </div>
                <div className="col-span-1">
                  <input
                    type="text"
                    value={char.icon}
                    onChange={(e) => updateCharacteristic(index, 'icon', e.target.value)}
                    placeholder="أيقونة"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                  />
                </div>
                <div className="col-span-1">
                  <button
                    onClick={() => removeCharacteristic(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {characteristics.length > 0 && (
            <button
              onClick={saveCharacteristics}
              disabled={saving}
              className="flex items-center gap-2 bg-dark-1 text-white px-6 py-2 rounded-xl hover:bg-dark-2 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'جاري الحفظ...' : 'حفظ المميزات'}
            </button>
          )}
        </div>

        <div className="flex gap-4">
          <Link
            to="/owner/dashboard"
            className="flex-1 bg-gray-100 text-dark-1 py-3 rounded-xl text-center font-medium hover:bg-gray-200 transition-colors"
          >
            العودة للوحة التحكم
          </Link>
          <Link
            to="/owner/gallery"
            className="flex-1 bg-primary text-dark-1 py-3 rounded-xl text-center font-medium hover:bg-primary/80 transition-colors"
          >
            إدارة المعرض
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FranchiseEdit;
