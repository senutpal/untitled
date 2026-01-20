"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useReducedMotion } from "@/hooks";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/data";

interface BlogCardProps {
  post: BlogPost;
  index: number;
  className?: string;
}

export function BlogCard({ post, index, className }: BlogCardProps) {
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
      className={className}
    >
      <a href={post.link} className="block">
        <Card className="group transition-shadow hover:shadow-md">
          <CardContent className="p-6">
            <BlogCardMeta post={post} />
            <BlogCardTitle post={post} />
            <BlogCardExcerpt post={post} />
          </CardContent>
        </Card>
      </a>
    </motion.div>
  );
}

function BlogCardMeta({ post }: { post: BlogPost }) {
  return (
    <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
      <span>{post.date}</span>
      <span>·</span>
      <span>{post.readTime}</span>
    </div>
  );
}

function BlogCardTitle({ post }: { post: BlogPost }) {
  return (
    <div className="mb-2 flex items-start justify-between gap-2">
      <h3 className="font-semibold">{post.title}</h3>
      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </div>
  );
}

function BlogCardExcerpt({ post }: { post: BlogPost }) {
  return (
    <p className="text-sm text-muted-foreground line-clamp-2">
      {post.excerpt}
    </p>
  );
}
