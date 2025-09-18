import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { PatientData } from '@/hooks/usePatientData';
import { 
  Clock, 
  CheckCircle, 
  MessageCircle, 
  User, 
  Calendar,
  Stethoscope,
  LogOut
} from 'lucide-react';

const DoctorDashboard = () => {
  const { signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [loading, setLoading] = useState(true);

  // Load all patients
  const loadPatients = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading patients:', error);
        toast({
          title: "Error loading patients",
          description: "Please try again.",
          variant: "destructive"
        });
        return;
      }

      setPatients(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Subscribe to real-time updates
  useEffect(() => {
    loadPatients();

    // Set up real-time subscription for patient updates
    const channel = supabase
      .channel('patients-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'patients'
        },
        (payload) => {
          console.log('Patient update:', payload);
          loadPatients(); // Refresh the list
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'waiting':
        return <Clock className="h-4 w-4" />;
      case 'doctor_available':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_chat':
        return <MessageCircle className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const waitingPatients = patients.filter(p => p.status === 'waiting');
  const otherPatients = patients.filter(p => p.status !== 'waiting');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Stethoscope className="h-12 w-12 animate-pulse text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading patients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Stethoscope className="h-8 w-8 text-primary mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Doctor Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  {patients.length} total patients
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Waiting Patients Section */}
        {waitingPatients.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Clock className="h-5 w-5 text-orange-500 mr-2" />
              <h2 className="text-xl font-semibold text-foreground">
                Waiting Patients ({waitingPatients.length})
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {waitingPatients.map((patient) => (
                <Card key={patient.id} className="border-orange-200 hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{patient.name}</CardTitle>
                      <Badge variant={getStatusColor(patient.status)} className="ml-2">
                        {getStatusIcon(patient.status)}
                        <span className="ml-1 capitalize">{patient.status.replace('_', ' ')}</span>
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(patient.created_at)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Age:</span> {patient.age}</div>
                      <div><span className="font-medium">Gender:</span> {patient.gender}</div>
                      <div className="space-y-1">
                        <span className="font-medium">Symptoms:</span>
                        {patient.common_symptoms && patient.common_symptoms.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {patient.common_symptoms.map((symptom, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {symptom}
                              </Badge>
                            ))}
                          </div>
                        )}
                        {patient.additional_symptoms && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {patient.additional_symptoms}
                          </p>
                        )}
                      </div>
                    </div>
                    <Separator className="my-3" />
                    <Button 
                      onClick={() => navigate(`/patient/${patient.id}`)}
                      className="w-full"
                      size="sm"
                    >
                      View Details & Chat
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Other Patients */}
        {otherPatients.length > 0 && (
          <div>
            <div className="flex items-center mb-4">
              <User className="h-5 w-5 text-primary mr-2" />
              <h2 className="text-xl font-semibold text-foreground">
                All Patients ({otherPatients.length})
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {otherPatients.map((patient) => (
                <Card key={patient.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{patient.name}</CardTitle>
                      <Badge variant={getStatusColor(patient.status)} className="ml-2">
                        {getStatusIcon(patient.status)}
                        <span className="ml-1 capitalize">{patient.status.replace('_', ' ')}</span>
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(patient.created_at)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Age:</span> {patient.age}</div>
                      <div><span className="font-medium">Gender:</span> {patient.gender}</div>
                      <div className="space-y-1">
                        <span className="font-medium">Symptoms:</span>
                        {patient.common_symptoms && patient.common_symptoms.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {patient.common_symptoms.map((symptom, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {symptom}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <Separator className="my-3" />
                    <Button 
                      onClick={() => navigate(`/patient/${patient.id}`)}
                      variant="outline"
                      className="w-full"
                      size="sm"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {patients.length === 0 && (
          <div className="text-center py-12">
            <Stethoscope className="h-24 w-24 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-foreground mb-2">No patients yet</h3>
            <p className="text-muted-foreground">
              Patients will appear here once they submit their symptoms.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;