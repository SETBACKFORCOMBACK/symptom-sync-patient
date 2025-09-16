import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MedicalCard } from "@/components/ui/medical-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Send, 
  Stethoscope, 
  User, 
  MessageCircle,
  Shield,
  Clock
} from "lucide-react";

interface Message {
  id: string;
  sender: "patient" | "doctor";
  content: string;
  timestamp: Date;
  type?: "text" | "system";
}

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "doctor",
      content: "Hello! I'm Dr. Smith, and I've reviewed your symptoms. How are you feeling right now?",
      timestamp: new Date(Date.now() - 2000),
      type: "text"
    },
    {
      id: "system-1",
      sender: "doctor",
      content: "This conversation is encrypted and HIPAA compliant for your privacy.",
      timestamp: new Date(Date.now() - 1000),
      type: "system"
    }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    const patientMessage: Message = {
      id: Date.now().toString(),
      sender: "patient",
      content: newMessage,
      timestamp: new Date(),
      type: "text"
    };

    setMessages(prev => [...prev, patientMessage]);
    setNewMessage("");
    setIsTyping(true);

    // Simulate doctor response
    setTimeout(() => {
      const doctorResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: "doctor",
        content: "Thank you for that information. Based on what you're describing, I'd like to ask a few more questions...",
        timestamp: new Date(),
        type: "text"
      };
      setMessages(prev => [...prev, doctorResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

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
              <span className="font-medium">Dr. Smith</span>
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
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "patient" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[70%] ${message.sender === "patient" ? "order-2" : "order-1"}`}>
                    <div
                      className={`rounded-lg px-4 py-3 ${
                        message.type === "system"
                          ? "bg-muted text-muted-foreground text-center text-sm italic"
                          : message.sender === "patient"
                          ? "bg-primary text-primary-foreground"
                          : "bg-card border border-border"
                      }`}
                    >
                      {message.type !== "system" && (
                        <div className="flex items-center gap-2 mb-1">
                          {message.sender === "doctor" ? (
                            <Stethoscope className="w-4 h-4 text-primary" />
                          ) : (
                            <User className="w-4 h-4" />
                          )}
                          <span className="text-xs font-medium">
                            {message.sender === "doctor" ? "Dr. Smith" : "You"}
                          </span>
                        </div>
                      )}
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.type === "system" 
                          ? "text-muted-foreground" 
                          : message.sender === "patient" 
                          ? "text-primary-foreground/70" 
                          : "text-muted-foreground"
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[70%]">
                    <div className="bg-card border border-border rounded-lg px-4 py-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Stethoscope className="w-4 h-4 text-primary" />
                        <span className="text-xs font-medium">Dr. Smith</span>
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
              placeholder="Type your message to the doctor..."
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