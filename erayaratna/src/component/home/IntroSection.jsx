import { motion } from "framer-motion";

const IntroSection = () => (
  <motion.section
    className="w-full z-0 px-6 py-14 bg-gradient-to-b from-[#FFD59F] to-[#FFB39F] rounded-2xl shadow-xl border border-[#F3B68D]"
    initial={{ opacity: 0, y: -30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <div className="max-w-6xl mx-auto text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-5 text-[#4B2E2E] tracking-wide">
        Welcome to <span className="text-[#8B3A3A]">Eraya RATNA</span>
      </h1>
      <p className="text-lg md:text-xl text-[#5A3E36] font-medium leading-relaxed">
        Discover authentic handcrafted jewelry, made with sacred energies andtimeless tradition.
      </p>
    </div>
  </motion.section>
);

export default IntroSection;
