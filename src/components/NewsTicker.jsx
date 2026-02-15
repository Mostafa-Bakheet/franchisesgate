import { useState, useEffect } from 'react';
import { API_URL } from '../config';

const NewsTicker = () => {
  const [tickers, setTickers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickers = async () => {
      try {
        const response = await fetch(`${API_URL}/tickers/active`);
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

    fetchTickers();
    
    // Refresh every 5 minutes
    const interval = setInterval(fetchTickers, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading || tickers.length === 0) return null;

  // Combine all ticker content
  const tickerContent = tickers.map(t => t.content).join('  •  ');

  return (
    <div 
      className="w-full py-2 overflow-hidden"
      style={{ 
        backgroundColor: tickers[0]?.bgColor || '#22C55E',
        color: tickers[0]?.textColor || '#FFFFFF'
      }}
    >
      <div className="relative flex overflow-x-hidden">
        <div className="animate-marquee whitespace-nowrap flex">
          <span className="mx-4 text-sm font-medium">
            {tickerContent}
          </span>
          <span className="mx-4 text-sm font-medium">
            {tickerContent}
          </span>
        </div>
        <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex">
          <span className="mx-4 text-sm font-medium">
            {tickerContent}
          </span>
          <span className="mx-4 text-sm font-medium">
            {tickerContent}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;
