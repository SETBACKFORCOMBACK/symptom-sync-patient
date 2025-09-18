import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MedicalCard } from "@/components/ui/medical-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Separator } from "@/components/ui/separator";
import { usePatientData } from "@/hooks/usePatientData";
import { 
  Heart, 
  MessageCircle, 
  Clock, 
  CheckCircle, 
  User, 
  Calendar,
  Stethoscope,
  ArrowLeft,
  Sparkles,
  Activity
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentPatient, loading } = usePatientData();

  useEffect(() => {
    // If no patient data, redirect to symptom form
    if (!loading && !currentPatient) {
      navigate('/symptom-form');
    }
  }, [currentPatient, loading, navigate]);

  const handleJoinChat = () => {
    navigate("/chat");
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!currentPatient) {
    return null; // Will redirect to symptom form
  }

  return (
    <div className="min-h-screen gradient-subtle">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4 text-primary hover:text-primary-hover transition-smooth hover-lift"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="text-center mb-8 animate-fade-in">
            <div className="relative inline-block mb-4">
              <Activity className="w-12 h-12 text-primary mx-auto shadow-glow" />
              <Sparkles className="w-4 h-4 text-accent absolute -top-1 -right-1 animate-pulse" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Your Health Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">
              Track your symptoms and connect with healthcare professionals
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Status Card */}
          <MedicalCard variant="gradient" className="animate-slide-up glass-card shadow-glass hover-lift">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Stethoscope className="w-6 h-6 text-primary shadow-glow" />
                <h2 className="text-2xl font-bold">Current Status</h2>
              </div>
              <StatusBadge 
                variant={currentPatient.status === "waiting" ? "waiting" : "available"}
                size="lg"
              >
                {currentPatient.status === "waiting" ? (
                  <>
                    <Clock className="w-4 h-4 mr-2" />
                    Waiting for Doctor
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Doctor Available
                  </>
                )}
              </StatusBadge>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Current Status</h3>
                {currentPatient.status === 'waiting' ? (
                  <StatusBadge variant="waiting" size="default">
                    <Clock className="w-4 h-4 mr-2" />
                    Waiting for Doctor
                  </StatusBadge>
                ) : (
                  <StatusBadge variant="available" size="default">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Doctor Available
                  </StatusBadge>
                )}
              </div>
              
              <div className="space-y-2">
                {currentPatient.status === 'waiting' ? (
                  <div className="text-center py-8">
                    <div className="animate-pulse-subtle">
                      <Clock className="w-20 h-20 text-primary mx-auto mb-6 shadow-glow" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">A doctor will join you soon</h3>
                    <p className="text-muted-foreground text-lg">
                      Please stay online. You'll be notified as soon as a healthcare professional is available to review your symptoms.
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="animate-bounce-gentle">
                      <MessageCircle className="w-20 h-20 text-accent mx-auto mb-6 shadow-glow-accent" />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-accent">Doctor is Ready!</h3>
                    <p className="text-muted-foreground text-lg mb-6">
                      Dr. Sarah Johnson has reviewed your symptoms and is ready to chat with you.
                    </p>
                    <Button 
                      onClick={handleJoinChat}
                      className="gradient-primary hover:shadow-glow transition-spring text-white font-semibold"
                      size="lg"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Join Chat with Dr. Johnson
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </MedicalCard>

          {/* Patient Information */}
          <MedicalCard className="animate-slide-up glass-card shadow-glass hover-lift">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-6 h-6 text-primary shadow-glow" />
              <h2 className="text-2xl font-bold">Patient Information</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Name</p>
                <p className="font-bold text-lg">{currentPatient.name}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Age</p>
                <p className="font-bold text-lg">{currentPatient.age} years old</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Gender</p>
                <p className="font-bold text-lg capitalize">{currentPatient.gender}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground font-medium">Submitted</p>
                <p className="font-bold text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  {formatDateTime(currentPatient.created_at)}
                </p>
              </div>
            </div>
          </MedicalCard>

          {/* Symptoms Summary */}
          <MedicalCard className="animate-slide-up glass-card shadow-glass hover-lift">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-6 h-6 text-primary shadow-glow" />
              <h2 className="text-2xl font-bold">Symptoms Summary</h2>
            </div>
            
            <div className="space-y-6">
              {currentPatient.common_symptoms.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-3 font-medium">Common Symptoms</p>
                  <div className="flex flex-wrap gap-3">
                    {currentPatient.common_symptoms.map((symptom) => (
                      <StatusBadge key={symptom} variant="default" className="font-medium">
                        {symptom}
                      </StatusBadge>
                    ))}
                  </div>
                </div>
              )}
              
              {currentPatient.common_symptoms.length > 0 && currentPatient.additional_symptoms && (
                <Separator className="bg-border/50" />
              )}
              
              {currentPatient.additional_symptoms && (
                <div>
                  <p className="text-sm text-muted-foreground mb-3 font-medium">Additional Details</p>
                  <p className="text-foreground leading-relaxed text-lg bg-muted/30 p-4 rounded-lg">
                    {currentPatient.additional_symptoms}
                  </p>
                </div>
              )}
              
              <Separator className="bg-border/50" />
              
              <div>
                <p className="text-sm text-muted-foreground mb-3 font-medium">Urgency Level</p>
                <StatusBadge 
                  variant={currentPatient.urgency_level.includes("high") || currentPatient.urgency_level.includes("emergency") ? "waiting" : "default"}
                  className="font-semibold"
                >
                  {currentPatient.urgency_level.charAt(0).toUpperCase() + currentPatient.urgency_level.slice(1)}
                </StatusBadge>
              </div>
            </div>
          </MedicalCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;