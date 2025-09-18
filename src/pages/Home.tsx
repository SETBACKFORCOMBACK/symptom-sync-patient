import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { Heart, Stethoscope, Activity, Users, LogOut } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-primary mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">HealthConnect</h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back, {user?.email}
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <Heart className="w-20 h-20 text-primary mx-auto" />
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Ready to Get Better?
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with qualified healthcare professionals and get the care you deserve. 
            Start by telling us about your symptoms.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <Card className="border-none shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Start Your Health Journey</CardTitle>
              <CardDescription>
                Get personalized medical guidance in minutes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => navigate("/symptom-form")}
                size="lg"
                className="w-full bg-gradient-to-r from-primary to-accent text-white hover:opacity-90"
              >
                <Activity className="w-5 h-5 mr-2" />
                Start Symptom Check
              </Button>
              
              <Separator />
              
              <Button 
                onClick={() => navigate("/dashboard")}
                variant="outline"
                size="lg"
                className="w-full"
              >
                <Users className="w-5 h-5 mr-2" />
                View My Cases
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-16 text-center">
          <div className="p-6">
            <Stethoscope className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Professional Care</h3>
            <p className="text-muted-foreground">
              Connect with licensed healthcare professionals
            </p>
          </div>
          <div className="p-6">
            <Activity className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Quick Assessment</h3>
            <p className="text-muted-foreground">
              Get initial health assessment in minutes
            </p>
          </div>
          <div className="p-6">
            <Users className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Personalized Support</h3>
            <p className="text-muted-foreground">
              Receive guidance tailored to your specific needs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;