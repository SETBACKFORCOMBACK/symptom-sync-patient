import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { PatientData } from '@/hooks/usePatientData';
import { 
  ArrowLeft, 
  MessageCircle, 
  User, 
  Calendar,
  Activity,
  Clock,
  CheckCircle
} from 'lucide-react';

const PatientDetail = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Load patient details
  const loadPatient = async () => {
    if (!patientId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .single();

      if (error) {
        console.error('Error loading patient:', error);
        toast({
          title: "Error loading patient",
          description: "Patient not found.",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      setPatient(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update patient status
  const updatePatientStatus = async (newStatus: string) => {
    if (!patient) return;
    
    setUpdatingStatus(true);
    try {
      const { error } = await supabase
        .from('patients')
        .update({ status: newStatus })
        .eq('id', patient.id);

      if (error) {
        console.error('Error updating status:', error);
        toast({
          title: "Error updating status",
          description: "Please try again.",
          variant: "destructive"
        });
        return;
      }

      setPatient(prev => prev ? { ...prev, status: newStatus } : null);
      
      toast({
        title: "Status updated",
        description: `Patient status changed to ${newStatus.replace('_', ' ')}.`,
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Join chat
  const joinChat = async () => {
    if (!patient) return;
    
    // Update status to "in_chat" when doctor joins
    await updatePatientStatus('in_chat');
    
    // Navigate to chat with patient ID
    navigate(`/chat?patientId=${patient.id}`);
  };

  useEffect(() => {
    loadPatient();
  }, [patientId]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!patient) return;

    const channel = supabase
      .channel(`patient-${patient.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'patients',
          filter: `id=eq.${patient.id}`
        },
        (payload) => {
          console.log('Patient updated:', payload);
          setPatient(payload.new as PatientData);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [patient?.id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'secondary';
      case 'doctor_available':
        return 'default';
      case 'in_chat':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <User className="h-12 w-12 animate-pulse text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading patient details...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Patient not found</h2>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Patient Details</h1>
              <p className="text-sm text-muted-foreground">
                Submitted {formatDate(patient.created_at)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Patient Information */}
          <div className="md:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{patient.name}</CardTitle>
                    <CardDescription className="flex items-center mt-2">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(patient.created_at)}
                    </CardDescription>
                  </div>
                  <div className="text-right space-y-2">
                    <Badge variant={getStatusColor(patient.status)}>
                      {patient.status === 'waiting' && <Clock className="h-3 w-3 mr-1" />}
                      {patient.status === 'doctor_available' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {patient.status === 'in_chat' && <MessageCircle className="h-3 w-3 mr-1" />}
                      {patient.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <Badge variant={getUrgencyColor(patient.urgency_level)} className="block">
                      <Activity className="h-3 w-3 mr-1" />
                      {patient.urgency_level.toUpperCase()} PRIORITY
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">Age:</span>
                    <p className="text-lg font-semibold">{patient.age} years old</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Gender:</span>
                    <p className="text-lg font-semibold capitalize">{patient.gender}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Symptoms */}
            <Card>
              <CardHeader>
                <CardTitle>Symptoms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {patient.common_symptoms && patient.common_symptoms.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Common Symptoms:</h4>
                    <div className="flex flex-wrap gap-2">
                      {patient.common_symptoms.map((symptom, idx) => (
                        <Badge key={idx} variant="secondary">
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {patient.additional_symptoms && (
                  <div>
                    <h4 className="font-medium mb-2">Additional Information:</h4>
                    <p className="text-muted-foreground bg-muted p-3 rounded-lg">
                      {patient.additional_symptoms}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-4">
            {/* Chat Action */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
                <CardDescription>
                  Manage patient communication and status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={joinChat}
                  className="w-full"
                  size="lg"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {patient.status === 'in_chat' ? 'Continue Chat' : 'Start Chat'}
                </Button>
                
                <Separator />
                
                {/* Status Updates */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Update Status:</h4>
                  
                  {patient.status === 'waiting' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => updatePatientStatus('doctor_available')}
                      disabled={updatingStatus}
                    >
                      Mark as Available
                    </Button>
                  )}
                  
                  {patient.status === 'in_chat' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => updatePatientStatus('doctor_available')}
                      disabled={updatingStatus}
                    >
                      End Chat Session
                    </Button>
                  )}
                  
                  {patient.status !== 'waiting' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => updatePatientStatus('waiting')}
                      disabled={updatingStatus}
                    >
                      Reset to Waiting
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Patient ID:</span>
                  <span className="font-mono text-xs">{patient.id.slice(0, 8)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{new Date(patient.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updated:</span>
                  <span>{new Date(patient.updated_at).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;