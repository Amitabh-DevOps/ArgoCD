# 🚀 ArgoCD — Zero to Production (One Shot)

> **A complete, hands-on ArgoCD course** — from GitOps fundamentals to real-world, production-grade deployments on Kubernetes.

[![Kubernetes](https://img.shields.io/badge/Kubernetes-v1.35-326CE5?style=flat-square&logo=kubernetes&logoColor=white)](https://kubernetes.io)
[![ArgoCD](https://img.shields.io/badge/ArgoCD-Stable-EF7B4D?style=flat-square&logo=argo&logoColor=white)](https://argo-cd.readthedocs.io)
[![kind](https://img.shields.io/badge/kind-v0.29+-326CE5?style=flat-square&logo=docker&logoColor=white)](https://kind.sigs.k8s.io)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## 📚 Course Curriculum

| # | Module | Status |
|---|--------|--------|
| 01 | Intro to GitOps & ArgoCD | ✅ Done |
| 02 | ArgoCD Basics | ✅ Done |
| 03 | Setup & Installation| ✅ Done |
| 04 | First App Deployment | ✅ Done |
| 05 | ArgoCD Features (Sync Waves, Hooks, Health) | 📋 Planned |
| 06 | ArgoCD Notifications | 📋 Planned |
| 07 | ArgoCD Image Updater | 📋 Planned |
| 08 | Monitoring the ArgoCD | 📋 Planned |
| 09 | Security & Scaling | 📋 Planned |
| 10 | Argo Rollouts (Blue-Green / Canary) | 📋 Planned |
| 11 | Argo Workflows | 📋 Planned |
| 12 | Argo Events | 📋 Planned |
| 13 | Real World End-to-End Project | 📋 Planned |
| 14 | Interview Questions & Industry Tips | 📋 Planned |
| 🎁 | Bonus: HTTPS Hosting for ArgoCD | 📋 Planned |

---

## 🗂️ Repository Structure

```
ArgoCD/
├── app/                    # Demo web application (Node.js + Docker)
│   ├── public/             # Static frontend (HTML, CSS, JS)
│   ├── server.js           # Express server
│   ├── package.json
│   └── Dockerfile          # Multi-stage production build
├── kind-cluster.yaml       # KinD cluster config (1 control + 1 worker)
├── argocd-setup.md         # Step-by-step ArgoCD setup guide
└── README.md
```

---

## 🛠️ Setup & Installation

> Full step-by-step instructions are in **[argocd-setup.md](argocd-setup.md)**

| Step | What you'll do |
|------|----------------|
| **1** | Install prerequisites — Docker, kubectl, kind |
| **2** | Create the KinD cluster using `kind-cluster.yaml` |
| **3** | Install ArgoCD, access the UI & get the initial password |
| **4** | Install the ArgoCD CLI and login from your terminal |
| **5** | Register your cluster with ArgoCD |

---

## 🧪 Demo Application

The `/app` directory contains a modern Node.js static web app that covers ArgoCD & GitOps concepts visually. Use it to demonstrate deployments throughout the course.

```bash
# Run locally
cd app
npm install
node server.js
# → http://localhost:3000

# Build Docker image
docker build -t <your-dockerhub>/argocd-demo:v1.0.0 ./app
docker push <your-dockerhub>/argocd-demo:v1.0.0
```

---

## 🔗 Useful Links

| Resource | URL |
|----------|-----|
| ArgoCD Official Docs | https://argo-cd.readthedocs.io |
| ArgoCD GitHub | https://github.com/argoproj/argo-cd |
| kind Documentation | https://kind.sigs.k8s.io |
| OpenGitOps Specification | https://opengitops.dev |
| CNCF Argo Project Page | https://www.cncf.io/projects/argo |

---

## ⭐ Support

If this course helped you, please **star the repo** and **subscribe to the channel** (https://www.youtube.com/@SoniAmitabh) — it helps create more free content!

---

*Built with ❤️ for the DevOps & Kubernetes community*
