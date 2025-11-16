import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import IntakeForm from "@/components/IntakeForm";

export default function CreatePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="section-container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Create Your{" "}
                <span className="gradient-text">Battle Card Deck</span>
              </h1>
              <p className="text-xl text-gray-600">
                Fill out this quick form and we&apos;ll generate a comprehensive
                set of hiring cards
              </p>
            </div>
            <IntakeForm />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
