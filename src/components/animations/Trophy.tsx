"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

export default function TrophyAnimation() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, y: 40 }}
      animate={{ scale: 1.2, opacity: 1, y: 0 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.6, type: "spring" }}
      className="fixed inset-0 flex items-center justify-center pointer-events-none z-[9999]"
    >
      <motion.div
        animate={{
          rotate: [0, -10, 10, -10, 10, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
        className="text-yellow-400 drop-shadow-[0_0_25px_rgba(255,255,0,0.6)]"
      >
        <Trophy size={120} />
      </motion.div>
    </motion.div>
  );
}
