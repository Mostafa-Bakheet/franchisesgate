import { useState, useEffect, createContext, useContext } from 'react';
import { ShoppingCart } from 'lucide-react';
import { API_URL } from '../config';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (service) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === service.id);
      if (existing) {
        return prev.map(item =>
          item.id === service.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...service, quantity: 1 }];
    });
    setIsOpen(true);
  };

  const removeFromCart = (serviceId) => {
    setCartItems(prev => prev.filter(item => item.id !== serviceId));
  };

  const updateQuantity = (serviceId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(serviceId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === serviceId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      total,
      itemCount,
      isOpen,
      setIsOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Cart Sidebar Component
export const CartSidebar = () => {
  const { cartItems, isOpen, setIsOpen, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const orderData = {
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        customerCompany: formData.company,
        notes: formData.notes,
        items: cartItems.map(item => ({
          serviceId: item.id,
          quantity: item.quantity
        }))
      };

      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        clearCart();
        setTimeout(() => {
          setSuccess(false);
          setShowCheckout(false);
          setIsOpen(false);
        }, 3000);
      } else {
        alert('حدث خطأ، يرجى المحاولة مرة أخرى');
      }
    } catch (error) {
      console.error('Submit order error:', error);
      alert('حدث خطأ، يرجى المحاولة مرة أخرى');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">سلة الشراء</h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {success ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-green-600 mb-2">
                تم إرسال طلبك بنجاح!
              </h3>
              <p className="text-gray-600">
                سنتواصل معك قريباً
              </p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              السلة فارغة
            </div>
          ) : showCheckout ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-bold text-lg mb-4">معلومات التواصل</h3>
              
              <div>
                <label className="block text-sm mb-1">الاسم *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">البريد الإلكتروني *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">رقم الجوال *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">الشركة (اختياري)</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={e => setFormData({...formData, company: e.target.value})}
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm mb-1">ملاحظات (اختياري)</label>
                <textarea
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  className="w-full p-2 border rounded-lg h-24"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary/90 disabled:opacity-50"
              >
                {submitting ? 'جاري الإرسال...' : 'إتمام الطلب'}
              </button>

              <button
                type="button"
                onClick={() => setShowCheckout(false)}
                className="w-full py-2 text-gray-600"
              >
                العودة للسلة
              </button>
            </form>
          ) : (
            <>
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-4 mb-4 pb-4 border-b">
                  <div className="flex-1">
                    <h4 className="font-bold">{item.name}</h4>
                    <p className="text-primary font-bold">{item.price.toLocaleString()} ريال</p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        {!showCheckout && cartItems.length > 0 && (
          <div className="p-4 border-t bg-gray-50">
            <div className="flex justify-between mb-4">
              <span className="font-bold">الإجمالي:</span>
              <span className="font-bold text-primary text-xl">{total.toLocaleString()} ريال</span>
            </div>
            <button
              onClick={() => setShowCheckout(true)}
              className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary/90"
            >
              متابعة الشراء
            </button>
          </div>
        )}
      </div>
    </>
  );
};

// Cart Button Component
export const CartButton = () => {
  const { itemCount, setIsOpen } = useCart();

  return (
    <button
      onClick={() => setIsOpen(true)}
      className="fixed left-6 bottom-[6.5rem] z-30 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary/90 flex items-center gap-2"
    >
      <ShoppingCart className="w-6 h-6" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-sm flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </button>
  );
};
