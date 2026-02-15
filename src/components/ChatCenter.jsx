import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { 
  MessageCircle, 
  X, 
  Send, 
  Phone,
  Video,
  Calendar,
  MoreVertical,
  Paperclip,
  Smile,
  ChevronLeft,
  Archive,
  Flag,
  Check,
  CheckCheck,
  Clock,
  AlertCircle,
  User
} from 'lucide-react';

import { SOCKET_URL } from '../config.js';

// Socket.io connection
const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling']
});

// Shared Chat Center Component - Used in both Owner and Admin dashboards
const ChatCenter = ({ 
  conversations = [], 
  activeConversation,
  currentUser,
  userRole,
  onSelectConversation,
  onSendMessage,
  onCloseConversation,
  onAddNote,
  loading = false,
  showNotes = false,
  allowClose = true
}) => {
  const [messageInput, setMessageInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [localMessages, setLocalMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize local messages from props
  useEffect(() => {
    if (activeConversation?.messages) {
      setLocalMessages(activeConversation.messages);
    }
  }, [activeConversation?.messages]);

  // Socket.io connection handlers
  useEffect(() => {
    // Listen for new messages
    socket.on('new_message', (data) => {
      if (data.conversationId === activeConversation?.id) {
        setLocalMessages(prev => [...prev, data.message]);
        // Mark as read if we're in the conversation
        socket.emit('mark_read', {
          conversationId: data.conversationId,
          userId: currentUser?.id
        });
      }
    });

    // Listen for messages read
    socket.on('messages_read', (data) => {
      if (data.conversationId === activeConversation?.id) {
        setLocalMessages(prev => 
          prev.map(msg => ({ ...msg, status: 'READ' }))
        );
      }
    });

    // Listen for typing indicator
    socket.on('user_typing', (data) => {
      if (data.conversationId === activeConversation?.id && data.userId !== currentUser?.id) {
        setIsTyping(data.isTyping);
      }
    });

    return () => {
      socket.off('new_message');
      socket.off('messages_read');
      socket.off('user_typing');
    };
  }, [activeConversation?.id, currentUser?.id]);

  // Join/Leave conversation room
  useEffect(() => {
    if (activeConversation?.id) {
      socket.emit('join_conversation', activeConversation.id);
      
      return () => {
        socket.emit('leave_conversation', activeConversation.id);
      };
    }
  }, [activeConversation?.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [localMessages]);

  // Typing indicator handler
  const handleTyping = (typing) => {
    if (activeConversation?.id) {
      socket.emit('typing', {
        conversationId: activeConversation.id,
        userId: currentUser?.id,
        isTyping: typing
      });
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeConversation?.id) return;

    const senderType = userRole === 'FRANCHISE_OWNER' ? 'OWNER' : 'INVESTOR';
    
    // Send via Socket.io
    socket.emit('send_message', {
      conversationId: activeConversation.id,
      content: messageInput,
      senderId: currentUser?.id,
      senderName: currentUser?.name || 'User',
      senderType: senderType
    });

    // Also call the API method if provided
    onSendMessage(activeConversation.id, messageInput);
    setMessageInput('');
    handleTyping(false);
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    onAddNote?.(activeConversation.id, noteInput);
    setNoteInput('');
    setShowNoteForm(false);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('ar-SA', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'SENT': return <Clock className="w-3 h-3 text-gray-400" />;
      case 'DELIVERED': return <Check className="w-3 h-3 text-gray-400" />;
      case 'READ': return <CheckCheck className="w-3 h-3 text-blue-500" />;
      default: return null;
    }
  };

  // Sidebar - Conversations List
  const ConversationList = () => (
    <div className="w-full md:w-80 bg-white border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-dark-1 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            المحادثات
          </h2>
          {loading && (
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          )}
        </div>
        <p className="text-sm text-dark-2/60 mt-1">
          {conversations.length} محادثة
        </p>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-8 text-center">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-dark-2/60 text-sm">لا توجد محادثات</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => onSelectConversation(conv)}
                className={`w-full p-4 text-right hover:bg-gray-50 transition-colors ${
                  activeConversation?.id === conv.id ? 'bg-primary/5 border-l-2 border-primary' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {conv.participantName?.charAt(0) || '?'}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    {/* Name & Time */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-dark-1 truncate">
                        {conv.participantName}
                      </span>
                      <span className="text-xs text-dark-2/40 whitespace-nowrap">
                        {conv.lastMessageAt && formatTime(conv.lastMessageAt)}
                      </span>
                    </div>
                    
                    {/* Franchise Name */}
                    <p className="text-xs text-primary mt-0.5">
                      {conv.franchise?.name}
                    </p>
                    
                    {/* Last Message */}
                    <p className="text-sm text-dark-2/70 truncate mt-1">
                      {conv.messages?.[0]?.content || 'لا رسائل'}
                    </p>
                    
                    {/* Status & Unread */}
                    <div className="flex items-center gap-2 mt-2">
                      {conv.unreadCount > 0 && (
                        <span className="bg-primary text-dark-1 text-xs px-2 py-0.5 rounded-full font-medium">
                          {conv.unreadCount}
                        </span>
                      )}
                      {conv.status === 'CLOSED' && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Archive className="w-3 h-3" />
                          مغلقة
                        </span>
                      )}
                      {conv.priority === 'urgent' && (
                        <span className="text-xs text-red-500 flex items-center gap-1">
                          <Flag className="w-3 h-3" />
                          عاجل
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Main Chat Area
  const ChatArea = () => {
    if (!activeConversation) {
      return (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-dark-2/60">اختر محادثة لبدء الدردشة</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col bg-white h-full">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => onSelectConversation(null)}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center text-white font-bold">
              {activeConversation.participantName?.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-dark-1">{activeConversation.participantName}</h3>
              <p className="text-xs text-dark-2/60">
                {activeConversation.franchise?.name} • 
                {activeConversation.participantEmail}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg text-dark-2/60 hover:text-primary transition-colors">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg text-dark-2/60 hover:text-primary transition-colors">
              <Video className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg text-dark-2/60 hover:text-primary transition-colors">
              <Calendar className="w-5 h-5" />
            </button>
            {allowClose && (
              <button 
                onClick={() => onCloseConversation?.(activeConversation.id)}
                className="p-2 hover:bg-gray-100 rounded-lg text-red-500 hover:text-red-600 transition-colors"
                title="إغلاق المحادثة"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Messages */}
          <div className={`flex-1 flex flex-col ${showNotes ? 'hidden md:flex' : ''}`}>
            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Subject */}
              {activeConversation.subject && (
                <div className="text-center">
                  <span className="inline-block bg-gray-100 text-dark-2/70 text-sm px-4 py-2 rounded-full">
                    الموضوع: {activeConversation.subject}
                  </span>
                </div>
              )}

              {/* Messages */}
              {localMessages?.map((msg, index) => {
                const isMe = msg.senderType === (userRole === 'FRANCHISE_OWNER' ? 'OWNER' : 'INVESTOR');
                const showDate = index === 0 || 
                  new Date(msg.createdAt).toDateString() !== 
                  new Date(localMessages[index - 1]?.createdAt).toDateString();

                return (
                  <div key={msg.id}>
                    {showDate && (
                      <div className="text-center my-4">
                        <span className="text-xs text-dark-2/40 bg-gray-100 px-3 py-1 rounded-full">
                          {formatDate(msg.createdAt)}
                        </span>
                      </div>
                    )}
                    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] ${isMe ? 'order-2' : 'order-1'}`}>
                        <div className={`px-4 py-3 rounded-2xl ${
                          isMe 
                            ? 'bg-primary text-dark-1 rounded-br-md' 
                            : 'bg-gray-100 text-dark-1 rounded-bl-md'
                        }`}>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        </div>
                        <div className={`flex items-center gap-1 mt-1 ${isMe ? 'justify-start' : 'justify-end'}`}>
                          <span className="text-xs text-dark-2/40">{formatTime(msg.createdAt)}</span>
                          {isMe && getStatusIcon(msg.status)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            {activeConversation.status !== 'CLOSED' ? (
              <form onSubmit={handleSend} className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <button type="button" className="p-2 text-dark-2/40 hover:text-primary transition-colors">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => {
                      setMessageInput(e.target.value);
                      handleTyping(e.target.value.length > 0);
                    }}
                    placeholder="اكتب رسالتك..."
                    className="flex-1 px-4 py-2 bg-gray-100 rounded-full border-none outline-none text-dark-1 placeholder:text-dark-2/40"
                  />
                  <button type="button" className="p-2 text-dark-2/40 hover:text-primary transition-colors">
                    <Smile className="w-5 h-5" />
                  </button>
                  <button
                    type="submit"
                    disabled={!messageInput.trim()}
                    className="p-2 bg-primary text-dark-1 rounded-full hover:bg-primary/80 transition-colors disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-4 border-t border-gray-200 text-center">
                <p className="text-dark-2/60 text-sm">المحادثة مغلقة</p>
              </div>
            )}
          </div>

          {/* Notes Panel */}
          {showNotes && (
            <div className="w-80 border-r border-gray-200 bg-gray-50 flex flex-col">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-bold text-dark-1 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-primary" />
                  ملاحظات
                </h3>
                <button
                  onClick={() => setShowNoteForm(!showNoteForm)}
                  className="text-xs bg-primary text-dark-1 px-3 py-1 rounded-full hover:bg-primary/80"
                >
                  + ملاحظة
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {showNoteForm && (
                  <form onSubmit={handleAddNote} className="bg-white p-3 rounded-xl shadow-sm mb-4">
                    <textarea
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      placeholder="أضف ملاحظة..."
                      className="w-full p-2 border border-gray-200 rounded-lg text-sm resize-none"
                      rows={3}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setShowNoteForm(false)}
                        className="text-xs text-dark-2/60 hover:text-dark-2 px-3 py-1"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        disabled={!noteInput.trim()}
                        className="text-xs bg-dark-1 text-white px-3 py-1 rounded-lg disabled:opacity-50"
                      >
                        حفظ
                      </button>
                    </div>
                  </form>
                )}

                {activeConversation.notes?.map((note) => (
                  <div key={note.id} className="bg-white p-3 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-dark-1">{note.authorName}</span>
                      <span className="text-xs text-dark-2/40">{formatTime(note.createdAt)}</span>
                    </div>
                    <p className="text-sm text-dark-2/80">{note.content}</p>
                    {note.noteType !== 'internal' && (
                      <span className="inline-block mt-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                        {note.noteType}
                      </span>
                    )}
                  </div>
                )) || (
                  <p className="text-center text-dark-2/40 text-sm">لا توجد ملاحظات</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200">
      <ConversationList />
      <ChatArea />
    </div>
  );
};

export default ChatCenter;
