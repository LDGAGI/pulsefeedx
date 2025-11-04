"use client";
import Link from "next/link";
import React from "react";

export const Logo = () => {
  return (
    <Link
      href="/"
      className="font-semibold flex items-center text-lg mr-4 text-foreground px-2 py-1 relative z-20"
    >
      <span className="font-bold text-foreground">PulseFeedX</span>
    </Link>
  );
};
