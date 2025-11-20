"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const companies = [
  {
    name: "Google",
    logo: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
  },
  {
    name: "Meta",
    logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
  },
  {
    name: "Amazon",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  },
  {
    name: "Microsoft",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
  },
  {
    name: "Apple",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
  },
  {
    name: "Netflix",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
  },
  {
    name: "Stripe",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
  },
  {
    name: "Airbnb",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg",
  },
]

const PokerChip = ({
  position,
  delay,
}: {
  position: string
  delay: number
}) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{ ...JSON.parse(position) }}
    animate={{
      y: [0, -20, 0],
      rotate: [0, 360],
    }}
    transition={{
      duration: 6 + delay,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
      delay,
    }}
  >
    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-700 shadow-lg border-4 border-red-300 flex items-center justify-center text-white font-bold text-xl">
      {["♠", "♥", "♦", "♣"][Math.floor(Math.random() * 4)]}
    </div>
  </motion.div>
)

export default function TrustedBy() {
  const duplicatedCompanies = [...companies, ...companies]

  return (
    <section className="relative w-full py-32 md:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-red-950/95 via-red-900/90 to-red-800/95" />

      <PokerChip position='{"top": "5%", "left": "5%"}' delay={0} />
      <PokerChip position='{"top": "20%", "right": "8%"}' delay={1.5} />
      <PokerChip position='{"bottom": "10%", "left": "12%"}' delay={3} />
      <PokerChip position='{"bottom": "25%", "right": "6%"}' delay={0.75} />

      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)",
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="mb-6 flex items-center justify-center gap-2">
            <span className="text-red-300 text-2xl">♠</span>
            <p className="text-base md:text-lg font-bold uppercase tracking-widest bg-gradient-to-r from-red-200 via-red-100 to-red-200 bg-clip-text text-transparent">
              Going All In
            </p>
            <span className="text-red-300 text-2xl">♣</span>
          </div>

          <p className="text-sm md:text-base font-semibold text-red-200 uppercase tracking-wide mb-20 md:mb-28 px-4">
            Trusted by hiring teams at these premium companies
          </p>

          <div className="relative overflow-hidden rounded-2xl backdrop-blur-md bg-white/5 border border-red-300/20 p-8 md:p-12 shadow-2xl">
            {/* Infinite scroll container */}
            <div className="flex w-full">
              <motion.div
                className="flex gap-16 md:gap-24 lg:gap-32 items-center"
                animate={{
                  x: [0, -50 + "%"],
                }}
                transition={{
                  x: {
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "loop",
                    duration: 30,
                    ease: "linear",
                  },
                }}
              >
                {duplicatedCompanies.map((company, index) => (
                  <motion.div
                    key={`${company.name}-${index}`}
                    className="flex-shrink-0 transition-all duration-500"
                    whileHover={{
                      scale: 1.15,
                      filter: "drop-shadow(0 0 20px rgba(239, 68, 68, 0.5))",
                    }}
                  >
                    <div className="h-12 w-40 flex items-center justify-center relative group">
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-300" />
                      <Image
                        src={company.logo || "/placeholder.svg"}
                        alt={`${company.name} logo`}
                        width={160}
                        height={48}
                        className="max-h-full max-w-full object-contain filter brightness-90 group-hover:brightness-100 transition-all duration-300"
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>

          <div className="mt-16 space-y-3">
            <p className="text-sm md:text-base text-red-200 italic px-4">
              They checked their hand before going all in on hiring.
            </p>
            <p className="text-xs md:text-sm text-red-300/60 px-4">Smart moves always beat the odds.</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
