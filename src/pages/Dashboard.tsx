import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MedicalCard } from "@/components/ui/medical-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Separator } from "@/components/ui/separator";
import { 
  Heart, 
  MessageCircle, 
  Clock, 
  CheckCircle, 
  User, 
  Calendar,
  Stethoscope,
  ArrowLeft
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [patientStatus, setPatientStatus] = useState<"waiting" | "available">("waiting");
  
  // Mock patient data - will come from Supabase when connected
  const patientData = {
    name: "John Doe",
    age: 32,
    gender: "Male",
    submittedAt: "2024-03-15T10:30:00Z",
    symptoms: {
      common: ["Fever", "Headache", "Fatigue"],
      additional: "Symptoms started 2 days ago. Mild fever around 99°F, persistent headache, and feeling very tired.",
      urgency: "Medium - Would like to see someone today"
    }
  };

  // Simulate doctor availability after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setPatientStatus("available");
    }, 5000); // 5 seconds for demo

    return () => clearTimeout(timer);
  }, []);

  const handleJoinChat = () => {
    navigate("/chat");
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4 text-primary hover:text-primary-hover"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="text-center mb-8 animate-fade-in">
            <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-2">Your Health Dashboard</h1>
            <p className="text-muted-foreground">
              Track your symptoms and connect with healthcare professionals
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Status Card */}
          <MedicalCard variant="gradient" className="animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Stethoscope className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-semibold">Current Status</h2>
              </div>
              <StatusBadge 
                variant={patientStatus === "waiting" ? "waiting" : "available"}
                size="lg"
              >
                {patientStatus === "waiting" ? (
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
              {patientStatus === "waiting" ? (
                <div className="text-center py-6">
                  <div className="animate-pulse-subtle">
                    <Clock className="w-16 h-16 text-primary mx-auto mb-4" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">A doctor will join you soon</h3>
                  <p className="text-muted-foreground">
                    Please stay online. You'll be notified as soon as a healthcare professional is available to review your symptoms.
                  </p>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="animate-bounce-gentle">
                    <MessageCircle className="w-16 h-16 text-accent mx-auto mb-4" />
                  </div>
                  <h3 className="text-lg font-medium mb-2 text-accent">Doctor is Ready!</h3>
                  <p className="text-muted-foreground mb-4">
                    A healthcare professional has reviewed your symptoms and is ready to chat with you.
                  </p>
                  <Button 
                    onClick={handleJoinChat}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground"
                    size="lg"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Join Chat Now
                  </Button>
                </div>
              )}
            </div>
          </MedicalCard>

          {/* Patient Information */}
          <MedicalCard className="animate-slide-up">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold">Patient Information</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{patientData.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="font-medium">{patientData.age} years old</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="font-medium">{patientData.gender}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Submitted</p>
                <p className="font-medium flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDateTime(patientData.submittedAt)}
                </p>
              </div>
            </div>
          </MedicalCard>

          {/* Symptoms Summary */}
          <MedicalCard className="animate-slide-up">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold">Symptoms Summary</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Common Symptoms</p>
                <div className="flex flex-wrap gap-2">
                  {patientData.symptoms.common.map((symptom) => (
                    <StatusBadge key={symptom} variant="default">
                      {symptom}
                    </StatusBadge>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">Additional Details</p>
                <p className="text-foreground leading-relaxed">
                  {patientData.symptoms.additional}
                </p>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">Urgency Level</p>
                <StatusBadge 
                  variant={patientData.symptoms.urgency.includes("High") ? "waiting" : "default"}
                >
                  {patientData.symptoms.urgency}
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