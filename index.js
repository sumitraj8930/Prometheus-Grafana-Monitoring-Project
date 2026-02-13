import express from "express";
import client from "prom-client";

const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.json());

// Collect default metrics
client.collectDefaultMetrics();

// =============================
// Custom Metrics
// =============================

// HTTP request counter
const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"]
});

// Request duration histogram
const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status"],
  buckets: [0.1, 0.3, 0.5, 1, 1.5, 2]
});

// Application version metric
const appVersion = new client.Gauge({
  name: "app_version",
  help: "Application version"
});

appVersion.set(1); // version 1.0.0

// =============================
// Middleware for metrics
// =============================
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = (Date.now() - start) / 1000;

    httpRequestCounter.inc({
      method: req.method,
      route: req.path,
      status: res.statusCode
    });

    httpRequestDuration.observe(
      {
        method: req.method,
        route: req.path,
        status: res.statusCode
      },
      duration
    );
  });

  next();
});

// =============================
// Routes
// =============================
app.get("/", (req, res) => {
  res.send("Node.js App Monitoring using Prometheus and Grafana!");
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

// =============================
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
