"use client";

import { Container, Section, SectionTitle } from "@/components/layout";
import { BLOG_POSTS } from "@/data";
import { BlogCard } from "./blog-card";

export function BlogsSection() {
  return (
    <Section id="blogs">
      <Container>
        <SectionTitle>Blogs</SectionTitle>
        
        <div className="grid gap-4 md:grid-cols-2">
          {BLOG_POSTS.map((post, index) => (
            <BlogCard
              key={post.id}
              post={post}
              index={index}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
