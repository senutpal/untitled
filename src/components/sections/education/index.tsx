import { Container, Section, SectionTitle } from "@/components/layout";
import { EDUCATION } from "@/data";
import { TimelineItem } from "./timeline-item";

export function EducationSection() {
  return (
    <Section id="education">
      <Container>
        <SectionTitle>Education</SectionTitle>
        
        <div className="ml-1">
          {EDUCATION.map((edu, index) => (
            <TimelineItem
              key={edu.id}
              education={edu}
              isFirst={index === 0}
              isLast={index === EDUCATION.length - 1}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
