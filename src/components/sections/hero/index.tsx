"use client";

import { Container } from "@/components/layout";
import { AvatarWithGlow } from "@/components/ui/avatar-with-glow";
import { HeroTitle } from "./hero-title";
import { HeroSubtitle } from "./hero-subtitle";
import { HeroBio } from "./hero-bio";

export function HeroSection() {
  return (
    <section
      id="hero"
      aria-label="Introductory hero section"
      className="relative min-h-screen pt-20 sm:pt-24 md:pt-32 lg:pt-40"
    >
      <Container size="wide" className="flex flex-col items-start">
        {/* Avatar with glowing border */}
        <AvatarWithGlow className="mb-8 md:mb-10" />

        {/* Title and subtitle */}
        <HeroTitle />
        <HeroSubtitle />

        {/* Bio content */}
        <HeroBio />

        {/* Space reserved for future content: GitHub contributions, social links, etc. */}
        <div className="mt-auto min-h-[120px] md:min-h-[160px]" aria-hidden="true" />
      </Container>
    </section>
  );
}
