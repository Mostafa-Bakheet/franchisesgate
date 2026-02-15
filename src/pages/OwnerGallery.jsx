import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Upload, Trash2, Image as ImageIcon, Plus } from 'lucide-react';
import { API_BASE_URL } from '../config.js';

const OwnerGallery = () => {
  const navigate = useNavigate();
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    loadFranchise();
  }, [navigate]);

  const loadFranchise = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/franchises/my-franchise`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        const franchise = data.data?.franchise;
        if (franchise) {
          setGallery(franchise.gallery || []);
        }
      }
    } catch (err) {
      console.error('فشل في تحميل الفرنشايز:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('images', file);

      const response = await fetch(`${API_BASE_URL}/api/upload/gallery`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        const uploadedImages = data.data?.images || [];
        
        if (uploadedImages.length > 0) {
          const galleryRes = await fetch(`${API_BASE_URL}/api/franchises/my-franchise/gallery`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              images: uploadedImages.map((img, index) => ({ 
                url: img.url, 
                caption: file.name 
              }))
            })
          });

          if (galleryRes.ok) {
            loadFranchise();
          } else {
            const errorData = await galleryRes.json();
            alert('فشل في حفظ الصورة: ' + (errorData.message || 'خطأ غير معروف'));
          }
        }
      } else {
        const errorData = await response.json();
        alert('فشل في رفع الصورة: ' + (errorData.message || 'خطأ غير معروف'));
      }
    } catch (err) {
      alert('فشل في رفع الصورة: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId) => {
    if (!confirm('هل أنت متأكد من حذف هذه الصورة؟')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/franchises/my-franchise/gallery/${imageId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        loadFranchise();
      }
    } catch (err) {
      alert('فشل في حذف الصورة');
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/owner/dashboard" className="text-dark-2 hover:text-dark-1">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-xl font-bold text-dark-1">معرض الصور</h1>
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-lg font-bold text-dark-1 mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5" />
            رفع صورة جديدة
          </h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-primary transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  {uploading ? (
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  ) : (
                    <Plus className="w-8 h-8 text-dark-2" />
                  )}
                </div>
                <p className="text-dark-1 font-medium">
                  {uploading ? 'جاري الرفع...' : 'اضغط لرفع صورة'}
                </p>
                <p className="text-sm text-dark-2/60">
                  JPG, PNG, WebP - الحد الأقصى 5 ميجابايت
                </p>
              </div>
            </label>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-dark-1 mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            صور الفرنشايز ({gallery.length})
          </h2>

          {gallery.length === 0 ? (
            <div className="text-center py-12 text-dark-2/60">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>لا توجد صور بعد</p>
              <p className="text-sm mt-2">قم برفع صور لعرضها في صفحة الفرنشايز</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery.map((image, index) => (
                <div key={image.id || index} className="relative group">
                  <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={image.url}
                      alt={image.caption || `صورة ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => handleDelete(image.id)}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6">
          <Link
            to="/owner/dashboard"
            className="inline-flex items-center gap-2 bg-gray-100 text-dark-1 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            العودة للوحة التحكم
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OwnerGallery;
