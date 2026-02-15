import { useEffect, useRef, useState } from 'react';

const BranchesMap = ({ franchiseName }) => {
  const mapRef = useRef(null);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

  // Sample branches data for major franchises in Saudi Arabia
  const getSampleBranches = () => {
    const franchiseBranches = {
      'مطعم البيك': [
        { id: 1, name: 'البيك - جدة', lat: 21.4858, lng: 39.1925, address: 'شارع فلسطين، جدة', city: 'جدة' },
        { id: 2, name: 'البيك - الرياض', lat: 24.7136, lng: 46.6753, address: 'شارع العليا، الرياض', city: 'الرياض' },
        { id: 3, name: 'البيك - مكة', lat: 21.4225, lng: 39.8262, address: 'شارع إبراهيم الخليل، مكة', city: 'مكة' },
        { id: 4, name: 'البيك - المدينة', lat: 24.5247, lng: 39.5692, address: 'طريق الملك فهد، المدينة', city: 'المدينة' },
        { id: 5, name: 'البيك - الدمام', lat: 26.4207, lng: 50.0888, address: 'شارع الأمير محمد، الدمام', city: 'الدمام' },
        { id: 6, name: 'البيك - الخبر', lat: 26.2172, lng: 50.1971, address: 'شارع الظهران، الخبر', city: 'الخبر' },
      ],
      'هرفي': [
        { id: 1, name: 'هرفي - جدة', lat: 21.5433, lng: 39.1728, address: 'شارارع التحلية، جدة', city: 'جدة' },
        { id: 2, name: 'هرفي - الرياض', lat: 24.7682, lng: 46.7113, address: 'شارع خريص، الرياض', city: 'الرياض' },
        { id: 3, name: 'هرفي - مكة', lat: 21.3891, lng: 39.8579, address: 'شارارع العزيزية، مكة', city: 'مكة' },
      ],
      'كنتاكي': [
        { id: 1, name: 'KFC - جدة', lat: 21.4500, lng: 39.2000, address: 'شارارع صاري، جدة', city: 'جدة' },
        { id: 2, name: 'KFC - الرياض', lat: 24.7000, lng: 46.7500, address: 'شارارع عروبة، الرياض', city: 'الرياض' },
        { id: 3, name: 'KFC - الدمام', lat: 26.4000, lng: 50.1000, address: 'شارارع الأمير محمد، الدمام', city: 'الدمام' },
        { id: 4, name: 'KFC - الخبر', lat: 26.2500, lng: 50.2200, address: 'طريق الملك فهد، الخبر', city: 'الخبر' },
      ],
      'الباشا': [
        { id: 1, name: 'الباشا - جدة', lat: 21.5000, lng: 39.1800, address: 'شارارع فلسطين، جدة', city: 'جدة' },
        { id: 2, name: 'الباشا - الرياض', lat: 24.7300, lng: 46.6800, address: 'شارارع العليا، الرياض', city: 'الرياض' },
        { id: 3, name: 'الباشا - مكة', lat: 21.4100, lng: 39.8100, address: 'شارارع إبراهيم الخليل، مكة', city: 'مكة' },
        { id: 4, name: 'الباشا - المدينة', lat: 24.5300, lng: 39.5600, address: 'طريق الملك عبدالعزيز، المدينة', city: 'المدينة' },
      ],
      'شاورما': [
        { id: 1, name: 'شاورما - جدة', lat: 21.4800, lng: 39.1900, address: 'شارارع التحلية، جدة', city: 'جدة' },
        { id: 2, name: 'شاورما - الرياض', lat: 24.7200, lng: 46.7000, address: 'شارارع العليا، الرياض', city: 'الرياض' },
      ],
    };

    // Try to match franchise name
    const normalizedName = franchiseName?.toLowerCase() || '';
    
    for (const [key, branches] of Object.entries(franchiseBranches)) {
      if (normalizedName.includes(key.toLowerCase()) || 
          key.toLowerCase().includes(normalizedName)) {
        return branches;
      }
    }

    // Default: return all major cities
    return [
      { id: 1, name: `${franchiseName || 'الفرنشايز'} - جدة`, lat: 21.4858, lng: 39.1925, address: 'جدة', city: 'جدة' },
      { id: 2, name: `${franchiseName || 'الفرنشايز'} - الرياض`, lat: 24.7136, lng: 46.6753, address: 'الرياض', city: 'الرياض' },
      { id: 3, name: `${franchiseName || 'الفرنشايز'} - مكة`, lat: 21.4225, lng: 39.8262, address: 'مكة', city: 'مكة' },
      { id: 4, name: `${franchiseName || 'الفرنشايز'} - المدينة`, lat: 24.5247, lng: 39.5692, address: 'المدينة المنورة', city: 'المدينة' },
      { id: 5, name: `${franchiseName || 'الفرنشايز'} - الدمام`, lat: 26.4207, lng: 50.0888, address: 'الدمام', city: 'الدمام' },
    ];
  };

  useEffect(() => {
    const loadMap = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load Leaflet CSS
        if (!document.getElementById('leaflet-css')) {
          const link = document.createElement('link');
          link.id = 'leaflet-css';
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }

        // Load Leaflet JS
        if (!window.L) {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.async = true;
          
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        // Get branches data
        const branchData = getSampleBranches();
        setBranches(branchData);

        // Wait for ref
        if (!mapRef.current) {
          setTimeout(loadMap, 100);
          return;
        }

        // Initialize map
        if (mapInstance.current) {
          mapInstance.current.remove();
        }

        const map = window.L.map(mapRef.current).setView([24.7136, 46.6753], 5);
        mapInstance.current = map;

        // Add OpenStreetMap tiles (FREE - no API key needed)
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        // Clear existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        // Add markers for branches
        const bounds = window.L.latLngBounds();
        
        branchData.forEach((branch) => {
          const marker = window.L.marker([branch.lat, branch.lng])
            .addTo(map)
            .bindPopup(`
              <div style="direction: rtl; text-align: right; min-width: 150px;">
                <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold; color: #1f2937;">${branch.name}</h3>
                <p style="margin: 0; font-size: 12px; color: #6b7280;">${branch.address}</p>
              </div>
            `);
          
          markersRef.current.push(marker);
          bounds.extend([branch.lat, branch.lng]);
        });

        // Fit bounds if we have branches
        if (branchData.length > 0) {
          map.fitBounds(bounds, { padding: [50, 50] });
        }

        setLoading(false);
      } catch (err) {
        console.error('Map error:', err);
        setError('حدث خطأ في تحميل الخريطة');
        setLoading(false);
      }
    };

    loadMap();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [franchiseName]);

  return (
    <section className="py-16 bg-light-1">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-dark-1 mb-4">
            فروعنا في المملكة
          </h2>
          <p className="text-dark-2/70 max-w-2xl mx-auto">
            تجدونا في جميع أنحاء المملكة العربية السعودية
          </p>
        </div>

        {/* Map Container */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-200">
          {error ? (
            <div className="w-full h-[300px] bg-gray-50 flex items-center justify-center">
              <div className="text-center p-6">
                <div className="text-4xl mb-4">⚠️</div>
                <p className="text-dark-2/80 font-medium">{error}</p>
              </div>
            </div>
          ) : (
            <>
              <div 
                ref={mapRef} 
                className="w-full h-[500px] bg-gray-100"
                style={{ zIndex: 1 }}
              />
              
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-10">
                  <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="text-dark-2/70 text-sm">جاري تحميل الخريطة...</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Branches List */}
        {branches.length > 0 && !loading && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {branches.map((branch) => (
              <div 
                key={branch.id} 
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-dark-1 mb-1">{branch.name}</h3>
                    <p className="text-sm text-dark-2/70">{branch.address}</p>
                    <span className="inline-block mt-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {branch.city}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {branches.length === 0 && !loading && !error && (
          <div className="text-center py-8 text-dark-2/60">
            لا توجد فروع متاحة حالياً
          </div>
        )}
      </div>
    </section>
  );
};

export default BranchesMap;
