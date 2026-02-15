import { useState, useEffect } from 'react';
import { API_URL } from '../../config';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = filter === 'all' 
        ? `${API_URL}/orders` 
        : `${API_URL}/orders?status=${filter}`;
      
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      
      if (data.success) {
        alert('تم تحديث حالة الطلب');
        fetchOrders();
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (error) {
      console.error('Update status error:', error);
      alert('حدث خطأ');
    }
  };

  const deleteOrder = async (orderId) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      
      if (data.success) {
        alert('تم حذف الطلب');
        fetchOrders();
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(null);
        }
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'قيد الانتظار' },
      CONFIRMED: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'تم التأكيد' },
      PROCESSING: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'قيد المعالجة' },
      COMPLETED: { bg: 'bg-green-100', text: 'text-green-800', label: 'مكتمل' },
      CANCELLED: { bg: 'bg-red-100', text: 'text-red-800', label: 'ملغي' }
    };
    
    const badge = badges[status] || badges.PENDING;
    return (
      <span className={`px-3 py-1 rounded-full text-sm ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="flex justify-center p-8">جاري التحميل...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">إدارة الطلبات</h1>
        
        {/* Filter */}
        <div className="flex gap-2 flex-wrap">
          {[
            { value: 'all', label: 'الكل' },
            { value: 'PENDING', label: 'قيد الانتظار' },
            { value: 'CONFIRMED', label: 'تم التأكيد' },
            { value: 'PROCESSING', label: 'قيد المعالجة' },
            { value: 'COMPLETED', label: 'مكتمل' },
            { value: 'CANCELLED', label: 'ملغي' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-3 py-1 rounded-lg text-sm ${
                filter === option.value 
                  ? 'bg-primary text-dark-1 font-bold' 
                  : 'bg-gray-100'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-right">العميل</th>
                  <th className="p-4 text-right">الإجمالي</th>
                  <th className="p-4 text-right">الحالة</th>
                  <th className="p-4 text-right">التاريخ</th>
                  <th className="p-4 text-right">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr 
                    key={order.id} 
                    className={`border-t cursor-pointer hover:bg-gray-50 ${
                      selectedOrder?.id === order.id ? 'bg-primary/10' : ''
                    }`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <td className="p-4">
                      <div className="font-bold">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.customerEmail}</div>
                    </td>
                    <td className="p-4">
                      <span className="font-bold">
                        {order.totalAmount.toLocaleString()} ريال
                      </span>
                    </td>
                    <td className="p-4">{getStatusBadge(order.status)}</td>
                    <td className="p-4 text-sm">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteOrder(order.id);
                          }}
                          className="text-red-600 hover:underline text-sm"
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {orders.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                لا توجد طلبات
              </div>
            )}
          </div>
        </div>

        {/* Order Details */}
        <div className="lg:col-span-1">
          {selectedOrder ? (
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-bold">تفاصيل الطلب</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">العميل</label>
                  <div className="font-bold">{selectedOrder.customerName}</div>
                  <div className="text-sm">{selectedOrder.customerEmail}</div>
                  <div className="text-sm">{selectedOrder.customerPhone}</div>
                </div>

                {selectedOrder.customerCompany && (
                  <div>
                    <label className="text-sm text-gray-500">الشركة</label>
                    <div>{selectedOrder.customerCompany}</div>
                  </div>
                )}

                <div>
                  <label className="text-sm text-gray-500">الخدمات المطلوبة</label>
                  <ul className="space-y-2 mt-2">
                    {selectedOrder.items?.map((item, index) => (
                      <li key={index} className="flex justify-between bg-gray-50 p-2 rounded">
                        <span>{item.service?.name}</span>
                        <span className="font-bold">
                          {item.quantity} × {item.price.toLocaleString()} ريال
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>الإجمالي:</span>
                    <span>{selectedOrder.totalAmount.toLocaleString()} ريال</span>
                  </div>
                </div>

                {selectedOrder.notes && (
                  <div>
                    <label className="text-sm text-gray-500">ملاحظات</label>
                    <div className="bg-gray-50 p-2 rounded text-sm">
                      {selectedOrder.notes}
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm text-gray-500">تحديث الحالة</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['PENDING', 'CONFIRMED', 'PROCESSING', 'COMPLETED', 'CANCELLED'].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateStatus(selectedOrder.id, status)}
                        disabled={selectedOrder.status === status}
                        className={`px-3 py-1 rounded text-sm ${
                          selectedOrder.status === status
                            ? 'bg-gray-200 cursor-not-allowed'
                            : 'bg-primary hover:bg-primary/80'
                        }`}
                      >
                        {status === 'PENDING' && 'قيد الانتظار'}
                        {status === 'CONFIRMED' && 'تأكيد'}
                        {status === 'PROCESSING' && 'معالجة'}
                        {status === 'COMPLETED' && 'إكمال'}
                        {status === 'CANCELLED' && 'إلغاء'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  تم الإنشاء: {formatDate(selectedOrder.createdAt)}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-6 text-center text-gray-500">
              اختر طلباً لعرض التفاصيل
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
