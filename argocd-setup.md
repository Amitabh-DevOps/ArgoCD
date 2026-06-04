# 🛠️ ArgoCD Setup & Installation Guide

> **Goal:** Get a local Kubernetes cluster running with ArgoCD installed and accessible — step by step.

---

## Step 1 — Prerequisites

Install the following tools before starting.

### 🐳 Docker Desktop

```bash
sudo apt-get update
sudo apt install docker.io -y
sudo usermod -aG docker $USER && newgrp docker
docker --version

docker ps
```

---

### ☸️ kubectl

```bash
# Linux / WSL
curl -LO "https://dl.k8s.io/release/$(curl -sL https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# macOS
brew install kubectl

# Windows (via winget)
winget install Kubernetes.kubectl
```

Verify:
```bash
kubectl version --client
```

---

### 🏗️ kind (Kubernetes IN Docker)

```bash
# Linux / WSL
curl -Lo ./kind https://kind.sigs.k8s.io/dl/latest/kind-linux-amd64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind

# macOS
brew install kind

# Windows (via winget)
winget install Kubernetes.kind
```

Verify:
```bash
kind version
```

---

## Step 2 — Create the KinD Cluster

```bash
# Clone the repo (if not already)
git clone https://github.com/Amitabh-DevOps/ArgoCD.git
cd ArgoCD

# Create the cluster using the provided config
kind create cluster --name argocd-demo --config kind-cluster.yaml
```

Expected output:
```
✓ Ensuring node image (kindest/node:v1.35.0) 🖼
✓ Preparing nodes 📦 📦
✓ Writing configuration 📜
✓ Starting control-plane 🕹️
✓ Installing CNI 🔌
✓ Installing StorageClass 💾
✓ Joining worker nodes 🚜
Set kubectl context to "kind-argocd-demo"
```

Verify nodes are ready:
```bash
kubectl get nodes
```
```
NAME                        STATUS   ROLES           AGE   VERSION
argocd-demo-control-plane   Ready    control-plane   1m    v1.35.0
argocd-demo-worker          Ready    <none>          1m    v1.35.0
```

---

## Step 3 — Install ArgoCD

```bash
# Create the argocd namespace
kubectl create namespace argocd

# Install ArgoCD (stable release)
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Wait for all pods to be Running
kubectl wait --for=condition=Ready pod --all -n argocd --timeout=120s
```

Verify all pods are up:
```bash
kubectl get pods -n argocd
```

### Access the ArgoCD UI

Port-forward the ArgoCD server to your local machine:
```bash
kubectl port-forward svc/argocd-server -n argocd 8080:443 --address=0.0.0.0 &
```

Open your browser and navigate to:
```
https://<EC2_PUBLIC_IP>:8080
```
> ⚠️ Accept the self-signed certificate warning in your browser.  
> Make sure port **8080** is open in your EC2 Security Group inbound rules.

### Get the Initial Admin Password

```bash
kubectl get secret argocd-initial-admin-secret \
  -n argocd \
  -o jsonpath="{.data.password}" | base64 --decode && echo
```

Login with:
- **Username:** `admin`
- **Password:** *(output from above command)*

> 💡 **Change your password** after first login:  
> Go to **User Info → Update Password** in the ArgoCD UI.

---

## Step 4 — Install ArgoCD CLI & Login

The ArgoCD server runs inside Kubernetes, but to interact with it from the terminal you need the **ArgoCD CLI** (`argocd`). This is separate from the server installation.

### Install ArgoCD CLI

```bash
# Linux / WSL
curl -sSL -o argocd-linux-amd64 \
  https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64
sudo install -m 555 argocd-linux-amd64 /usr/local/bin/argocd
rm argocd-linux-amd64

# macOS
brew install argocd

# Windows (via winget)
winget install Argo.ArgoCD
```

Verify installation:
```bash
argocd version --client
```

### Login to ArgoCD CLI

> Make sure the port-forward from Step 3 is still running and port **8080** is open in your EC2 Security Group.

```bash
argocd login <EC2_PUBLIC_IP>:8080 \
  --username admin \
  --password <initial_password> \
  --insecure
```

> 📝 `--insecure` is required when using port-forward with self-signed TLS certs.  
> For production, configure proper TLS (then `--insecure` is not needed).

Get current user info:
```bash
argocd account get-user-info
```

---

## Step 5 — Add Your Cluster to ArgoCD

By default ArgoCD manages the cluster it is installed in. To explicitly register it (or add additional clusters):

### Check your kubeconfig contexts
```bash
kubectl config get-contexts
```

Identify your cluster context name, e.g., `kind-argocd-demo`.

### Add the cluster to ArgoCD
```bash
argocd cluster add kind-argocd-demo \
  --name argocd-cluster \
  --insecure
```

### Verify the cluster was added
```bash
argocd cluster list
```

Expected output:
```
SERVER                          NAME             VERSION  STATUS      MESSAGE
https://kubernetes.default.svc  in-cluster       v1.35    Successful
https://<kind-ip>:6443          argocd-cluster   v1.35    Successful
```

---

## ✅ Setup Complete

Your environment is ready. You now have:
- ✔ A local 2-node KinD Kubernetes cluster
- ✔ ArgoCD running in the `argocd` namespace
- ✔ ArgoCD UI accessible at `https://<EC2_PUBLIC_IP>:8080`
- ✔ ArgoCD CLI authenticated
- ✔ Your cluster registered in ArgoCD

➡️ **Next:** Deploy your first application → [First App Deployment](README.md)
