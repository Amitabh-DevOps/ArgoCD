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
| 05 | ArgoCD Projects (Multi-Team Isolation + RBAC) | 📋 Planned |
| **05.5** | **Sync Waves & Hooks** ← *current* | 🔄 **In Progress** |
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
│   ├── Dockerfile          # Multi-stage production build
│   └── k8s/                # Kubernetes manifests
│       ├── deployment.yaml # Kubernetes Deployment (2 replicas)
│       └── service.yaml    # Kubernetes Service (ClusterIP, port 3000)
├── projects/               # ArgoCD Projects demo (multi-team isolation + RBAC)
│   ├── team-frontend/      # AppProject + Application for frontend team
│   ├── team-backend/       # AppProject + Application for backend team
│   ├── rbac/               # ArgoCD RBAC ConfigMap
│   └── README.md           # Full Projects guide & CLI reference
├── sync-waves/             # Sync Waves & Hooks demo
│   ├── 00-namespace.yaml   # Wave -1
│   ├── 01-configmap.yaml   # Wave  0
│   ├── 02-deployment.yaml  # Wave  1
│   ├── 03-service.yaml     # Wave  1
│   ├── 04-post-sync-job.yaml  # Wave 2 + PostSync hook
│   └── README.md           # Guide & video flow
├── argocd-app.yaml         # Declarative ArgoCD Application CRD (Demo App)
├── argocd-sync-app.yaml    # Declarative ArgoCD Application CRD (Sync Waves Demo)
├── kind-cluster.yaml       # KinD cluster config (1 control + 1 worker)
├── argocd-setup.md         # Prerequisites install guide
├── argocd-install.sh       # One-shot setup script (cluster → ArgoCD → CLI → cluster add)
└── README.md
```

---

## 🛠️ Setup & Installation

**Step 1 — Install prerequisites** → [prerequiste_install.md](prerequiste_install.md)  
**Step 2 — Run the one-shot script** → [argocd-install.sh](argocd-install.sh)

```bash
# On your EC2 instance, after installing prerequisites:
git clone https://github.com/Amitabh-DevOps/ArgoCD.git
cd ArgoCD
chmod +x argocd-install.sh
./argocd-install.sh
```

The script automates:

| Step | Action |
|------|--------|
| 1 | Generate `kind-config.yaml` with EC2 private IP & API server port |
| 2 | Create KinD cluster (1 control-plane + 2 workers) |
| 3 | Prompt: choose **Helm** or **Manifest** install method |
| 4 | Install ArgoCD in the `argocd` namespace |
| 5 | Install the ArgoCD CLI (if not already present) |
| 6 | Wait for `argocd-server` deployment to be Available |
| 7 | Fetch & print initial admin password + access instructions |

> ⚠️ Edit `CLUSTER_NAME` and the `apiServerAddress` (EC2 private IP) at the top of the script before running.

---

## ➕ Add Cluster to ArgoCD

After the script runs, login to the CLI and register your KinD cluster with ArgoCD:

**1. Login to ArgoCD CLI**
```bash
argocd login <EC2_PUBLIC_IP>:8080 \
  --username admin \
  --password <password_from_script> \
  --insecure
```

**2. Check available kubeconfig contexts**
```bash
kubectl config get-contexts
```

**3. Add the cluster to ArgoCD**
```bash
argocd cluster add kind-argocd-cluster \
  --name argocd-cluster \
  --insecure
```
> Replace `kind-argocd-cluster` with the actual context name shown in the previous command.

**4. Verify the cluster is registered**
```bash
argocd cluster list
```

Expected output:
```
SERVER                          NAME             VERSION  STATUS
https://kubernetes.default.svc  in-cluster       v1.35    Successful
https://<kind-ip>:33893         argocd-cluster   v1.35    Successful
```

---

## 🚀 Deploy App via ArgoCD

### Option A — ArgoCD CLI

```bash
argocd app create argocd-demo \
  --repo https://github.com/Amitabh-DevOps/ArgoCD.git \
  --path app/k8s \
  --dest-server https://kubernetes.default.svc \
  --dest-namespace default \
  --sync-policy automated \
  --auto-prune \
  --self-heal
```

Verify and sync:
```bash
argocd app list
argocd app get argocd-demo
argocd app sync argocd-demo   # only needed if not using auto-sync
```

---

### Option B — Declarative (GitOps way) ✅

Apply the `Application` CRD manifest directly to the cluster:

```bash
kubectl apply -f argocd-app.yaml
```

ArgoCD will immediately pick it up and start syncing. Check status:
```bash
argocd app get argocd-demo
kubectl get pods -n default
kubectl get svc -n default
```

> 💡 The declarative approach is the **GitOps-native** way — the Application itself is stored in Git and applied once. From that point, every push to the `app/` path auto-syncs to the cluster.


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
