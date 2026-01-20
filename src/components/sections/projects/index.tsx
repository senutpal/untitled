"use client";

import { Container, Section, SectionTitle } from "@/components/layout";
import { PROJECTS } from "@/data";
import { ProjectCard } from "./project-card";

export function ProjectsSection() {
  return (
    <Section id="projects">
      <Container size="wide">
        <SectionTitle>Projects</SectionTitle>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
