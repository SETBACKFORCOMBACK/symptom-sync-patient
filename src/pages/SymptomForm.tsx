import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MedicalCard } from "@/components/ui/medical-card";
import { ArrowLeft, Heart, User, AlertCircle, Sparkles } from "lucide-react";
import { usePatientData } from "@/hooks/usePatientData";

const SymptomForm = () => {
  const navigate = useNavigate();
  const { submitPatientData, loading } = usePatientData();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    symptoms: "",
    commonSymptoms: [] as string[],
    urgency: "",
  });

  const commonSymptomsList = [
    "Fever", "Headache", "Cough", "Sore throat", "Fatigue", 
    "Nausea", "Body aches", "Dizziness", "Chest pain", "Shortness of breath"
  ];

  const handleCommonSymptomChange = (symptom: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      commonSymptoms: checked 
        ? [...prev.commonSymptoms, symptom]
        : prev.commonSymptoms.filter(s => s !== symptom)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.age || !formData.gender || (!formData.symptoms && formData.commonSymptoms.length === 0)) {
      return;
    }

    const patientId = await submitPatientData(formData);
    if (patientId) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen gradient-subtle">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
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
              <Heart className="w-12 h-12 text-primary mx-auto shadow-glow" />
              <Sparkles className="w-4 h-4 text-accent absolute -top-1 -right-1 animate-pulse" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Tell Us About Your Symptoms
            </h1>
            <p className="text-muted-foreground text-lg">
              Please provide accurate information so our doctors can help you better.
            </p>
          </div>
        </div>

        <MedicalCard className="animate-slide-up glass-card shadow-glass hover-lift">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Personal Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-foreground">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                    className="mt-2"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="age" className="text-foreground">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    min="1"
                    max="120"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    placeholder="Your age"
                    className="mt-2"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="gender" className="text-foreground">Gender *</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Symptoms Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">Your Symptoms</h2>
              </div>
              
              <div>
                <Label className="text-foreground mb-3 block">Common Symptoms (select all that apply)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {commonSymptomsList.map((symptom) => (
                    <div key={symptom} className="flex items-center space-x-2">
                      <Checkbox
                        id={symptom}
                        checked={formData.commonSymptoms.includes(symptom)}
                        onCheckedChange={(checked) => 
                          handleCommonSymptomChange(symptom, checked as boolean)
                        }
                      />
                      <Label 
                        htmlFor={symptom}
                        className="text-sm text-foreground cursor-pointer"
                      >
                        {symptom}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="symptoms" className="text-foreground">
                  Additional Symptoms or Details
                </Label>
                <Textarea
                  id="symptoms"
                  value={formData.symptoms}
                  onChange={(e) => setFormData(prev => ({ ...prev, symptoms: e.target.value }))}
                  placeholder="Please describe any other symptoms, when they started, their severity, etc."
                  className="mt-2 min-h-[100px]"
                  rows={4}
                />
              </div>
              
              <div>
                <Label htmlFor="urgency" className="text-foreground">How urgent do you feel this is?</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, urgency: value }))}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select urgency level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Can wait a few days</SelectItem>
                    <SelectItem value="medium">Medium - Would like to see someone today</SelectItem>
                    <SelectItem value="high">High - Need immediate attention</SelectItem>
                    <SelectItem value="emergency">Emergency - Severe symptoms</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="pt-6">
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full gradient-primary hover:shadow-glow transition-spring text-white font-semibold"
                size="lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Submit Symptoms
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-3">
                By submitting, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </form>
        </MedicalCard>
      </div>
    </div>
  );
};

export default SymptomForm;