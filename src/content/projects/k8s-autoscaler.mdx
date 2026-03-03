---
name: "k8s-autoscaler"
description: "intelligent horizontal pod autoscaler. uses time-series forecasting to predict load and pre-emptively scale workloads."
tech: ["go", "python", "kubernetes"]
github: "#"
demo: "#"
featured: true
order: 2
tagline: "predictive pod autoscaling using LSTM models to forecast traffic spikes. reduced cloud costs by 24% in staging environments."
stars: 215
forks: 34
previewType: "abstract"
metrics:
  - label: "cost reduction"
    value: "24%"
    detail: "vs default HPA"
  - label: "prediction accuracy"
    value: "94%"
    detail: "15min window"
  - label: "scale-up time"
    value: "<30s"
    detail: "cold start"
codeSnippet:
  filename: "pkg/predictor/lstm.go"
  language: "go"
  code: |
    func (p *LSTMPredictor) Forecast(metrics []TimeSeries) (*Prediction, error) {
        // normalize input metrics to [0,1] range
        normalized := p.scaler.Transform(metrics)

        // run inference on LSTM model
        output, err := p.model.Forward(normalized)
        if err != nil {
            return nil, fmt.Errorf("inference failed: %w", err)
        }

        // convert prediction to replica count
        return p.toReplicaCount(output), nil
    }
features:
  - title: "Scaling Intelligence"
    items:
      - "LSTM-based time series forecasting trained on historical traffic patterns."
      - "Custom metrics adapter supporting Prometheus, Datadog, and CloudWatch."
  - title: "Reliability"
    items:
      - "Graceful fallback to default HPA when prediction confidence is low."
      - "Circuit breaker pattern prevents rapid scaling oscillations."
---

A Kubernetes-native autoscaler that uses machine learning to predict traffic patterns and proactively scale workloads before demand spikes hit.
