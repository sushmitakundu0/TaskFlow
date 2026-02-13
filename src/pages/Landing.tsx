import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, LayoutDashboard, Shield, Zap, Moon, Sun } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/components/ThemeProvider";
import logo from "@/assets/logo.png";

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  const features = [
    {
      icon: <LayoutDashboard className="h-6 w-6" />,
      title: "Task Management",
      description: "Organize and track all your tasks in one place",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure Authentication",
      description: "JWT-based authentication with enterprise-grade security",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Real-time Updates",
      description: "Instant synchronization across all your devices",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <button 
              onClick={() => navigate("/")}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <img src={logo} alt="TaskFlow Logo" className="h-8 w-auto" />
              <span className="text-xl font-bold">TaskFlow</span>
            </button>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
              {user ? (
                <Button onClick={() => navigate("/dashboard")} size="default">
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button variant="ghost" onClick={() => navigate("/auth")} size="default">
                    Log In
                  </Button>
                  <Button onClick={() => navigate("/auth")} size="default">
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Zap className="h-4 w-4" />
            <span>Modern Task Management Platform</span>
          </div>
          <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
            Manage Your Tasks with{" "}
            <span className="bg-primary bg-clip-text text-transparent">
              Confidence
            </span>
          </h1>
          <p className="mb-10 text-lg leading-relaxed text-muted-foreground md:text-xl">
            From Havoc to Precision
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-shadow"
              onClick={() => navigate("/auth")}
            >
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => navigate("/auth")}
            >
              View Demo
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span>14-day free trial</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 bg-muted/30">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold leading-tight md:text-4xl">
            Everything You Need
          </h2>
          <p className="text-lg text-muted-foreground">
            Built with modern technology and best practices
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-lg hover:border-primary/20"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all group-hover:scale-110 group-hover:bg-primary/20">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-xl font-semibold leading-tight">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold leading-tight md:text-4xl">
            What Our Users Say
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of satisfied users managing their tasks efficiently
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              name: "Sarah Johnson",
              role: "Product Manager",
              quote: "TaskFlow has completely transformed how our team collaborates. The intuitive interface and powerful features make project management a breeze.",
              avatar: "SJ"
            },
            {
              name: "Michael Chen",
              role: "Software Engineer",
              quote: "Finally, a task management tool that doesn't get in the way. Clean, fast, and exactly what I needed to stay organized.",
              avatar: "MC"
            },
            {
              name: "Emily Rodriguez",
              role: "Marketing Director",
              quote: "The analytics and reporting features give us incredible insights into our workflow. Highly recommended for any team!",
              avatar: "ER"
            }
          ].map((testimonial, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-lg hover:border-primary/20"
            >
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed italic">
                "{testimonial.quote}"
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="rounded-3xl bg-primary p-12 text-center text-white shadow-xl">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="mb-8 text-lg text-white/90">
            Join thousands of users managing their tasks efficiently
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-primary hover:bg-white/90"
            onClick={() => navigate("/auth")}
          >
            Create Your Account
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <button 
              onClick={() => navigate("/")}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <img src={logo} alt="TaskFlow Logo" className="h-6 w-auto" />
              <span className="font-semibold">TaskFlow</span>
            </button>
            <p className="text-sm text-muted-foreground">
              © 2025 TaskFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
