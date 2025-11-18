import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MultiPageForm from "@/components/MultiPageForm";

export default function CreatePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <div className="pt-24 md:pt-28 pb-12">
        <div className="section-container">
          <div className="text-center mb-8">
            <h1
              className="text-3xl md:text-4xl font-bold mb-3"
              style={{ color: "#102a63" }}
            >
              Create Your{" "}
              <span
                className="px-3 py-1 rounded-lg"
                style={{ backgroundColor: "#d7f4f2", color: "#102a63" }}
              >
                HireCard Strategy
              </span>
            </h1>
            <p className="text-base text-gray-600">
              Tell us about your role and get a tailored hiring strategy
            </p>
          </div>
          <MultiPageForm />
        </div>
      </div>
      <Footer />
    </main>
  );
}
