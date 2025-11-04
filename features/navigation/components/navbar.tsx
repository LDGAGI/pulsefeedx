"use client";
import { motion } from "framer-motion";

import { DesktopNavbar } from "./desktop-navbar";
import { MobileNavbar } from "./mobile-navbar";

export function NavBar() {
  return (
    <motion.nav
      initial={{
        y: -80,
      }}
      animate={{
        y: 0,
      }}
      transition={{
        ease: [0.6, 0.05, 0.1, 0.9],
        duration: 0.8,
      }}
      className="fixed top-4 z-50 w-[calc(100%-2rem)] max-w-[calc(100vw-2rem)] lg:max-w-7xl mx-auto inset-x-0"
    >
      <div className="w-full">
        <DesktopNavbar />
      </div>
    </motion.nav>
  );
}
