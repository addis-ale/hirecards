import Hero from "@/components/Hero";
import SampleOutput from "@/components/SampleOutput";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import BattleCardPreview from "@/components/BattleCardPreview";
import BuiltFor from "@/components/BuiltFor";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import GradientCanvas from "@/components/GradientCanvas";
import StatsBar from "@/components/StatsBar";

export default function Home() {
  return (
    <>
      <GradientCanvas />
      <StatsBar />
      <main className="min-h-screen content-wrapper">
        <Navbar />
        <Hero />
        <SampleOutput />
        <Features />
        <HowItWorks />
        <BattleCardPreview />
        <BuiltFor />
        <Testimonials />
        <FAQ />
        <CTA />
        <Footer />
      </main>
    </>
  );
}
