"use client";

import { Container } from "@/components/layout";
import { HeroAvatar } from "./hero-avatar";
import { HeroTitle } from "./hero-title";
import { HeroSubtitle } from "./hero-subtitle";
import { ScrollIndicator } from "./scroll-indicator";

export function HeroSection() {
  return (
    <section
      id="hero"
      aria-label="Introductory hero section"
      className="relative flex min-h-screen items-center justify-center"
    >
      <Container className="flex flex-col items-center text-center">
        <HeroAvatar />
        <HeroTitle />
        <HeroSubtitle />
      </Container>
      <ScrollIndicator />
    </section>
  );
}
