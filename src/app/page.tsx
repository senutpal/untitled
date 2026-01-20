import { Navigation } from "@/components/navigation";
import { SkipLink } from "@/components/ui/skip-link";
import {
  HeroSection,
  AboutSection,
  ProjectsSection,
  EducationSection,
  BlogsSection,
  FunSection,
} from "@/components/sections";

export default function Home() {
  return (
    <>
      <SkipLink />
      <Navigation />
      <main id="main-content">
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <EducationSection />
        <BlogsSection />
        <FunSection />
      </main>
      <Footer />
    </>
  );
}

function Footer() {
  return (
    <footer className="py-12 text-center">
      <p className="text-sm text-muted-foreground">
        Built with curiosity and code
      </p>
    </footer>
  );
}
