# ArgoCD Projects — Multi-Team Isolation & RBAC

## 📁 Structure

```
projects/
├── team-frontend/
│   ├── appproject.yaml          # AppProject for frontend team
│   └── application.yaml         # App assigned to frontend project
├── team-backend/
│   ├── appproject.yaml          # AppProject for backend team
│   └── application.yaml         # App assigned to backend project
└── rbac/
    └── argocd-rbac-cm.yaml      # RBAC roles & bindings for each team
```

---

## 🎯 What we demo

| Concept | What it shows |
|---|---|
| **AppProject** | Scopes a team to specific repos & destination namespaces |
| **Source restriction** | Team can only deploy from their own repo |
| **Destination restriction** | Team can only deploy into their own namespace |
| **RBAC roles** | `frontend-admin` can only manage frontend apps |
| **Application → Project** | Apps are bound to a project — can't escape its rules |

---

## 🚀 Apply everything

```bash
# 1. Create the AppProjects first
kubectl apply -f projects/team-frontend/appproject.yaml
kubectl apply -f projects/team-backend/appproject.yaml

# 2. Create the Applications (assigned to their projects)
kubectl apply -f projects/team-frontend/application.yaml
kubectl apply -f projects/team-backend/application.yaml

# 3. Apply RBAC
kubectl apply -f projects/rbac/argocd-rbac-cm.yaml
```

Verify:
```bash
argocd proj list
argocd proj get team-frontend
argocd proj get team-backend
argocd app list
```

---

## 🔐 Test Isolation

Try to create an app in the wrong project — ArgoCD will reject it:

```bash
# This will FAIL — repo not allowed in team-backend project
argocd app create bad-app \
  --project team-backend \
  --repo https://github.com/Amitabh-DevOps/ArgoCD.git \
  --path app \
  --dest-server https://kubernetes.default.svc \
  --dest-namespace frontend   # wrong namespace for backend team
```
