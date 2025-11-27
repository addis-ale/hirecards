"use client"

import { motion } from "framer-motion"
import { Star, Quote, Sparkles } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Head of Talent",
    company: "TechCorp",
    image: "/professional-woman-headshot.png",
    rating: 5,
    text: "Finally stopped drowning in Google Docs. These cards actually make sense and my hiring managers don't hate me anymore. 10/10 would hire again.",
    bgGradient: "from-emerald-50 via-white to-teal-50",
    accentGradient: "from-emerald-500 to-teal-500",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    borderColor: "border-emerald-200/60",
    glowColor: "shadow-emerald-200/50",
  },
  {
    name: "Michael Chen",
    role: "Recruiting Manager",
    company: "StartupXYZ",
    image: "/professional-man-headshot.png",
    rating: 5,
    text: "I used to spend 6 hours researching salary data. Now it takes 2 minutes. What do I do with all this free time? Probably hire better people.",
    bgGradient: "from-green-50 via-white to-emerald-50",
    accentGradient: "from-green-500 to-emerald-500",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    borderColor: "border-green-200/60",
    glowColor: "shadow-green-200/50",
  },
  {
    name: "Emily Roberts",
    role: "VP of People",
    company: "GrowthLabs",
    image: "/professional-woman-scientist-headshot.png",
    rating: 5,
    text: 'Our hiring process went from "organized chaos" to just "organized." This tool is stupid simple and stupidly effective. Rare combo.',
    bgGradient: "from-teal-50 via-white to-green-50",
    accentGradient: "from-teal-500 to-green-500",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
    borderColor: "border-teal-200/60",
    glowColor: "shadow-teal-200/50",
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 md:py-36 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-emerald-50/30 to-teal-50/40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-100/40 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-teal-100/30 via-transparent to-transparent" />

      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-5 py-2 mb-6 text-sm font-semibold rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border border-emerald-200/50 shadow-sm">
              <Sparkles className="w-4 h-4" />
              What People Are Saying
            </span>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-emerald-700 via-green-700 to-teal-700 bg-clip-text text-transparent">
                Real People
              </span>
              <span className="text-slate-800"> Who</span>
              <br />
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Actually Love
              </span>
              <span className="text-slate-800"> Their</span>
              <br />
              <span className="text-slate-700">Hiring Process Now</span>
            </h2>

            <p className="text-lg md:text-xl text-slate-500 max-w-xl mx-auto">
              Don't just take our word for it. Here's what our users have to say.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.15 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`relative p-8 rounded-3xl bg-gradient-to-br ${testimonial.bgGradient} border ${testimonial.borderColor} shadow-xl ${testimonial.glowColor} hover:shadow-2xl transition-all duration-500 group`}
            >
              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-white to-emerald-50 border border-emerald-100 flex items-center justify-center shadow-lg rotate-12 group-hover:rotate-0 transition-transform duration-500">
                <Quote className={`w-7 h-7 ${testimonial.iconColor}`} />
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400 drop-shadow-sm" />
                  ))}
                </div>
                <span className="text-sm font-medium text-slate-400">5.0</span>
              </div>

              {/* Testimonial text with better typography */}
              <p className="text-slate-700 mb-8 leading-relaxed text-lg font-medium">"{testimonial.text}"</p>

              <div className="flex items-center gap-4 pt-6 border-t border-slate-100/80">
                <div className={`relative p-1 rounded-full bg-gradient-to-br ${testimonial.accentGradient}`}>
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover bg-white ring-2 ring-white"
                  />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-lg">{testimonial.name}</div>
                  <div className="text-sm text-slate-500 font-medium">{testimonial.role}</div>
                  <div
                    className={`text-sm font-semibold bg-gradient-to-r ${testimonial.accentGradient} bg-clip-text text-transparent`}
                  >
                    {testimonial.company}
                  </div>
                </div>
              </div>

              <div
                className={`absolute bottom-0 left-6 right-6 h-1.5 bg-gradient-to-r ${testimonial.accentGradient} rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:left-4 group-hover:right-4`}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-slate-400 text-sm">
            Trusted by <span className="font-semibold text-emerald-600">500+</span> HR teams worldwide
          </p>
        </motion.div>
      </div>
    </section>
  )
}
