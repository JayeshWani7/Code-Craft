"use client";

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Code, Sparkles, Brain, Rocket, Star, ChevronRight, Github, Twitter, Linkedin } from "lucide-react"
import { signInWithGoogle, logout } from "@/lib/firebaseConfig";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";


export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Cleanup function to avoid memory leaks
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500">
      {/* Floating candy elements */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: `${Math.random() * 30 + 10}px`,
              height: `${Math.random() * 30 + 10}px`,
              background: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 10 + 5}s`,
              animationDelay: `${Math.random() * 5}s`,
              boxShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="backdrop-blur-md bg-white/10 border-b border-white/20 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="relative w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Code className="text-white" size={24} />
              </div>
              <span className="text-white font-bold text-xl">CodingCraft</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-white hover:text-pink-200 transition">
                Code Battle
              </Link>
              <Link href="/playground" className="text-white hover:text-pink-200 transition">
                Playground
              </Link>
              <Link href="#testimonials" className="text-white hover:text-pink-200 transition">
                Story Mode tutorials
              </Link>
              <Link href="#pricing" className="text-white hover:text-pink-200 transition">
                Pricing
              </Link>
            </nav>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={user ? logout : signInWithGoogle}
              >
                {user ? "Logout" : "Login"}
              </Button>
              <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-none">
                Get Started
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="backdrop-blur-lg bg-white/10 rounded-3xl border border-white/20 p-8 md:p-12 shadow-xl">
              <div className="grid md:grid-cols-2 gap-10 items-center">
                <div className="space-y-6">
                  <div className="inline-block px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white font-medium text-sm">
                    AI-Powered Coding Mentor
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                    Level Up Your{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-blue-400">
                      Coding Skills
                    </span>{" "}
                    Like a Game
                  </h1>
                  <p className="text-lg text-white/80">
                    Master programming with our AI mentor that makes learning to code as fun and addictive as Candy
                    Crush. Complete challenges, earn rewards, and build real projects.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                    
                      size="lg"
                      className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-none"
                    >
                      Start Coding Now
                      <ChevronRight className="ml-2" size={18} />
                    </Button>
                    <Button size="lg" variant="outline" className="border-white/30 text-black hover:bg-white/20">
                      Watch Demo
                    </Button>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-3xl blur-xl opacity-30 animate-pulse"></div>
                  <div className="relative aspect-square rounded-3xl overflow-hidden border-4 border-white/20">
                    <Image
                      src="/placeholder.svg?height=600&width=600"
                      alt="CodingCraft Interface"
                      width={600}
                      height={600}
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Sweet Features</h2>
              <p className="text-white/70 max-w-2xl mx-auto">
                Delicious coding experiences that make learning programming as addictive as your favorite match-3 game
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "AI Code Mentor",
                  description: "Get personalized guidance from our AI that adapts to your learning style and pace",
                  icon: <Brain className="text-pink-300" size={32} />,
                  color: "from-pink-500 to-purple-500",
                },
                {
                  title: "Gamified Learning",
                  description: "Earn points, unlock achievements, and compete on leaderboards as you master new skills",
                  icon: <Star className="text-yellow-300" size={32} />,
                  color: "from-yellow-400 to-orange-500",
                },
                {
                  title: "Interactive Challenges",
                  description: "Solve coding puzzles with increasing difficulty that keep you engaged and motivated",
                  icon: <Sparkles className="text-blue-300" size={32} />,
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  title: "Real-time Feedback",
                  description: "Get instant feedback on your code with suggestions for improvement and optimization",
                  icon: <Code className="text-green-300" size={32} />,
                  color: "from-green-500 to-emerald-500",
                },
                {
                  title: "Project-Based Learning",
                  description: "Build real-world projects that you can add to your portfolio while learning",
                  icon: <Rocket className="text-purple-300" size={32} />,
                  color: "from-purple-500 to-indigo-500",
                },
                {
                  title: "Community Challenges",
                  description: "Collaborate with other learners on team projects and community coding events",
                  icon: <Github className="text-pink-300" size={32} />,
                  color: "from-pink-500 to-red-500",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="backdrop-blur-lg bg-white/10 rounded-xl border border-white/20 p-6 hover:transform hover:scale-105 transition-all duration-300 group"
                >
                  <div
                    className={`w-16 h-16 rounded-lg mb-6 flex items-center justify-center bg-gradient-to-r ${feature.color} group-hover:animate-pulse`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-white/70">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Game Board Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-transparent to-purple-900/30">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
              <p className="text-white/70 max-w-2xl mx-auto">
                Our coding challenges work like your favorite puzzle games - match concepts, solve problems, and level
                up your skills
              </p>
            </div>

            <div className="backdrop-blur-lg bg-white/10 rounded-3xl border border-white/20 p-8 md:p-12 shadow-xl">
              <div className="grid grid-cols-5 gap-4 max-w-md mx-auto">
                {[...Array(25)].map((_, i) => {
                  const colors = [
                    "bg-pink-500",
                    "bg-blue-500",
                    "bg-purple-500",
                    "bg-yellow-500",
                    "bg-green-500",
                    "bg-red-500",
                  ]
                  const randomColor = colors[Math.floor(Math.random() * colors.length)]

                  return (
                    <div
                      key={i}
                      className={`aspect-square rounded-lg ${randomColor} shadow-lg hover:scale-110 transition-transform cursor-pointer`}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        {i % 5 === 0 && <Code className="text-white" size={20} />}
                        {i % 5 === 1 && <Brain className="text-white" size={20} />}
                        {i % 5 === 2 && <Sparkles className="text-white" size={20} />}
                        {i % 5 === 3 && <Star className="text-white" size={20} />}
                        {i % 5 === 4 && <Rocket className="text-white" size={20} />}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-12 text-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-none"
                >
                  Try a Demo Challenge
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Our Users Say</h2>
              <p className="text-white/70 max-w-2xl mx-auto">
                Join thousands of happy coders who've leveled up their skills with CodingCraft
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: "Alex Johnson",
                  role: "Frontend Developer",
                  quote:
                    "CodingCraft made learning React actually fun! The gamified approach kept me motivated and I landed my first dev job after just 3 months.",
                  avatar: "/placeholder.svg?height=100&width=100",
                },
                {
                  name: "Sarah Chen",
                  role: "Computer Science Student",
                  quote:
                    "As a CS student, I was struggling with data structures until I found CodingCraft. The interactive challenges and AI feedback helped me ace my exams!",
                  avatar: "/placeholder.svg?height=100&width=100",
                },
                {
                  name: "Michael Rodriguez",
                  role: "Self-taught Developer",
                  quote:
                    "I tried many coding platforms but always got bored. CodingCraft's game-like approach kept me coming back daily. Now I'm a full-stack developer!",
                  avatar: "/placeholder.svg?height=100&width=100",
                },
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="backdrop-blur-lg bg-white/10 rounded-xl border border-white/20 p-6 hover:transform hover:translate-y-[-8px] transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/30">
                      <Image
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                        width={100}
                        height={100}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-white font-bold">{testimonial.name}</h4>
                      <p className="text-white/60 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-white/80 italic">"{testimonial.quote}"</p>
                  <div className="mt-4 flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="text-yellow-400 fill-yellow-400" size={16} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Choose Your Plan</h2>
              <p className="text-white/70 max-w-2xl mx-auto">Flexible pricing options to match your learning journey</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Starter",
                  price: "$0",
                  period: "Free Forever",
                  description: "Perfect for beginners to try out the platform",
                  features: [
                    "Access to basic challenges",
                    "Community forum access",
                    "Limited AI code reviews",
                    "Basic progress tracking",
                  ],
                  buttonText: "Start Free",
                  popular: false,
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  name: "Pro",
                  price: "$19",
                  period: "per month",
                  description: "For serious learners who want to level up fast",
                  features: [
                    "All Starter features",
                    "Unlimited AI code reviews",
                    "Advanced challenges & projects",
                    "Priority support",
                    "Certificate of completion",
                  ],
                  buttonText: "Get Pro",
                  popular: true,
                  color: "from-pink-500 to-purple-600",
                },
                {
                  name: "Teams",
                  price: "$49",
                  period: "per user/month",
                  description: "For teams and organizations training developers",
                  features: [
                    "All Pro features",
                    "Team leaderboards",
                    "Custom learning paths",
                    "Admin dashboard",
                    "API access",
                    "Dedicated account manager",
                  ],
                  buttonText: "Contact Sales",
                  popular: false,
                  color: "from-purple-500 to-indigo-500",
                },
              ].map((plan, index) => (
                <div
                  key={index}
                  className={`backdrop-blur-lg ${plan.popular ? "bg-white/20 scale-105 border-pink-300/50" : "bg-white/10"} rounded-xl border ${plan.popular ? "border-pink-300/50" : "border-white/20"} p-8 hover:transform hover:scale-105 transition-all duration-300 relative`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-bold py-1 px-4 rounded-full">
                      Most Popular
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                    <div className="flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">{plan.price}</span>
                      <span className="text-white/60 ml-1">{plan.period}</span>
                    </div>
                    <p className="text-white/70 mt-2">{plan.description}</p>
                  </div>
                  <div className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center mr-3">
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10 3L4.5 8.5L2 6"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <span className="text-white/80">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 text-white border-none`}>
                    {plan.buttonText}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="backdrop-blur-lg bg-white/10 rounded-3xl border border-white/20 p-8 md:p-12 shadow-xl bg-gradient-to-r from-pink-500/20 to-purple-600/20">
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Ready to Make Coding as Fun as Candy Crush?
                </h2>
                <p className="text-white/80 text-lg mb-8">
                  Join thousands of developers who've transformed their coding journey from frustrating to fun. Start
                  your adventure today!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-none"
                  >
                    Start Your Free Trial
                  </Button>
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/20">
                    Schedule a Demo
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="backdrop-blur-md bg-black/30 border-t border-white/10 py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="relative w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Code className="text-white" size={24} />
                  </div>
                  <span className="text-white font-bold text-xl">CodingCraft</span>
                </div>
                <p className="text-white/60 mb-4">Making coding as addictive and fun as your favorite mobile games.</p>
                <div className="flex gap-4">
                  <a href="#" className="text-white/60 hover:text-white transition">
                    <Twitter size={20} />
                  </a>
                  <a href="#" className="text-white/60 hover:text-white transition">
                    <Github size={20} />
                  </a>
                  <a href="#" className="text-white/60 hover:text-white transition">
                    <Linkedin size={20} />
                  </a>
                </div>
              </div>

              <div>
                <h4 className="text-white font-bold mb-4">Product</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-white/60 hover:text-white transition">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-white/60 hover:text-white transition">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-white/60 hover:text-white transition">
                      Testimonials
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-white/60 hover:text-white transition">
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-bold mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-white/60 hover:text-white transition">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-white/60 hover:text-white transition">
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-white/60 hover:text-white transition">
                      Community
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-white/60 hover:text-white transition">
                      Support
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-bold mb-4">Company</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="#" className="text-white/60 hover:text-white transition">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-white/60 hover:text-white transition">
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-white/60 hover:text-white transition">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-white/60 hover:text-white transition">
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-white/10 mt-12 pt-8 text-center text-white/40 text-sm">
              &copy; {new Date().getFullYear()} CodingCraft. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

