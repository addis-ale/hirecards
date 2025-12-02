"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah J.",
    role: "Head of Talent",
    company: "TechCorp",
    image: "👩‍💼",
    rating: 5,
    text: "Finally stopped drowning in Google Docs. These cards actually make sense and my hiring managers don't hate me anymore. 10/10 would hire again.",
  },
  {
    name: "Mike C.",
    role: "Recruiting Manager",
    company: "StartupXYZ",
    image: "👨‍💻",
    rating: 5,
    text: "I used to spend 6 hours researching salary data. Now it takes 2 minutes. What do I do with all this free time? Probably hire better people.",
  },
  {
    name: "Emily R.",
    role: "VP of People",
    company: "GrowthLabs",
    image: "👩‍🔬",
    rating: 5,
    text: 'Our hiring process went from "organized chaos" to just "organized." This tool is stupid simple and stupidly effective. Rare combo.',
  },
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="py-20 md:py-32"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <div className="section-container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              <span style={{ color: "#70B2B2" }}>Real People</span> Who No Longer
              <br />
              <span className="text-3xl md:text-4xl">
                Hate Their Hiring Process
              </span>
            </h2>
            <p className="text-xl text-gray-600">
              (They&apos;re still surprised this actually works)
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="card"
            >
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="mb-6 leading-relaxed italic text-gray-700">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              <div className="flex items-center space-x-3 pt-4" style={{ borderTop: "1px solid #9ECFD4" }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ background: "linear-gradient(to bottom right, #70B2B2, #9ECFD4)" }}>
                  {testimonial.image}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
