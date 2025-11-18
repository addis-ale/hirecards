"use client";

import Link from "next/link";
import { Check, Sparkles, Zap, Target, Shield, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GradientCanvas from "@/components/GradientCanvas";

export default function PricingPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  const handleGetStarted = async (planName: string) => {
    if (planName === "Enterprise") {
      router.push("/contact");
      return;
    }

    setIsProcessing(true);
    setProcessingPlan(planName);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Store selected plan in sessionStorage
    sessionStorage.setItem("selectedPlan", planName);
    
    // Redirect to results page
    router.push("/results");
  };
  const plans = [
    {
      name: "Starter",
      price: "$49",
      period: "per role",
      description: "Perfect for single hires and small teams",
      features: [
        "Complete role analysis",
        "Market competitiveness check",
        "Basic sourcing strategy",
        "Salary benchmarking",
        "Hiring timeline estimate",
        "PDF export",
      ],
      cta: "Get Started",
      popular: false,
      color: "#278f8c",
    },
    {
      name: "Professional",
      price: "$149",
      period: "per role",
      description: "Most popular for growing companies",
      features: [
        "Everything in Starter",
        "Competitor benchmarking",
        "Advanced sourcing channels",
        "Interview question bank",
        "Candidate scoring matrix",
        "90-day hiring roadmap",
        "Priority support",
        "Unlimited revisions",
      ],
      cta: "Start Hiring Smarter",
      popular: true,
      color: "#278f8c",
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "volume pricing",
      description: "For teams hiring at scale",
      features: [
        "Everything in Professional",
        "Unlimited roles",
        "Dedicated account manager",
        "Custom integrations",
        "Team collaboration tools",
        "API access",
        "White-label options",
        "Strategic hiring consultation",
      ],
      cta: "Contact Sales",
      popular: false,
      color: "#278f8c",
    },
  ];

  return (
    <>
      <GradientCanvas />
      <main className="min-h-screen content-wrapper">
        <Navbar />

        {/* Hero Section */}
        <section
          className="relative pt-32 pb-16 overflow-hidden"
          style={{ backgroundColor: "#f5f5f5" }}
        >
          <div className="section-container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto mb-16"
            >
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
                style={{ color: "#102a63" }}
              >
                Stop Guessing.{" "}
                <span
                  className="px-3 py-1 rounded-lg"
                  style={{ backgroundColor: "#d7f4f2", color: "#102a63" }}
                >
                  Start Hiring.
                </span>
              </h1>
              <p
                className="text-xl md:text-2xl mb-4"
                style={{ color: "#102a63", opacity: 0.8 }}
              >
                Get your custom hiring battle card and avoid the 2-month
                restart.
              </p>
              <p
                className="text-base md:text-lg"
                style={{ color: "#102a63", opacity: 0.7 }}
              >
                No credit card required. Pay only when you&apos;re ready.
              </p>
            </motion.div>

            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative bg-white rounded-2xl shadow-xl p-8 ${
                    plan.popular
                      ? "ring-4 ring-[#278f8c] transform scale-105"
                      : ""
                  }`}
                >
                  {plan.popular && (
                    <div
                      className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-white text-sm font-bold"
                      style={{ backgroundColor: "#278f8c" }}
                    >
                      MOST POPULAR
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3
                      className="text-2xl font-bold mb-2"
                      style={{ color: "#102a63" }}
                    >
                      {plan.name}
                    </h3>
                    <div className="mb-2">
                      <span
                        className="text-5xl font-bold"
                        style={{ color: plan.color }}
                      >
                        {plan.price}
                      </span>
                      {plan.price !== "Custom" && (
                        <span
                          className="text-lg ml-2"
                          style={{ color: "#102a63", opacity: 0.6 }}
                        >
                          {plan.period}
                        </span>
                      )}
                    </div>
                    <p
                      className="text-sm"
                      style={{ color: "#102a63", opacity: 0.7 }}
                    >
                      {plan.description}
                    </p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check
                          className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5"
                          style={{ color: plan.color }}
                        />
                        <span
                          className="text-sm"
                          style={{ color: "#102a63", opacity: 0.9 }}
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleGetStarted(plan.name)}
                    disabled={isProcessing}
                    className={`btn-primary w-full flex items-center justify-center space-x-2 ${
                      plan.popular ? "shadow-2xl" : ""
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isProcessing && processingPlan === plan.name ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing Payment...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>{plan.cta}</span>
                      </>
                    )}
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-12 mt-20 text-base"
              style={{ color: "#102a63" }}
            >
              <div className="flex items-center space-x-2">
                <Zap
                  className="w-6 h-6"
                  style={{ color: "#278f8c", fill: "#278f8c" }}
                />
                <span className="font-medium">Instant delivery</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-6 h-6" style={{ color: "#278f8c" }} />
                <span className="font-medium">100% satisfaction guarantee</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-6 h-6" style={{ color: "#278f8c" }} />
                <span className="font-medium">Secure payment</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20" style={{ backgroundColor: "#ffffff" }}>
          <div className="section-container">
            <h2
              className="text-3xl md:text-4xl font-bold text-center mb-12"
              style={{ color: "#102a63" }}
            >
              Frequently Asked Questions
            </h2>

            <div className="max-w-3xl mx-auto space-y-6">
              {[
                {
                  q: "What exactly do I get?",
                  a: "You receive a comprehensive hiring battle card tailored to your specific role. This includes market analysis, competitor benchmarking, sourcing strategies, salary ranges, realistic timelines, and actionable next steps.",
                },
                {
                  q: "How long does it take?",
                  a: "Most battle cards are delivered within 24-48 hours. For Enterprise plans, delivery times are customized based on your needs.",
                },
                {
                  q: "Can I get a refund?",
                  a: "Yes! We offer a 100% satisfaction guarantee. If you're not happy with your battle card, we'll refund your purchase within 7 days, no questions asked.",
                },
                {
                  q: "Do you offer team discounts?",
                  a: "Absolutely! Our Enterprise plan includes volume pricing for teams hiring multiple roles. Contact our sales team for a custom quote.",
                },
                {
                  q: "What if I need revisions?",
                  a: "Starter plans include basic revisions. Professional and Enterprise plans include unlimited revisions to ensure the strategy matches your needs perfectly.",
                },
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-md p-6 border-2"
                  style={{ borderColor: "#d7f4f2" }}
                >
                  <h3
                    className="text-lg font-bold mb-2"
                    style={{ color: "#102a63" }}
                  >
                    {faq.q}
                  </h3>
                  <p style={{ color: "#102a63", opacity: 0.8 }}>{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20" style={{ backgroundColor: "#d7f4f2" }}>
          <div className="section-container text-center">
            <h2
              className="text-3xl md:text-4xl font-bold mb-6"
              style={{ color: "#102a63" }}
            >
              Ready to Stop Wasting Time?
            </h2>
            <p
              className="text-xl mb-8 max-w-2xl mx-auto"
              style={{ color: "#102a63", opacity: 0.8 }}
            >
              Get your hiring battle card and start making confident hiring
              decisions today.
            </p>
            <Link
              href="/create"
              className="btn-primary inline-flex items-center justify-center space-x-2 text-lg px-8 py-4"
            >
              <Sparkles className="w-5 h-5" />
              <span>Get Started Now</span>
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
