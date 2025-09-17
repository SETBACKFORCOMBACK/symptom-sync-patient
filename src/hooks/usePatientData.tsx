import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PatientData {
  id: string;
  name: string;
  age: number;
  gender: string;
  common_symptoms: string[];
  additional_symptoms?: string;
  urgency_level: string;
  status: string; // Changed from union type to string
  created_at: string;
  updated_at: string;
}

export interface PatientFormData {
  name: string;
  age: string;
  gender: string;
  symptoms: string;
  commonSymptoms: string[];
  urgency: string;
}

export const usePatientData = () => {
  const [currentPatient, setCurrentPatient] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Save patient data to Supabase
  const submitPatientData = async (formData: PatientFormData): Promise<string | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('patients')
        .insert({
          name: formData.name,
          age: parseInt(formData.age),
          gender: formData.gender,
          common_symptoms: formData.commonSymptoms,
          additional_symptoms: formData.symptoms || null,
          urgency_level: formData.urgency,
          status: 'waiting'
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving patient data:', error);
        toast({
          title: "Error saving data",
          description: "Please try again or contact support.",
          variant: "destructive"
        });
        return null;
      }

      setCurrentPatient(data);
      
      // Store patient ID in localStorage for session persistence
      localStorage.setItem('currentPatientId', data.id);
      
      toast({
        title: "Symptoms submitted successfully!",
        description: "A doctor will review your case shortly.",
        variant: "default"
      });

      return data.id;
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again.",
        variant: "destructive"
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Load patient data from Supabase
  const loadPatientData = async (patientId?: string) => {
    const id = patientId || localStorage.getItem('currentPatientId');
    if (!id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error loading patient data:', error);
        return;
      }

      setCurrentPatient(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Subscribe to real-time updates for the current patient
  useEffect(() => {
    const patientId = localStorage.getItem('currentPatientId');
    if (!patientId) return;

    // Load initial data
    loadPatientData(patientId);

    // Set up real-time subscription
    const channel = supabase
      .channel('patient-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'patients',
          filter: `id=eq.${patientId}`
        },
        (payload) => {
          console.log('Patient status updated:', payload);
          setCurrentPatient(payload.new as PatientData);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    currentPatient,
    loading,
    submitPatientData,
    loadPatientData
  };
};