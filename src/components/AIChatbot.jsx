import { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Loader2, 
  MessageSquare,
  Sparkles,
  ChevronRight,
  HelpCircle,
  TrendingUp,
  Building2,
  Calculator
} from 'lucide-react';

const AIChatbot = ({ externalOpen, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'مرحباً! أنا مساعدك الذكي 👋\n\nأقدر أساعدك في:\n• اختيار الفرنشايز المناسب لك\n• الإجابة على استفساراتك\n• حجز استشارة مجانية\n• حساب العائد المتوقع',
      suggestions: ['أبحث عن فرنشايز', 'احسب عائدي', 'احجز استشارة']
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Handle external control
  useEffect(() => {
    if (externalOpen) {
      setIsOpen(true);
    }
  }, [externalOpen]);

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // AI Response Generator
  const generateResponse = (userMessage) => {
    const lowerMsg = userMessage.toLowerCase();
    
    // Franchise search patterns
    if (lowerMsg.includes('فرنشايز') || lowerMsg.includes('بحث') || lowerMsg.includes('ابحث')) {
      return {
        text: 'بالتأكيد! دعني أساعدك في البحث. ما نوع الفرنشايز اللي تفضله؟',
        suggestions: ['مطاعم وكافيهات', 'صيدليات', 'محلات تجارية', 'خدمات', 'أي شي مربح'],
        action: 'search'
      };
    }
    
    // Budget patterns
    if (lowerMsg.includes('ميزانية') || lowerMsg.includes('سعر') || lowerMsg.includes('تكلفة') || lowerMsg.includes('فلوس')) {
      return {
        text: 'ما ميزانيتك المتوقعة للاستثمار؟\n\nعندنا فرنشايزات تناسب كل الميزانيات من 50,000 إلى 5,000,000 ريال.',
        suggestions: ['50,000 - 100,000', '100,000 - 300,000', '300,000 - 1,000,000', 'أكثر من مليون'],
        action: 'budget'
      };
    }
    
    // ROI/Calculator patterns
    if (lowerMsg.includes('عائد') || lowerMsg.includes('ربح') || lowerMsg.includes('احسب') || lowerMsg.includes('calculator')) {
      return {
        text: 'حاسبة العائد الذكية جاهزة! 💰\n\nاختر الفرنشايز وإحنا نحسبلك:\n• العائد السنوي المتوقع\n• فترة استرداد رأس المال\n• صافي الربح الشهري',
        suggestions: ['افتح الحاسبة', 'أريد توصية AI', 'اعرض لي الأكثر ربحاً'],
        action: 'calculator'
      };
    }
    
    // Consultation patterns
    if (lowerMsg.includes('استشارة') || lowerMsg.includes('حجز') || lowerMsg.includes('موعد') || lowerMsg.includes('اتكلم') || lowerMsg.includes('خبير')) {
      return {
        text: 'ممتاز! خبراؤنا جاهزين يساعدوك 👨‍💼\n\nالاستشارة مجانية وبتشمل:\n• تحليل ملفك الاستثماري\n• توصية مخصصة\n• خطة عمل مبدئية',
        suggestions: ['احجز استشارة الآن', 'اتصل بنا مباشرة', 'أرسل استفساري'],
        action: 'consultation'
      };
    }
    
    // Location patterns
    if (lowerMsg.includes('مدينة') || lowerMsg.includes('مكان') || lowerMsg.includes('الرياض') || lowerMsg.includes('جدة') || lowerMsg.includes('الدمام')) {
      return {
        text: 'الموقع مهم جداً! 📍\n\nعندنا فرنشايزات متاحة في كل المدن السعودية الكبرى. وين تفضل تفتح مشروعك؟',
        suggestions: ['الرياض', 'جدة', 'الدمام', 'مكة', 'المدينة', 'أبها'],
        action: 'location'
      };
    }
    
    // Experience patterns
    if (lowerMsg.includes('خبرة') || lowerMsg.includes('جديد') || lowerMsg.includes('مبتدئ') || lowerMsg.includes('أول مرة')) {
      return {
        text: 'لا تشيل هم! 70% من ناجحينا كانوا مبتدئين 🌟\n\nعندنا فرنشايزات "صديقة للمبتدئين" مع:\n• تدريب شامل\n• دعم مستمر\n• دليل تشغيلي مفصل',
        suggestions: ['فرنشايز للمبتدئين', 'أحتاج تدريب', 'اعرض الخيارات السهلة'],
        action: 'beginner'
      };
    }
    
    // Greeting patterns
    if (lowerMsg.includes('مرحبا') || lowerMsg.includes('هلا') || lowerMsg.includes('السلام')) {
      return {
        text: 'أهلاً وسهلاً! 🎉\n\nكيف أقدر أساعدك اليوم؟',
        suggestions: ['أبحث عن فرنشايز', 'أحسب عائدي', 'عندي سؤال'],
        action: 'greeting'
      };
    }
    
    // Default response
    return {
      text: 'فهمت عليك! 🤔\n\nعشان أساعدك بشكل أفضل، وضحلي أكثر عن:\n• اهتماماتك\n• ميزانيتك\n• المدينة المفضلة',
      suggestions: ['ابدأ من جديد', 'احجز استشارة', 'شوف الفرنشايز المتاحة'],
      action: 'default'
    };
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMsg = inputValue.trim();
    setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: userMsg }]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking
    setTimeout(() => {
      const response = generateResponse(userMsg);
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'bot',
        text: response.text,
        suggestions: response.suggestions,
        action: response.action
      }]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    // Auto send after a short delay
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} };
      handleSend();
    }, 100);
  };

  const handleQuickAction = (action) => {
    switch(action) {
      case 'calculator':
        // Trigger calculator from parent
        onClose?.();
        break;
      case 'search':
        // Open gallery
        window.location.href = '/gallery';
        break;
      case 'consultation':
        // Show consultation form
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'bot',
          text: 'تمام! دخل بياناتك وهنتواصل معاك في أقل من 24 ساعة 📞',
          form: 'consultation'
        }]);
        break;
      default:
        break;
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold flex items-center gap-2">
                مساعد NFT الذكي
                <Sparkles className="w-4 h-4" />
              </h3>
              <p className="text-white/70 text-xs">متاح 24/7 لخدمتك</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[50vh]">
          {messages.map((msg) => (
            <div key={msg.id}>
              <div className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                  msg.type === 'user' 
                    ? 'bg-dark-1 text-white rounded-br-md' 
                    : 'bg-gray-100 text-dark-1 rounded-bl-md'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                </div>
              </div>
              
              {/* Suggestions */}
              {msg.suggestions && (
                <div className="flex flex-wrap gap-2 mt-2 justify-end">
                  {msg.suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="bg-primary/10 hover:bg-primary/20 text-dark-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1"
                    >
                      {suggestion}
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              )}

              {/* Consultation Form */}
              {msg.form === 'consultation' && (
                <div className="mt-3 bg-gray-50 rounded-xl p-4">
                  <input
                    type="text"
                    placeholder="الاسم الكامل"
                    className="w-full mb-2 px-3 py-2 rounded-lg border border-gray-200 text-sm"
                  />
                  <input
                    type="tel"
                    placeholder="رقم الجوال"
                    className="w-full mb-2 px-3 py-2 rounded-lg border border-gray-200 text-sm"
                  />
                  <input
                    type="email"
                    placeholder="البريد الإلكتروني (اختياري)"
                    className="w-full mb-3 px-3 py-2 rounded-lg border border-gray-200 text-sm"
                  />
                  <button
                    onClick={() => {
                      setMessages(prev => [...prev, {
                        id: Date.now(),
                        type: 'bot',
                        text: 'تم إرسال طلبك! 🎉\n\nسنتواصل معاك خلال 24 ساعة.',
                        suggestions: ['عرض الفرنشايز', 'المحادثة الحية']
                      }]);
                    }}
                    className="w-full bg-dark-1 text-white py-2 rounded-lg font-bold text-sm hover:bg-dark-2 transition-colors"
                  >
                    إرسال الطلب
                  </button>
                </div>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-dark-2" />
                <span className="text-xs text-dark-2">يكتب...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="اكتب سؤالك هنا..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-dark-1 placeholder:text-gray-400"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              className="w-9 h-9 bg-primary text-dark-1 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/80 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          
          {/* Quick Actions */}
          <div className="flex gap-2 mt-3 justify-center">
            <button
              onClick={() => handleQuickAction('search')}
              className="flex items-center gap-1 text-xs text-dark-2 hover:text-dark-1 transition-colors"
            >
              <Building2 className="w-4 h-4" />
              الفرنشايز
            </button>
            <button
              onClick={() => handleQuickAction('calculator')}
              className="flex items-center gap-1 text-xs text-dark-2 hover:text-dark-1 transition-colors"
            >
              <Calculator className="w-4 h-4" />
              الحاسبة
            </button>
            <button
              onClick={() => handleQuickAction('consultation')}
              className="flex items-center gap-1 text-xs text-dark-2 hover:text-dark-1 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              استشارة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;
