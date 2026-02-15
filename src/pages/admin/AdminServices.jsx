import { useState, useEffect } from 'react';
import { API_URL } from '../../config';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    shortDesc: '',
    price: '',
    oldPrice: '',
    icon: '',
    image: '',
    bgColor: '#FFFFFF',
    order: 0,
    features: [],
    isActive: true
  });
  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/services/admin/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setServices(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      const url = editingService 
        ? `${API_URL}/services/${editingService.id}`
        : `${API_URL}/services`;
      
      const method = editingService ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        alert(editingService ? 'تم تحديث الخدمة' : 'تم إضافة الخدمة');
        setShowForm(false);
        setEditingService(null);
        resetForm();
        fetchServices();
      } else {
        alert(data.message || 'حدث خطأ');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('حدث خطأ في الاتصال');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذه الخدمة؟')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/services/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      
      if (data.success) {
        alert('تم حذف الخدمة');
        fetchServices();
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      shortDesc: '',
      price: '',
      oldPrice: '',
      icon: '',
      image: '',
      bgColor: '#FFFFFF',
      order: 0,
      features: [],
      isActive: true
    });
    setFeatureInput('');
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, featureInput.trim()]
      });
      setFeatureInput('');
    }
  };

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  const editService = (service) => {
    setEditingService(service);
    setFormData({
      ...service,
      price: service.price.toString(),
      oldPrice: service.oldPrice?.toString() || '',
      features: service.features || []
    });
    setShowForm(true);
  };

  if (loading) {
    return <div className="flex justify-center p-8">جاري التحميل...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة الخدمات</h1>
        <button
          onClick={() => {
            setEditingService(null);
            resetForm();
            setShowForm(true);
          }}
          className="bg-primary text-dark-1 px-4 py-2 rounded-lg font-bold"
        >
          + إضافة خدمة جديدة
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h2 className="text-xl font-bold mb-4">
            {editingService ? 'تعديل خدمة' : 'إضافة خدمة جديدة'}
          </h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">اسم الخدمة *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">الرابط (Slug) *</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({...formData, slug: e.target.value})}
                className="w-full p-2 border rounded-lg"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">السعر *</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">السعر القديم (للخصم)</label>
              <input
                type="number"
                value={formData.oldPrice}
                onChange={(e) => setFormData({...formData, oldPrice: e.target.value})}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm mb-1">وصف قصير</label>
              <input
                type="text"
                value={formData.shortDesc}
                onChange={(e) => setFormData({...formData, shortDesc: e.target.value})}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm mb-1">الوصف الكامل</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-2 border rounded-lg h-24"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">رابط الصورة</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">الأيقونة</label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({...formData, icon: e.target.value})}
                className="w-full p-2 border rounded-lg"
                placeholder="مثال: 📋"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">لون الخلفية</label>
              <input
                type="color"
                value={formData.bgColor}
                onChange={(e) => setFormData({...formData, bgColor: e.target.value})}
                className="w-full p-2 border rounded-lg h-10"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">الترتيب</label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm mb-1">المميزات</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  className="flex-1 p-2 border rounded-lg"
                  placeholder="أضف ميزة"
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="bg-gray-200 px-4 py-2 rounded-lg"
                >
                  إضافة
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                className="w-4 h-4"
              />
              <label htmlFor="isActive">نشط</label>
            </div>

            <div className="md:col-span-2 flex gap-4">
              <button
                type="submit"
                className="bg-primary text-dark-1 px-6 py-2 rounded-lg font-bold"
              >
                {editingService ? 'تحديث' : 'إضافة'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingService(null);
                  resetForm();
                }}
                className="bg-gray-200 px-6 py-2 rounded-lg"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services List */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-right">الخدمة</th>
              <th className="p-4 text-right">السعر</th>
              <th className="p-4 text-right">الحالة</th>
              <th className="p-4 text-right">الترتيب</th>
              <th className="p-4 text-right">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id} className="border-t">
                <td className="p-4">
                  <div className="font-bold">{service.name}</div>
                  <div className="text-sm text-gray-500">{service.slug}</div>
                </td>
                <td className="p-4">
                  <div className="font-bold">{service.price.toLocaleString()} ريال</div>
                  {service.oldPrice && (
                    <div className="text-sm text-gray-400 line-through">
                      {service.oldPrice.toLocaleString()} ريال
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    service.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {service.isActive ? 'نشط' : 'غير نشط'}
                  </span>
                </td>
                <td className="p-4">{service.order}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => editService(service)}
                      className="text-blue-600 hover:underline"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="text-red-600 hover:underline"
                    >
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminServices;
