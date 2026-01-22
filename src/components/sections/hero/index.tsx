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
      className="relative min-h-screen pt-10 sm:pt-12 md:pt-16 lg:pt-20"
    >
      <Container size="wide">
        {/* Main hero content - Avatar + Text aligned */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
          {/* Avatar - left on mobile, right on desktop */}
          <AvatarWithGlow className="shrink-0 md:order-last" />
          {/* Text content group */}
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <HeroTitle />
            <HeroSubtitle />
          </div>
        </div>

        {/* Bio content - stays below the aligned section */}
        <div className="mt-8 md:mt-12">
          <HeroBio />
        </div>

        {/* Space reserved for future content: GitHub contributions, social links, etc. */}
        <div
          className="mt-8 md:mt-10"
          aria-hidden="true"
        />
      </Container>
    </section>
  );
}
