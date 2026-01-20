"use client";

import { Container, Section, SectionTitle } from "@/components/layout";
import { PERSONAL_INFO } from "@/data";
import { AboutLine } from "./about-line";
import { BlogLink } from "./blog-link";

export function AboutSection() {
  return (
    <Section id="about">
      <Container>
        <SectionTitle>About</SectionTitle>
        
        <div className="space-y-4">
          <AboutLine 
            text={`tldr; ${PERSONAL_INFO.bio.tldr}`} 
            delay={0} 
            className="text-muted-foreground"
          />
          
          <div className="h-4" />
          
          <AboutLine 
            text={PERSONAL_INFO.bio.line1} 
            delay={0.1} 
          />
          
          <AboutLine 
            text={PERSONAL_INFO.bio.line2} 
            delay={0.2} 
          />
          
          <div className="h-4" />
          
          <AboutLine 
            text={PERSONAL_INFO.bio.line3} 
            delay={0.3} 
          />
          
          <div className="h-4" />
          
          <BlogLink 
            text={PERSONAL_INFO.bio.blogLink} 
            href="#blogs" 
            delay={0.4} 
          />
        </div>
      </Container>
    </Section>
  );
}
