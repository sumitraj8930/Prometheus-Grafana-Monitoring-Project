# 🚀 Kubernetes Monitoring Project

## 📊 Node.js + Prometheus + Grafana + Alerting

---

# 📌 Project Overview

This project demonstrates how to:

* 🐳 Containerize a Node.js application
* ☸️ Deploy it on Kubernetes
* 📈 Monitor it using Prometheus
* 📊 Visualize metrics using Grafana
* 🚨 Configure alert rules

This setup represents a **real-world production monitoring architecture**.

---

# 🏗️ Architecture

```
User
  ↓
Kubernetes Service (NodePort)
  ↓
Node.js App (Pod)
  ↓
Prometheus (Helm Deployment)
  ↓
Grafana Dashboard
  ↓
Alert Rules
```

---

# 🧩 Components Used

## 1️⃣ Node.js Application

### 🔹 Endpoints

| Endpoint   | Purpose            |
| ---------- | ------------------ |
| `/`        | Basic response     |
| `/metrics` | Prometheus metrics |

### 🔹 Metrics Collected

* HTTP request count
* Request duration
* Application memory usage
* Process metrics
* (Optional) Custom metrics

Metrics are generated using:

```
prom-client
```

---

## 2️⃣ Docker Containerization 🐳

The application is containerized using a lightweight Docker image.

### Build Image

```bash
docker build -t sumitraj0157/notes-app-monitoring .
```

### Push Image

```bash
docker push sumitraj0157/notes-app-monitoring
```

---

## 3️⃣ Kubernetes Deployment ☸️

Kubernetes manifests are inside:

```
k8s/
```

### 🔹 deployment.yaml

Defines:

* Pod
* Container image
* Replicas
* Container port

Apply using:

```bash
kubectl apply -f k8s/deployment.yaml
```

---

### 🔹 service.yaml

Creates Kubernetes Service.

Service provides internal DNS:

```
node-app.default.svc.cluster.local
```

Apply using:

```bash
kubectl apply -f k8s/service.yaml
```

---

# 📊 Prometheus Installation (Helm)

Prometheus is installed using Helm.

### Install Prometheus

```bash
helm install prometheus prometheus-community/prometheus -f values.yaml
```

---

# 📝 values.yaml Explained

This file customizes Prometheus configuration.

### 🔹 NodePort Service

```yaml
server:
  service:
    type: NodePort
    nodePort: 30090
```

Prometheus accessible at:

```
http://<Node-IP>:30090
```

---

### 🔹 Extra Scrape Config

```yaml
extraScrapeConfigs:
  - job_name: 'node-app'
    static_configs:
      - targets: ['node-app.default.svc.cluster.local:3001']
```

This tells Prometheus to scrape:

```
http://node-app.default.svc.cluster.local:3001/metrics
```

---

### 🔹 Alert Rule

```yaml
- alert: NodeAppDown
  expr: up{job="node-app"} == 0
  for: 1m
```

If application is down for more than 1 minute → alert triggers.

---

# 📈 Grafana Setup

Grafana is used to visualize Prometheus data.

## Dashboards Created

### ✅ Request Rate

```
rate(http_requests_total[1m])
```

---

### ✅ Error Rate

```
(
  rate(http_requests_total{status=~"5.."}[1m])
/
  rate(http_requests_total[1m])
) * 100
```

---

### ✅ Memory Usage

```
process_resident_memory_bytes
```

---

### ✅ CPU Usage (Node Exporter)

```
100 - (avg by(instance) (rate(node_cpu_seconds_total{mode="idle"}[1m])) * 100)
```

---

# 🚨 Alerting

Alert rules are defined inside `values.yaml`.

### Example Alert

* Node App Down
* High CPU Usage
* High Memory Usage

Alerts trigger when threshold is exceeded.

---

# 📂 Project Structure

```
.
├── Dockerfile
├── index.js
├── package.json
├── k8s/
│   ├── deployment.yaml
│   ├── service.yaml
├── values.yaml
└── README.md
```

---

# 🛠️ Technologies Used

* Node.js
* Express
* prom-client
* Docker
* Kubernetes
* Helm
* Prometheus
* Grafana

---

# 🎯 How To Run Complete Project

### 1️⃣ Build & Push Image

```bash
docker build -t <username>/node-monitoring-app .
docker push <username>/node-monitoring-app
```

---

### 2️⃣ Deploy App to Kubernetes

```bash
kubectl apply -f k8s/
```

---

### 3️⃣ Install Prometheus

```bash
helm install prometheus prometheus-community/prometheus -f values.yaml
```

---

### 4️⃣ Access Services

* Node App → NodePort / ClusterIP
* Prometheus → NodeIP:30090
* Grafana → (Port forward or LoadBalancer)

---

# 🧠 Key Concepts Learned

* Kubernetes Deployment & Service
* Helm configuration using values.yaml
* Prometheus scrape targets
* PromQL queries
* Alert rule configuration
* Production-style monitoring setup

---

# 🏆 Project Highlights

✔ Kubernetes-native deployment
✔ Helm-based monitoring setup
✔ Custom scrape configuration
✔ Alert rules integrated
✔ Real-world DevOps architecture

---
