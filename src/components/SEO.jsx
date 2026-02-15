import { useEffect } from 'react';

const SEO = ({ 
  title, 
  description, 
  keywords = '',
  canonical = '',
  ogImage = '/og-image.jpg',
  noindex = false 
}) => {
  useEffect(() => {
    // Update title
    document.title = title ? `${title} | بوابة الامتيازات` : 'بوابة الامتيازات';
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);
    
    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    if (keywords) {
      metaKeywords.setAttribute('content', keywords);
    }
    
    // Update canonical
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    if (canonical) {
      linkCanonical.setAttribute('href', `https://franchisegate.sa${canonical}`);
    }
    
    // Update robots
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute('content', noindex ? 'noindex, nofollow' : 'index, follow');
    
    // Update Open Graph
    updateMetaProperty('og:title', title || 'بوابة الامتيازات');
    updateMetaProperty('og:description', description);
    updateMetaProperty('og:image', ogImage);
    if (canonical) {
      updateMetaProperty('og:url', `https://franchisegate.sa${canonical}`);
    }
    
    // Cleanup function
    return () => {
      // Reset to defaults if needed
    };
  }, [title, description, keywords, canonical, ogImage, noindex]);
  
  return null;
};

const updateMetaProperty = (property, content) => {
  let meta = document.querySelector(`meta[property="${property}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
};

export default SEO;
