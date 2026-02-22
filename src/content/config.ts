import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    readingTime: z.string().optional(),
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    description: z.string(),
    tech: z.array(z.string()),
    github: z.string(),
    demo: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
    tagline: z.string().optional(),
    stars: z.number().optional(),
    forks: z.number().optional(),
    liveDemo: z.string().optional(),
    previewType: z.enum(['terminal', 'browser', 'abstract', 'grid']).optional(),
    metrics: z.array(z.object({
      label: z.string(),
      value: z.string(),
      detail: z.string(),
    })).optional(),
    architecture: z.object({
      nodes: z.array(z.string()),
      description: z.array(z.object({
        label: z.string(),
        text: z.string(),
      })),
    }).optional(),
    benchmarks: z.array(z.object({
      dataset: z.string(),
      vectors: z.string(),
      latency: z.string(),
      recall: z.string(),
    })).optional(),
    codeSnippet: z.object({
      filename: z.string(),
      language: z.string(),
      code: z.string(),
    }).optional(),
    features: z.array(z.object({
      title: z.string(),
      items: z.array(z.string()),
    })).optional(),
  }),
});

const reading = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    author: z.string(),
    type: z.enum(['book', 'blog', 'video']),
    status: z.enum(['reading', 'on-deck', 'completed']),
    url: z.string(),
    duration: z.string().optional(),
    date: z.string(),
    tags: z.array(z.string()).default([]),
    rating: z.number().min(1).max(5).optional(),
    abstract: z.string().optional(),
    takeaways: z.array(z.object({
      icon: z.string(),
      title: z.string(),
      description: z.string(),
    })).optional(),
    highlights: z.array(z.object({
      quote: z.string(),
      source: z.string(),
    })).optional(),
  }),
});

export const collections = { blog, projects, reading };
