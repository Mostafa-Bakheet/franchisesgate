import { useState, useEffect } from 'react';
import { 
  Plus, 
  X, 
  Gamepad2, 
  Brain, 
  Scale, 
  Activity,
  MapPin,
  ChevronUp,
  Sparkles,
  Target,
  TrendingUp,
  Bot,
  MessageCircle
} from 'lucide-react';
import WhatsAppButton from './WhatsAppButton';

const FloatingActionMenu = ({ 
  page = 'home',
  onOpenSimulator,
  onOpenAICalculator,
  onOpenCompare,
  onOpenJourney,
  onOpenChatbot,
  onOpenMap,
  onOpenOwnerChat,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);
  const [activeComponent, setActiveComponent] = useState(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && !e.target.closest('.fab-menu-container')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  const menuItems = page === 'home' ? [
    {
      id: 'chatbot',
      label: 'مساعد NFT الذكي',
      desc: 'AI يساعدك في اختيار الفرنشايز',
      icon: Bot,
      color: 'from-violet-500 to-purple-600',
      badge: '24/7',
      onClick: () => {
        onOpenChatbot?.();
        setActiveComponent('chatbot');
        setIsOpen(false);
      }
    },
    {
      id: 'map',
      label: 'خريطة الفرص',
      desc: 'اكتشف الفرنشايز في مدن المملكة',
      icon: MapPin,
      color: 'from-blue-500 to-cyan-500',
      onClick: () => {
        onOpenMap?.();
        setActiveComponent('map');
        setIsOpen(false);
      }
    },
    {
      id: 'simulator',
      label: 'محاكي الفرنشايز',
      desc: 'جرب إدارة فرنشايز لمدة 30 يوم',
      icon: Gamepad2,
      color: 'from-pink-500 to-purple-600',
      onClick: () => {
        onOpenSimulator?.();
        setActiveComponent('simulator');
        setIsOpen(false);
      }
    },
    {
      id: 'ai-calculator',
      label: 'حاسبة AI',
      desc: 'اكتشف أي الفرنشايز يناسبك',
      icon: Brain,
      color: 'from-purple-600 to-blue-600',
      onClick: () => {
        onOpenAICalculator?.();
        setActiveComponent('ai-calculator');
        setIsOpen(false);
      }
    },
    {
      id: 'journey',
      label: 'رحلتك معنا',
      desc: 'تتبع تقدمك وإنجازاتك',
      icon: Target,
      color: 'from-green-500 to-emerald-600',
      badge: '4 خطوات',
      onClick: () => {
        onOpenJourney?.();
        setActiveComponent('journey');
        setIsOpen(false);
      }
    },
    {
      id: 'owner-chat',
      label: 'تواصل مع أصحاب الفرنشايز',
      desc: 'اسأل عن تجربتهم الحقيقية',
      icon: MessageCircle,
      color: 'from-orange-500 to-amber-500',
      onClick: () => {
        onOpenOwnerChat?.();
        setActiveComponent('owner-chat');
        setIsOpen(false);
      }
    },
  ] : [
    {
      id: 'chatbot',
      label: 'مساعد NFT الذكي',
      desc: 'AI يساعدك في اختيار الفرنشايز',
      icon: Bot,
      color: 'from-violet-500 to-purple-600',
      badge: '24/7',
      onClick: () => {
        onOpenChatbot?.();
        setActiveComponent('chatbot');
        setIsOpen(false);
      }
    },
    {
      id: 'map',
      label: 'خريطة الفرص',
      desc: 'اكتشف الفرنشايز في مدن المملكة',
      icon: MapPin,
      color: 'from-blue-500 to-cyan-500',
      onClick: () => {
        onOpenMap?.();
        setActiveComponent('map');
        setIsOpen(false);
      }
    },
    {
      id: 'simulator',
      label: 'محاكي الفرنشايز',
      desc: 'جرب إدارة فرنشايز لمدة 30 يوم',
      icon: Gamepad2,
      color: 'from-pink-500 to-purple-600',
      onClick: () => {
        onOpenSimulator?.();
        setActiveComponent('simulator');
        setIsOpen(false);
      }
    },
    {
      id: 'compare',
      label: 'قارن الفرنشايز',
      desc: 'قارن بين 3 فرنشايزات',
      icon: Scale,
      color: 'from-blue-500 to-indigo-600',
      onClick: () => {
        onOpenCompare?.();
        setActiveComponent('compare');
        setIsOpen(false);
      }
    },
    {
      id: 'ai-calculator',
      label: 'حاسبة AI',
      desc: 'اكتشف أي الفرنشايز يناسبك',
      icon: Brain,
      color: 'from-purple-600 to-blue-600',
      onClick: () => {
        onOpenAICalculator?.();
        setActiveComponent('ai-calculator');
        setIsOpen(false);
      }
    },
    {
      id: 'journey',
      label: 'رحلتك معنا',
      desc: 'تتبع تقدمك وإنجازاتك',
      icon: Target,
      color: 'from-green-500 to-emerald-600',
      badge: '4 خطوات',
      onClick: () => {
        onOpenJourney?.();
        setActiveComponent('journey');
        setIsOpen(false);
      }
    },
    {
      id: 'owner-chat',
      label: 'تواصل مع أصحاب الفرنشايز',
      desc: 'اسأل عن تجربتهم الحقيقية',
      icon: MessageCircle,
      color: 'from-orange-500 to-amber-500',
      onClick: () => {
        onOpenOwnerChat?.();
        setActiveComponent('owner-chat');
        setIsOpen(false);
      }
    }
  ];

  return (
    <>
      {/* WhatsApp Button - Above FAB */}
      <div className="fixed bottom-24 right-6 z-50">
        <WhatsAppButton />
      </div>

      {/* Main FAB Menu */}
      <div className="fab-menu-container fixed bottom-6 right-6 z-50">
      {/* Menu Items - positioned to the right */}
      <div className={`absolute bottom-full right-0 mb-4 space-y-3 transition-all duration-300 ${
        isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}>
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={item.onClick}
              className={`flex items-center gap-3 group transform transition-all duration-300 ${
                isOpen ? 'translate-x-0' : 'translate-x-4'
              }`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              {/* Icon Button */}
              <div className={`w-14 h-14 bg-gradient-to-r ${item.color} rounded-2xl shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform relative`}>
                <Icon className="w-6 h-6" />
                {item.pulse && (
                  <>
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></span>
                  </>
                )}
                {item.badge && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-dark-1 text-xs font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <div className="bg-white px-4 py-2 rounded-full shadow-lg text-right whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="font-bold text-dark-1 text-sm">{item.label}</div>
                <div className="text-xs text-dark-2/60">{item.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

       {/* Main FAB Button - Hidden temporarily */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`hidden w-16 h-16 rounded-2xl shadow-2xl flex items-center justify-center text-white transition-all duration-300 hover:scale-105 pointer-events-auto ${
          isOpen 
            ? 'bg-dark-1 rotate-45' 
            : 'bg-gradient-to-r from-primary to-primary/80'
        }`}
        style={{ touchAction: 'manipulation' }}
      >
        {isOpen ? (
          <X className="w-8 h-8 pointer-events-none" />
        ) : (
          <div className="relative pointer-events-none">
            <Plus className="w-8 h-8" />
            {hasNotifications && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </div>
        )}
      </button>
    </div>
    </>
  );
};

export default FloatingActionMenu;
