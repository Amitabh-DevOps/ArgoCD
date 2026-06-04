# 🛠️ Prerequisites — ArgoCD Setup

> Install all required tools on your **EC2 Ubuntu instance** before running the setup script.

---

## 1 — Docker

```bash
sudo apt-get update
sudo apt install docker.io -y
sudo usermod -aG docker $USER && newgrp docker
```

Verify:
```bash
docker --version
docker ps
```

---

## 2 — kubectl

```bash
curl -LO "https://dl.k8s.io/release/$(curl -sL https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
rm kubectl
```

Verify:
```bash
kubectl version --client
```

---

## 3 — kind (Kubernetes IN Docker)

```bash
curl -Lo ./kind https://kind.sigs.k8s.io/dl/latest/kind-linux-amd64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind
```

Verify:
```bash
kind version
```

---

## 4 — Helm

```bash
curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
chmod 700 get_helm.sh
./get_helm.sh
```

Verify:
```bash
helm version
```

---

## ✅ All Set

Once all four tools are installed, run the setup script from the repo root:

```bash
git clone https://github.com/Amitabh-DevOps/ArgoCD.git
cd ArgoCD
chmod +x argocd-install.sh
./argocd-install.sh
```

> 📄 See [argocd-install.sh](argocd-install.sh) for what the script does.
