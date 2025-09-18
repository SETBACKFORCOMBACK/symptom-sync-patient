import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ChatMessage {
  id: string;
  patient_id: string;
  sender: 'patient' | 'doctor';
  text: string;
  timestamp: string;
}

export const useChatMessages = (patientId: string | null) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();

  // Load messages for the patient
  const loadMessages = async () => {
    if (!patientId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('patient_id', patientId)
        .order('timestamp', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
        return;
      }

      setMessages((data || []) as ChatMessage[]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Send a message
  const sendMessage = async (text: string, sender: 'patient' | 'doctor' = 'patient') => {
    if (!patientId || !text.trim()) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          patient_id: patientId,
          sender,
          text: text.trim()
        })
        .select()
        .single();

      if (error) {
        console.error('Error sending message:', error);
        toast({
          title: "Error sending message",
          description: "Please try again.",
          variant: "destructive"
        });
        return;
      }

      // If it's a patient message, simulate doctor response
      if (sender === 'patient') {
        simulateDoctorResponse();
      }

      return data;
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  };

  // Simulate doctor typing and response
  const simulateDoctorResponse = () => {
    setIsTyping(true);
    
    // Show typing indicator for 2-4 seconds
    const typingDelay = 2000 + Math.random() * 2000;
    
    setTimeout(() => {
      setIsTyping(false);
      
      // Send doctor response
      const doctorResponses = [
        "Thank you for sharing that information. Can you tell me more about when these symptoms started?",
        "I understand. Have you experienced any similar symptoms before?",
        "That's helpful information. Are there any activities that make the symptoms better or worse?",
        "I see. On a scale of 1-10, how would you rate your current discomfort level?",
        "Thank you for the details. Based on what you've shared, I'd like to ask a few follow-up questions.",
        "I appreciate you being thorough. Are you currently taking any medications?",
        "That gives me a good understanding. Have you noticed any patterns with these symptoms?"
      ];
      
      const randomResponse = doctorResponses[Math.floor(Math.random() * doctorResponses.length)];
      sendMessage(randomResponse, 'doctor');
    }, typingDelay);
  };

  // Subscribe to real-time message updates
  useEffect(() => {
    if (!patientId) return;

    // Load initial messages
    loadMessages();

    // Set up real-time subscription
    const channel = supabase
      .channel('messages-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `patient_id=eq.${patientId}`
        },
        (payload) => {
          console.log('New message:', payload);
          setMessages(prev => [...prev, payload.new as ChatMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [patientId]);

  return {
    messages,
    loading,
    isTyping,
    sendMessage: (text: string) => sendMessage(text, 'patient'),
    loadMessages
  };
};