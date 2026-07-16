# ⚡ Sync Waves & Hooks — Resource Ordering in ArgoCD

## What are Sync Waves?

By default, ArgoCD syncs **all resources at once**. Sync Waves let you control the **order** resources are created.

```
Wave -1  →  Wave 0  →  Wave 1  →  Wave 2
Namespace    Config      App        Verify
```

- Lower wave number = deployed **first**
- Next wave only starts after previous wave resources are **Healthy**
- Annotation: `argocd.argoproj.io/sync-wave: "<number>"`

## What are Hooks?

Hooks are one-time Jobs that run at specific points in the sync lifecycle:

| Hook | When it runs |
|---|---|
| `PreSync` | **Before** any resources are applied |
| `Sync` | **During** sync (same time as resources) |
| `PostSync` | **After** all resources are Healthy |
| `SyncFail` | Only if the sync **fails** |

Annotation: `argocd.argoproj.io/hook: PreSync`

---

## 📁 Demo Structure

```
sync-waves/
├── 00-namespace.yaml     # Wave -1 — create namespace first
├── 01-configmap.yaml     # Wave  0 — app config
├── 02-deployment.yaml    # Wave  1 — app deployment
├── 03-service.yaml       # Wave  1 — app service
├── 04-post-sync-job.yaml # Wave  2 + PostSync hook — verify after deploy
└── argocd-app.yaml       # ArgoCD Application pointing to this directory
```

---

## 🚀 Apply

```bash
kubectl apply -f sync-waves/argocd-app.yaml
```

Watch resources come up in order:
```bash
argocd app get argocd-sync-demo --watch
```

---

## 🎬 What to observe

1. **Wave -1**: Namespace `wave-demo` appears first
2. **Wave 0**: ConfigMap appears next
3. **Wave 1**: Deployment + Service appear together
4. **Wave 2 / PostSync**: Verification Job runs last — only after Deployment is Healthy

---

## 🧹 Cleanup

```bash
argocd app delete argocd-sync-demo --yes
kubectl delete namespace wave-demo
```
