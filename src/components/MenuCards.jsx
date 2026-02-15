import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';
import { useCart } from './ShoppingCart';

const MenuCards = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`${API_URL}/services?limit=3`);
        const data = await response.json();
        
        if (data.success) {
          setServices(data.data.slice(0, 3));
        }
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleAddToCart = (service) => {
    addToCart({
      id: service.id,
      name: service.name,
      price: service.price
    });
  };

  const ServiceCard = ({ service }) => (
    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-primary/80 via-primary/40 to-white hover:shadow-xl transition-shadow flex flex-col">
      {/* Content Container */}
      <div className="p-4 flex flex-col h-full">
        {/* Title */}
        <h3 className="text-xl font-bold text-dark-1 text-right mb-2">
          {service.name}
        </h3>

        {/* Short Description */}
        {service.shortDesc && (
          <p className="text-dark-2/80 text-sm text-right mb-2">
            {service.shortDesc}
          </p>
        )}

        {/* Features */}
        {service.features && Array.isArray(service.features) && (
          <ul className="text-right mb-4 space-y-1 flex-grow">
            {service.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-dark-2/80 text-sm text-right">
                <span className="w-1.5 h-1.5 bg-dark-1 rounded-full flex-shrink-0"></span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Image */}
        <div className="relative w-full h-52 mb-3">
          <img
            src={service.image || '/placeholder-service.png'}
            alt={service.name}
            className="w-full h-full object-cover rounded-xl"
          />
        </div>

        {/* Price */}
        <div className="text-center mb-3">
          {service.oldPrice && (
            <span className="text-gray-400 line-through text-sm block">
              {service.oldPrice.toLocaleString()} ريال
            </span>
          )}
          <span className="text-dark-1 font-bold text-xl">
            {service.price?.toLocaleString() || '0'} ريال
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => handleAddToCart(service)}
          className="w-full bg-dark-1 text-white py-2 rounded-lg font-medium hover:bg-dark-2 transition-colors"
        >
          أضف للسلة
        </button>
      </div>
    </div>
  );

  return (
    <section className="bg-light-1 py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-dark-1 mb-2">
            الخدمات المقدمة من قبل بوابة الامتيازات
          </h2>
          <p className="text-dark-2/70 max-w-2xl mx-auto leading-relaxed mb-1">
            إعداد جميع انظمة الامتياز التجاري استناداً للائحة التنفيذية لنظام الامتياز التجاري
          </p>
          <p className="text-dark-2/70 text-sm">
            (مطعم - مغسلة - محطة - كوفي ..... )
          </p>
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            لا توجد خدمات متاحة حالياً
          </div>
        )}

        {/* View More Button */}
        <div className="text-center mt-10">
          <Link
            to="/services"
            className="bg-dark-1 text-white px-10 py-3 rounded-full font-semibold hover:bg-dark-2 transition-colors inline-block"
          >
            شاهد المزيد
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MenuCards;
