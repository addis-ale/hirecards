"use client";

import { useState } from "react";
import { useChatbot } from "./ChatbotProvider";
import HeroSection from "./hero/HeroSection";

export const Hero = () => {
  const { openChatbot } = useChatbot();

  const handleGetStarted = () => {
    openChatbot();
  };

  return <HeroSection onGetStarted={handleGetStarted} />;
};

export default Hero;
