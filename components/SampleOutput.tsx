"use client"

import { motion } from "framer-motion"
import { DollarSign, AlertTriangle, CheckCircle, Users, Zap, TrendingUp, Flame, Lightbulb } from "lucide-react"

export default function SampleOutput() {
  const redFlags = [
    "Salary 20% below market (good luck with that)",
    "87 competitors fighting for the same unicorns",
    "This skill combo is rarer than a bug-free deploy",
  ]

  const recommendations = [
    "Go remote or go home (literally)",
    "Bump that salary before someone else does",
    "Split this Frankenstein role into two humans",
  ]

  return (
    <section className="py-16 md:py-20 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        {/* Animated poker chips in background */}
        <motion.div
          className="absolute top-1/4 left-10 w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent shadow-2xl opacity-15"
          animate={{ rotate: 360, y: [0, 20, 0] }}
          transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/4 w-32 h-32 rounded-full bg-gradient-to-br from-accent to-primary shadow-2xl opacity-10"
          animate={{ rotate: -360, y: [0, -20, 0] }}
          transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
        />
        {/* Diagonal stripe pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(236, 76, 47, 0.1) 35px, rgba(236, 76, 47, 0.1) 70px)",
          }}
        />
      </div>

      <div className="section-container relative z-10">
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-6 border-2 border-primary/30 bg-gradient-to-r from-primary/10 to-accent/10 backdrop-blur-sm">
              <span className="text-lg">♠</span>
              <span className="text-sm font-bold text-primary uppercase tracking-widest">
                Damage Report • All In On Data
              </span>
              <span className="text-lg">♥</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
              Here&apos;s What We&apos;ll Tell You
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Brutally honest scores. Market reality. Red flags you can't ignore. And fixes that actually work.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500" />
            <div className="relative bg-card rounded-2xl shadow-2xl overflow-hidden border-2 border-primary/40 backdrop-blur-sm">
              <div className="p-6 md:p-8 bg-gradient-to-r from-primary/5 to-accent/5 border-b-2 border-primary/20 relative">
                {/* Poker chip score badge */}
                <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent shadow-2xl flex items-center justify-center text-white font-bold text-2xl border-4 border-card z-20">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    78
                  </motion.div>
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl">♦</span>
                    <div className="text-sm font-bold opacity-80 uppercase tracking-widest text-primary">
                      Your Hand Was Posted. Roasted
                    </div>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Senior Full-Stack Engineer</h3>
                  <p className="text-sm text-muted-foreground">San Francisco • Remote OK • Series B Startup</p>
                </div>
              </div>

              <div className="p-6 md:p-8 grid md:grid-cols-2 gap-6">
                {/* Salary Range Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2 font-bold text-sm uppercase tracking-widest text-foreground">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <span>Market Salary Range</span>
                  </div>
                  <div className="border-2 border-primary/30 rounded-lg p-4 bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur-sm hover:border-primary/50 transition-all group/card">
                    <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                      $110K - $145K
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Your range: <span className="text-foreground font-semibold">$85K-$105K</span>
                      <span className="text-red-600 font-bold ml-2 inline-flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> 20% below
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Competition Level Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 }}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2 font-bold text-sm uppercase tracking-widest text-foreground">
                    <Users className="w-4 h-4 text-primary" />
                    <span>Competition Analysis</span>
                  </div>
                  <div className="border-2 border-primary/30 rounded-lg p-4 bg-gradient-to-br from-primary/5 to-accent/5 backdrop-blur-sm hover:border-primary/50 transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xl font-bold text-foreground mb-1">Very High</div>
                        <div className="text-xs text-muted-foreground">87 similar roles posted this week</div>
                      </div>
                      <Flame className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                </motion.div>

                {/* Red Flags */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2 font-bold text-sm uppercase tracking-widest text-foreground">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span>Key Red Flags ({redFlags.length})</span>
                  </div>
                  <div className="space-y-2">
                    {redFlags.map((flag, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + index * 0.05 }}
                        className="flex items-start space-x-2 bg-red-500/10 border-2 border-red-500/30 rounded-lg p-3 hover:border-red-500/50 transition-all backdrop-blur-sm"
                      >
                        <AlertTriangle className="w-3 h-3 text-red-600 mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-muted-foreground">{flag}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Recommendations */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.25 }}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2 font-bold text-sm uppercase tracking-widest text-foreground">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>Recommendations ({recommendations.length})</span>
                  </div>
                  <div className="space-y-2">
                    {recommendations.map((rec, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.25 + index * 0.05 }}
                        className="flex items-start space-x-2 border-2 border-primary/30 rounded-lg p-3 bg-gradient-to-r from-primary/5 to-accent/5 hover:border-primary/50 transition-all backdrop-blur-sm"
                      >
                        <Lightbulb className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-muted-foreground">{rec}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-10"
          >
            <p className="text-lg font-bold mb-6 text-foreground">
              This is just your{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Damage Report Card
              </span>
              ,
              <br /> you get 8+ more cards that'll save your hiring budget.
            </p>
            <a
              href="/create"
              className="inline-flex items-center justify-center space-x-2 px-8 py-4 font-bold rounded-xl bg-gradient-to-r from-primary to-accent hover:shadow-2xl hover:shadow-primary/50 text-primary-foreground transition-all shadow-lg active:scale-95 uppercase tracking-wider text-sm"
            >
              <Zap className="w-4 h-4" />
              <span>Go All In</span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
