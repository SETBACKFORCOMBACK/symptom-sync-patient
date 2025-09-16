import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MedicalCard } from "@/components/ui/medical-card";
import { 
  Heart, 
  Stethoscope, 
  MessageCircle, 
  Shield, 
  Clock, 
  CheckCircle,
  Star,
  Users
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Stethoscope,
      title: "Professional Doctors",
      description: "Licensed healthcare professionals available 24/7"
    },
    {
      icon: MessageCircle,
      title: "Instant Chat",
      description: "Real-time communication with medical experts"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "HIPAA-compliant platform ensuring your privacy"
    },
    {
      icon: Clock,
      title: "Quick Response",
      description: "Get medical advice within minutes, not hours"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      rating: 5,
      comment: "Got quick help for my symptoms. The doctor was very professional and helpful!"
    },
    {
      name: "Mike Chen",
      rating: 5,
      comment: "Amazing service! Saved me a trip to the emergency room for a minor issue."
    },
    {
      name: "Emily Davis",
      rating: 5,
      comment: "Peace of mind when I needed it most. Highly recommend this platform."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="healthcare-gradient">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-fade-in">
            <Heart className="w-20 h-20 text-primary mx-auto mb-6 animate-pulse-subtle" />
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Your Health,<br />
              <span className="text-primary">Our Priority</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get instant medical consultation from licensed doctors. 
              Describe your symptoms and connect with healthcare professionals in minutes.
            </p>
            
            <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
              <Button 
                onClick={() => navigate("/symptom-form")}
                size="lg"
                className="w-full md:w-auto bg-primary hover:bg-primary-hover text-primary-foreground text-lg px-8 py-6 healthcare-transition"
              >
                <Stethoscope className="w-5 h-5 mr-2" />
                Start Symptom Check
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                onClick={() => navigate("/dashboard")}
                className="w-full md:w-auto border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg px-8 py-6 healthcare-transition"
              >
                <Users className="w-5 h-5 mr-2" />
                View Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide fast, secure, and professional medical consultations 
              to help you make informed decisions about your health.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <MedicalCard 
                key={index} 
                variant="outlined"
                className="text-center hover:scale-105 healthcare-transition animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <feature.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </MedicalCard>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simple steps to get the medical help you need
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center animate-slide-up">
              <div className="bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Describe Symptoms</h3>
              <p className="text-muted-foreground">
                Fill out our secure form with your symptoms and basic information
              </p>
            </div>
            
            <div className="text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="bg-accent text-accent-foreground w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Wait for Doctor</h3>
              <p className="text-muted-foreground">
                A licensed healthcare professional will review your case
              </p>
            </div>
            
            <div className="text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="bg-success text-success-foreground w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Start Chatting</h3>
              <p className="text-muted-foreground">
                Get real-time medical advice through our secure chat platform
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              What Our Patients Say
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <MedicalCard 
                key={index}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-warning fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">
                  "{testimonial.comment}"
                </p>
                <p className="font-medium">— {testimonial.name}</p>
              </MedicalCard>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="healthcare-gradient py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-fade-in">
            <CheckCircle className="w-16 h-16 text-success mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Don't wait when your health is concerned. Get professional medical advice now.
            </p>
            <Button 
              onClick={() => navigate("/symptom-form")}
              size="lg"
              className="bg-primary hover:bg-primary-hover text-primary-foreground text-lg px-8 py-6"
            >
              <Heart className="w-5 h-5 mr-2" />
              Start Your Consultation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;