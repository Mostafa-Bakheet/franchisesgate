import { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Phone,
  Video,
  Calendar,
  Star,
  Building2,
  MapPin,
  BadgeCheck,
  ChevronRight,
  User
} from 'lucide-react';

const FranchiseOwnerChat = ({ externalOpen, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [activeTab, setActiveTab] = useState('owners'); // owners, chat

  // Handle external control
  useEffect(() => {
    if (externalOpen) {
      setIsOpen(true);
    }
  }, [externalOpen]);

  const handleClose = () => {
    setIsOpen(false);
    setSelectedOwner(null);
    setActiveTab('owners');
    setMessages([]);
    onClose?.();
  };

  // Sample franchise owners
  const owners = [
    {
      id: 1,
      name: 'أحمد العلي',
      franchise: 'كوفي لاونا',
      location: 'الرياض',
      avatar: 'أ',
      rating: 4.9,
      reviews: 127,
      experience: '3 سنوات',
      status: 'online',
      responseTime: 'خلال دقائق',
      successStory: 'بدأت بفرع واحد والآن عندي 3 فروع!',
      expertise: ['الرياض', 'المقاهي', 'التشغيل'],
      isVerified: true,
      stats: {
        monthlyRevenue: '180,000',
        roi: '28%',
        employees: 12
      }
    },
    {
      id: 2,
      name: 'محمد السالم',
      franchise: 'مطبخ زاد',
      location: 'جدة',
      avatar: 'م',
      rating: 4.8,
      reviews: 89,
      experience: '5 سنوات',
      status: 'online',
      responseTime: 'خلال ساعة',
      successStory: 'من طباخ إلى صاحب سلسلة مطاعم',
      expertise: ['جدة', 'المطاعم', 'المطبخ'],
      isVerified: true,
      stats: {
        monthlyRevenue: '350,000',
        roi: '25%',
        employees: 25
      }
    },
    {
      id: 3,
      name: 'سارة القحطاني',
      franchise: 'صيدلية الصحة',
      location: 'الدمام',
      avatar: 'س',
      rating: 4.7,
      reviews: 156,
      experience: '4 سنوات',
      status: 'offline',
      responseTime: 'خلال يوم',
      successStory: 'الصيدلية الأولى المتواجدة 24/7 في المنطقة',
      expertise: ['الدمام', 'الصيدليات', 'الرعاية الصحية'],
      isVerified: true,
      stats: {
        monthlyRevenue: '220,000',
        roi: '22%',
        employees: 8
      }
    },
    {
      id: 4,
      name: 'فهد الشمري',
      franchise: 'مغسلة السيارات الذكية',
      location: 'أبها',
      avatar: 'ف',
      rating: 4.6,
      reviews: 67,
      experience: '2 سنة',
      status: 'online',
      responseTime: 'خلال دقائق',
      successStory: 'تقنية جديدة جذبت العملاء بسرعة',
      expertise: ['أبها', 'خدمات السيارات', 'التقنية'],
      isVerified: true,
      stats: {
        monthlyRevenue: '95,000',
        roi: '30%',
        employees: 6
      }
    }
  ];

  const startChat = (owner) => {
    setSelectedOwner(owner);
    setActiveTab('chat');
    setMessages([
      {
        id: 1,
        type: 'owner',
        text: `مرحباً! 👋\nأنا ${owner.name}، صاحب ${owner.franchise} في ${owner.location}.\n\nكيف أقدر أساعدك في رحلة الاستثمار؟`,
        time: new Date()
      }
    ]);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg = {
      id: Date.now(),
      type: 'user',
      text: inputValue,
      time: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Simulate owner response
    setTimeout(() => {
      const responses = [
        'شكراً على سؤالك! 💡\n\nخبرتي في هذا المجال تقول إن النجاح يعتمد على 3 عوامل رئيسية: الموقع، الجودة، والخدمة.',
        'سؤال ممتاز! 👍\n\nبناءً على تجربتي، أنصحك تبدأ بدراسة السوق في منطقتك جيداً.',
        'أنا حاب أساعدك! 😊\n\nممكن نحجز مكالمة 15 دقيقة عشان أشرحلك التفاصيل أكثر؟',
        'تمام! 🤝\n\nالاستثمار الأولي كان حوالي 200 ألف ريال واسترددتها في 14 شهر.',
        'بالتأكيد! 🎯\n\nأكبر تحدي واجهته كان التوظيف، لكن بعد ما طبقنا نظام التدريب الخاص، الأمور تحسنت كثير.'
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'owner',
        text: randomResponse,
        time: new Date()
      }]);
    }, 1500 + Math.random() * 2000);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold">
                {activeTab === 'owners' ? 'تواصل مع أصحاب الفرنشايز' : selectedOwner?.name}
              </h3>
              <p className="text-white/70 text-xs">
                {activeTab === 'owners' 
                  ? 'اسألهم عن تجربتهم الحقيقية' 
                  : `${selectedOwner?.franchise} - ${selectedOwner?.location}`}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {activeTab === 'owners' ? (
          /* Owners List */
          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-4">
              <p className="text-dark-2/70 text-sm">
                تواصل مباشرة مع أصحاب الفرنشايز الناجحين. اسألهم عن تجربتهم، التحديات، والنصائح.
              </p>
            </div>

            <div className="space-y-3">
              {owners.map((owner) => (
                <div
                  key={owner.id}
                  onClick={() => startChat(owner)}
                  className="bg-gray-50 rounded-2xl p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {owner.avatar}
                      </div>
                      {owner.status === 'online' && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-dark-1">{owner.name}</span>
                        {owner.isVerified && (
                          <BadgeCheck className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3 text-sm text-dark-2/70 mb-2">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {owner.franchise}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {owner.location}
                        </span>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-xs mb-2">
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          {owner.rating} ({owner.reviews})
                        </span>
                        <span className="text-green-600 font-medium">
                          {owner.stats.roi} ROI
                        </span>
                        <span className="text-dark-2/60">
                          {owner.experience}
                        </span>
                      </div>

                      {/* Success Story */}
                      <p className="text-sm text-dark-2/70 italic">
                        "{owner.successStory}"
                      </p>

                      {/* Response Time */}
                      <div className="flex items-center justify-between mt-3">
                        <span className={`text-xs ${owner.status === 'online' ? 'text-green-600' : 'text-dark-2/50'}`}>
                          {owner.status === 'online' ? '🟢 متصل الآن' : '⚪ غير متصل'} • {owner.responseTime}
                        </span>
                        <button className="text-primary text-sm font-medium flex items-center gap-1">
                          ابدأ المحادثة
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-6 bg-gradient-to-r from-primary/20 to-primary/5 rounded-2xl p-5 text-center">
              <h4 className="font-bold text-dark-1 mb-2">هل أنت صاحب فرنشايز ناجح؟</h4>
              <p className="text-sm text-dark-2/70 mb-4">
                انضم لشبكتنا وساعد المستثمرين الجدد في رحلتهم
              </p>
              <button className="bg-dark-1 text-white px-6 py-2.5 rounded-full font-bold hover:bg-dark-2 transition-colors">
                انضم كمستشار
              </button>
            </div>
          </div>
        ) : (
          /* Chat Interface */
          <>
            {/* Owner Info Bar */}
            <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center text-white font-bold">
                  {selectedOwner.avatar}
                </div>
                <div>
                  <span className="text-sm font-bold text-dark-1 block">{selectedOwner.name}</span>
                  <span className="text-xs text-dark-2/60">
                    {selectedOwner.status === 'online' ? 'متصل الآن' : selectedOwner.responseTime}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                  <Phone className="w-4 h-4 text-dark-2" />
                </button>
                <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                  <Video className="w-4 h-4 text-dark-2" />
                </button>
                <button className="w-9 h-9 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                  <Calendar className="w-4 h-4 text-dark-2" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.type === 'owner' && (
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center text-white text-sm font-bold mr-2 flex-shrink-0">
                      {selectedOwner.avatar}
                    </div>
                  )}
                  <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                    msg.type === 'user' 
                      ? 'bg-dark-1 text-white rounded-br-md' 
                      : 'bg-gray-100 text-dark-1 rounded-bl-md'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                    <span className="text-xs opacity-60 mt-1 block">{formatTime(msg.time)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Suggestions */}
            <div className="px-4 py-2 border-t bg-gray-50">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {['كم الاستثمار الأولي؟', 'كم مدة الاسترداد؟', 'أكبر تحدي واجهتك؟', 'نصيحة للمبتدئين؟', 'هل أنصح بالمنطقة؟'].map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputValue(suggestion);
                      setTimeout(() => handleSend(), 100);
                    }}
                    className="bg-white border border-gray-200 px-3 py-1.5 rounded-full text-xs text-dark-2 whitespace-nowrap hover:border-primary transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2">
                <button
                  onClick={() => setActiveTab('owners')}
                  className="text-dark-2 hover:text-dark-1 transition-colors"
                >
                  <ChevronRight className="w-5 h-5 rotate-180" />
                </button>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="اكتب رسالتك..."
                  className="flex-1 bg-transparent border-none outline-none text-sm text-dark-1 placeholder:text-gray-400"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className="w-9 h-9 bg-primary text-dark-1 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/80 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FranchiseOwnerChat;
