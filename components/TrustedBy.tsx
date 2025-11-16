"use client";

import { motion } from "framer-motion";
import Image from "next/image";

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
];

export default function TrustedBy() {
  // Duplicate companies array for seamless loop
  const duplicatedCompanies = [...companies, ...companies];

  return (
    <section className="relative w-full py-20 md:py-24 overflow-hidden -mt-8">
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-base md:text-xl font-semibold text-gray-500 uppercase tracking-wide mb-16 md:mb-20 px-4">
            Trusted by hiring teams at these companies
          </p>

          <div className="relative overflow-visible w-full">
            {/* Infinite scroll container */}
            <div className="flex w-full">
              <motion.div
                className="flex gap-12 md:gap-16 lg:gap-20 items-center"
                animate={{
                  x: [0, -50 + "%"],
                }}
                transition={{
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 30,
                    ease: "linear",
                  },
                }}
              >
                {duplicatedCompanies.map((company, index) => (
                  <div
                    key={`${company.name}-${index}`}
                    className="flex-shrink-0 transition-all duration-300 opacity-70 hover:opacity-100 hover:scale-110"
                  >
                    <div className="h-10 w-32 flex items-center justify-center relative">
                      <Image
                        src={company.logo}
                        alt={`${company.name} logo`}
                        width={128}
                        height={40}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          <p className="text-sm md:text-base text-gray-400 mt-12 italic px-4">
            (They fixed their hiring mess first. Smart people.)
          </p>
        </motion.div>
      </div>
    </section>
  );
}
