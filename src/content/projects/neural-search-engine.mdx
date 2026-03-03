---
name: "neural-search-engine"
description: "distributed vector search engine built from scratch. features custom HNSW implementation for high-dimensional approximate nearest neighbor search."
tech: ["rust", "grpc", "vector-db"]
github: "#"
featured: true
order: 1
tagline: "a high-performance, distributed vector search engine implemented from scratch in rust. designed for sub-50ms similarity search across million-scale high-dimensional embeddings."
stars: 1200
forks: 84
previewType: "terminal"
metrics:
  - label: "avg latency"
    value: "42ms"
    detail: "p99 < 85ms"
  - label: "index size"
    value: "1.2M"
    detail: "vectors (1536-dim)"
  - label: "recall@10"
    value: "0.96"
    detail: "hnsw optimized"
architecture:
  nodes:
    - "Client (gRPC)"
    - "Load Balancer"
    - "Worker Node A"
    - "Worker Node B"
    - "S3 (Snapshot)"
  description:
    - label: "Index Distribution"
      text: "Uses consistent hashing to shard vectors across multiple worker nodes."
    - label: "Query Path"
      text: "Aggregator node broadcasts query to shards, collects top-k candidates, and performs final re-ranking."
benchmarks:
  - dataset: "Glove-25"
    vectors: "1.2M"
    latency: "12.4ms"
    recall: "0.982"
  - dataset: "Deep-1B (Shard)"
    vectors: "10M"
    latency: "44.1ms"
    recall: "0.941"
  - dataset: "Sift-128"
    vectors: "1M"
    latency: "8.2ms"
    recall: "0.995"
codeSnippet:
  filename: "core/src/index/hnsw.rs"
  language: "rust"
  code: |
    pub fn insert(&mut self, vector: Vector) -> Result<u64> {
        // determine layer count via log probability
        let level = self.random_level();

        // find nearest neighbors at each level
        let mut current_node = self.entry_point;
        for i in (level + 1..self.max_level).rev() {
            current_node = self.search_layer_closest(vector, current_node, i);
        }

        // build connections using SIMD-accelerated distance metrics
        self.connect_neighbors(vector, current_node, level)
    }
features:
  - title: "Resilience Features"
    items:
      - "Write-Ahead Logging (WAL): Ensures no data loss during sudden power failure or crashes."
      - "Incremental Indexing: No need to rebuild the entire graph for new vector additions."
  - title: "Observability"
    items:
      - "Integrated Prometheus metrics endpoint tracking cache hit ratios, graph traversal depth, and search latency histograms."
      - "Dashboarding via custom Grafana templates."
---

The system utilizes a Hierarchical Navigable Small World (HNSW) graph for indexing. Unlike traditional KD-trees, HNSW scales logarithmically while maintaining high recall rates for high-dimensional vector spaces.
