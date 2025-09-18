import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Stethoscope, User, MessageCircle, Shield, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui/status-badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { usePatientData } from '@/hooks/usePatientData';
import { useChatMessages } from '@/hooks/useChatMessages';

const Chat = () => {
  const navigate = useNavigate();
  const { currentPatient, loading: patientLoading } = usePatientData();
  const { messages, loading: messagesLoading, isTyping, sendMessage } = useChatMessages(currentPatient?.id || null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Redirect if no patient data
  useEffect(() => {
    if (!patientLoading && !currentPatient) {
      navigate('/');
    }
  }, [currentPatient, patientLoading, navigate]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    sendMessage(newMessage);
    setNewMessage('');
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (patientLoading || messagesLoading) {
    return (
      <div className="min-h-screen healthcare-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!currentPatient) {
    return null; // Will redirect
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4">
        <div className="container mx-auto max-w-4xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="text-primary hover:text-primary-hover"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-primary" />
              <span className="font-medium">Dr. Sarah Johnson</span>
              <StatusBadge variant="success" size="sm">
                Online
              </StatusBadge>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span>Secure Chat</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <div className="container mx-auto max-w-4xl h-full">
          <ScrollArea className="h-full p-4">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Welcome to your consultation!</h3>
                  <p className="text-muted-foreground">Dr. Sarah Johnson is ready to help you.</p>
                  <p className="text-sm text-muted-foreground mt-2">Start the conversation by sending a message below.</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "patient" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[70%] ${message.sender === "patient" ? "order-2" : "order-1"}`}>
                      <div
                        className={`rounded-lg px-4 py-3 ${
                          message.sender === "patient"
                            ? "bg-primary text-primary-foreground"
                            : "bg-card border border-border"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {message.sender === "doctor" ? (
                            <Stethoscope className="w-4 h-4 text-primary" />
                          ) : (
                            <User className="w-4 h-4" />
                          )}
                          <span className="text-xs font-medium">
                            {message.sender === "doctor" ? "Dr. Sarah Johnson" : "You"}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === "patient" 
                            ? "text-primary-foreground/70" 
                            : "text-muted-foreground"
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[70%]">
                    <div className="bg-card border border-border rounded-lg px-4 py-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Stethoscope className="w-4 h-4 text-primary" />
                        <span className="text-xs font-medium">Dr. Sarah Johnson</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-xs text-muted-foreground ml-2">typing...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-card border-t border-border p-4">
        <div className="container mx-auto max-w-4xl">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <Input
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message to Dr. Johnson..."
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={!newMessage.trim() || isTyping}
              className="bg-primary hover:bg-primary-hover text-primary-foreground"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span>End-to-end encrypted</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Response time: ~2 minutes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;