"use client";

import { motion } from "motion/react";
import { ExternalLink, Github } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useReducedMotion } from "@/hooks";
import { cn } from "@/lib/utils";
import { TechBadge } from "./tech-badge";
import type { Project } from "@/data";

interface ProjectCardProps {
  project: Project;
  index: number;
  className?: string;
}

export function ProjectCard({ project, index, className }: ProjectCardProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-5% 0px" }}
      transition={{
        delay: index * 0.1,
        duration: 0.4,
        ease: [0.33, 1, 0.68, 1],
      }}
      className={cn(
        project.featured ? "md:col-span-2" : "",
        className
      )}
    >
      <Card className="group h-full transition-shadow hover:shadow-md">
        <CardContent className="flex h-full flex-col p-6">
          <ProjectCardHeader project={project} />
          <ProjectCardBody project={project} />
          <ProjectCardFooter project={project} />
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ProjectCardHeader({ project }: { project: Project }) {
  return (
    <div className="mb-4 flex items-start justify-between">
      <h3 className="text-lg font-semibold">{project.title}</h3>
      <ProjectCardLinks project={project} />
    </div>
  );
}

function ProjectCardLinks({ project }: { project: Project }) {
  return (
    <div className="flex gap-2">
      {project.github && (
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground transition-colors hover:text-foreground"
          aria-label={`View ${project.title} on GitHub`}
        >
          <Github className="h-4 w-4" />
        </a>
      )}
      {project.link && (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground transition-colors hover:text-foreground"
          aria-label={`Visit ${project.title}`}
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}

function ProjectCardBody({ project }: { project: Project }) {
  return (
    <p className="mb-4 flex-1 text-sm text-muted-foreground">
      {project.description}
    </p>
  );
}

  function ProjectCardFooter({ project }: { project: Project }) {
  return (
    <div className="flex flex-wrap gap-2">
      {project.tech.map((tech, i) => (
        <TechBadge key={`${tech}-${i}`} tech={tech} />
      ))}
    </div>
  );
}
