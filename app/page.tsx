"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, BarChart3, Bot } from "lucide-react";

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/dashboard");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-6xl font-bold tracking-tight">AdaptiQ Live</h1>
          <p className="text-xl text-muted-foreground">
            Master coding concepts through dynamic quizzes and AI-powered
            training grounds
          </p>

          <div className="flex gap-4 justify-center pt-8">
            <SignUpButton mode="modal">
              <Button size="lg" className="text-lg px-8">
                Get Started
              </Button>
            </SignUpButton>
            <SignInButton mode="modal">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Sign In
              </Button>
            </SignInButton>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-20 max-w-5xl mx-auto">
          <Card className="p-6 space-y-4 border-2">
            <BookOpen className="w-12 h-12" />
            <h3 className="text-xl font-semibold">Curated Subjects</h3>
            <p className="text-muted-foreground">
              Access carefully designed quizzes across multiple programming
              topics and frameworks
            </p>
          </Card>

          <Card className="p-6 space-y-4 border-2">
            <BarChart3 className="w-12 h-12" />
            <h3 className="text-xl font-semibold">Track Progress</h3>
            <p className="text-muted-foreground">
              Monitor your learning journey with detailed analytics and
              performance metrics
            </p>
          </Card>

          <Card className="p-6 space-y-4 border-2">
            <Bot className="w-12 h-12" />
            <h3 className="text-xl font-semibold">AI Training Ground</h3>
            <p className="text-muted-foreground">
              Generate custom quizzes on any topic with real-time research and
              citations
            </p>
          </Card>
        </div>

        {/* How It Works */}
        <div className="mt-24 max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold text-center">How It Works</h2>

          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold text-lg">Choose Your Subject</h4>
                <p className="text-muted-foreground">
                  Browse through our collection of programming subjects and
                  topics
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold text-lg">Take the Quiz</h4>
                <p className="text-muted-foreground">
                  Answer 15 questions per subject and get instant feedback
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold text-lg">Track & Improve</h4>
                <p className="text-muted-foreground">
                  View your progress and revisit topics to master them
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 text-center">
          <Card className="p-12 max-w-2xl mx-auto border-2">
            <h2 className="text-3xl font-bold mb-4">Ready to Level Up?</h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of developers mastering their skills with AdaptiQ
              Live
            </p>
            <SignUpButton mode="modal">
              <Button size="lg" className="text-lg px-12">
                Start Learning Now
              </Button>
            </SignUpButton>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-24 py-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2026 AdaptiQ Live. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
