import { useState, useEffect } from 'react';
import { API_URL } from '../../config';

const AdminTickers = () => {
  const [tickers, setTickers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTicker, setEditingTicker] = useState(null);
  const [formData, setFormData] = useState({
    content: '',
    link: '',
    bgColor: '#22C55E',
    textColor: '#FFFFFF',
    order: 0,
    isActive: true,
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchTickers();
  }, []);

  const fetchTickers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/tickers`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setTickers(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch tickers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    const payload = {
      ...formData,
      startDate: formData.startDate || null,
      endDate: formData.endDate || null
    };
    
    try {
      const url = editingTicker 
        ? `${API_URL}/tickers/${editingTicker.id}`
        : `${API_URL}/tickers`;
      
      const method = editingTicker ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (data.success) {
        alert(editingTicker ? 'تم تحديث الخبر' : 'تم إضافة الخبر');
        setShowForm(false);
        setEditingTicker(null);
        resetForm();
        fetchTickers();
      } else {
        alert(data.message || 'حدث خطأ');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('حدث خطأ في الاتصال');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا الخبر؟')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/tickers/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      
      if (data.success) {
        alert('تم حذف الخبر');
        fetchTickers();
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      content: '',
      link: '',
      bgColor: '#22C55E',
      textColor: '#FFFFFF',
      order: 0,
      isActive: true,
      startDate: '',
      endDate: ''
    });
  };

  const editTicker = (ticker) => {
    setEditingTicker(ticker);
    setFormData({
      content: ticker.content,
      link: ticker.link || '',
      bgColor: ticker.bgColor,
      textColor: ticker.textColor,
      order: ticker.order,
      isActive: ticker.isActive,
      startDate: ticker.startDate ? new Date(ticker.startDate).toISOString().split('T')[0] : '',
      endDate: ticker.endDate ? new Date(ticker.endDate).toISOString().split('T')[0] : ''
    });
    setShowForm(true);
  };

  if (loading) {
    return <div className="flex justify-center p-8">جاري التحميل...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة شريط الأخبار</h1>
        <button
          onClick={() => {
            setEditingTicker(null);
            resetForm();
            setShowForm(true);
          }}
          className="bg-primary text-dark-1 px-4 py-2 rounded-lg font-bold"
        >
          + إضافة خبر جديد
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h2 className="text-xl font-bold mb-4">
            {editingTicker ? 'تعديل خبر' : 'إضافة خبر جديد'}
          </h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">نص الخبر *</label>
              <textarea
                required
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="w-full p-2 border rounded-lg h-20"
                placeholder="اكتب نص الخبر هنا..."
              />
            </div>

            <div>
              <label className="block text-sm mb-1">رابط (اختياري)</label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({...formData, link: e.target.value})}
                className="w-full p-2 border rounded-lg"
                placeholder="https://..."
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

            <div>
              <label className="block text-sm mb-1">لون الخلفية</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={formData.bgColor}
                  onChange={(e) => setFormData({...formData, bgColor: e.target.value})}
                  className="w-16 h-10 border rounded"
                />
                <input
                  type="text"
                  value={formData.bgColor}
                  onChange={(e) => setFormData({...formData, bgColor: e.target.value})}
                  className="flex-1 p-2 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">لون النص</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={formData.textColor}
                  onChange={(e) => setFormData({...formData, textColor: e.target.value})}
                  className="w-16 h-10 border rounded"
                />
                <input
                  type="text"
                  value={formData.textColor}
                  onChange={(e) => setFormData({...formData, textColor: e.target.value})}
                  className="flex-1 p-2 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">تاريخ البدء (اختياري)</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">تاريخ الانتهاء (اختياري)</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                className="w-full p-2 border rounded-lg"
              />
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
                {editingTicker ? 'تحديث' : 'إضافة'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingTicker(null);
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

      {/* Preview */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-2">معاينة شريط الأخبار</h2>
        <div 
          className="w-full py-2 overflow-hidden rounded-lg"
          style={{ 
            backgroundColor: formData.bgColor || '#22C55E',
            color: formData.textColor || '#FFFFFF'
          }}
        >
          <div className="px-4 text-sm font-medium">
            {formData.content || 'نص الخبر سيظهر هنا...'}
          </div>
        </div>
      </div>

      {/* Tickers List */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-right">الخبر</th>
              <th className="p-4 text-right">الألوان</th>
              <th className="p-4 text-right">الحالة</th>
              <th className="p-4 text-right">الترتيب</th>
              <th className="p-4 text-right">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {tickers.map((ticker) => (
              <tr key={ticker.id} className="border-t">
                <td className="p-4">
                  <div className="font-bold">{ticker.content}</div>
                  {ticker.link && (
                    <div className="text-sm text-blue-500">{ticker.link}</div>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: ticker.bgColor }}
                    />
                    <div 
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: ticker.textColor }}
                    />
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    ticker.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {ticker.isActive ? 'نشط' : 'غير نشط'}
                  </span>
                </td>
                <td className="p-4">{ticker.order}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => editTicker(ticker)}
                      className="text-blue-600 hover:underline"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDelete(ticker.id)}
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

export default AdminTickers;
