import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MultiPageForm from "@/components/MultiPageForm";

export default function CreatePage() {
  return (
    <main className="min-h-screen" style={{ backgroundColor: "#f5f5f5" }}>
      <Navbar />
      <div className="pt-32 md:pt-36 pb-16">
        <div className="section-container">
          <div className="text-center mb-12">
            <h1
              className="text-4xl md:text-5xl font-bold mb-4"
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
            <p className="text-lg md:text-xl" style={{ color: "#102a63", opacity: 0.8 }}>
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
