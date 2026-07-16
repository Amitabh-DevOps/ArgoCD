# 📂 ArgoCD Projects — Multi-Team Isolation & RBAC

---

## What are ArgoCD Projects?

Projects provide a **logical grouping of applications**, which is useful when ArgoCD is used by multiple teams. They act like namespaces for apps inside ArgoCD.

### Projects provide the following features:

- 🔒 **Restrict what may be deployed** — trusted Git source repositories only
- 🎯 **Restrict where apps may be deployed** — specific destination clusters and namespaces
- 🧱 **Restrict what kinds of objects** may or may not be deployed (e.g. RBAC, CRDs, DaemonSets, NetworkPolicy etc.)
- 👥 **Define project roles** to provide application RBAC (bound to OIDC groups and/or JWT tokens)
- 🕐 **Control sync windows** — define when apps can or can't sync

> ✅ **Projects = namespaces for apps in ArgoCD.**  
> ❌ **Without Projects, all apps share the same global permissions.**

This is essential in **multi-team or enterprise setups**.

---

## The Default Project

Every application belongs to a single project. If unspecified, an application belongs to the **`default` project**, which is created automatically and by default:

- ✅ Permits deployments from **any** source repo
- ✅ Permits deployments to **any** cluster
- ✅ Allows **all** resource kinds

The `default` project can be **modified but not deleted**.

> 💡 It is useful for initial testing, but it is recommended to create **dedicated projects** with explicit source, destination, and resource permissions.

---

## Project Roles

Projects include a feature called **roles** that determines who can do what to the applications in that project.

**Use cases:**
- Give a CI pipeline a restricted set of permissions (e.g. sync only — no source/destination changes)
- Give developers read-only access while admins get full control

**Key points:**
- Projects can have **multiple roles**
- Each role has **policies** (same RBAC pattern as ArgoCD global config)
- Policies are stored as a list of **policy strings** within the role
- A role's policy can **only grant access to that role**
- Users are associated with roles via the **`groups`** list (mapped from SSO/OIDC)

---

## Prerequisites

- ☸️ KinD cluster running
- 🚀 ArgoCD instance up and running
- 🔧 `kubectl` and `argocd` CLI configured to interact with your ArgoCD instance

---

## 📁 Demo Structure

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

## 🎯 What this demo shows

| Concept | What it demonstrates |
|---|---|
| **AppProject** | Scopes a team to specific repos & destination namespaces |
| **Source restriction** | Team can only deploy from their own repo |
| **Destination restriction** | Team can only deploy into their own namespace |
| **Resource allow list** | Only permitted Kubernetes resource kinds can be deployed |
| **RBAC roles** | `frontend-admin` can only manage frontend apps |
| **Application → Project binding** | Apps are bound to a project and can't escape its rules |

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

## 🔐 Demo: Test Isolation

Try to create an app that **violates project rules** — ArgoCD will reject it:

```bash
# ❌ This will FAIL — 'backend' namespace not allowed in team-frontend project
argocd app create bad-app \
  --project team-frontend \
  --repo https://github.com/Amitabh-DevOps/ArgoCD.git \
  --path app/k8s \
  --dest-server https://kubernetes.default.svc \
  --dest-namespace backend
```

Expected error:
```
FATA[0001] application spec for bad-app is invalid:
  InvalidSpecError: application destination {https://kubernetes.default.svc backend}
  is not permitted in project 'team-frontend'
```

---

## 🖥️ Useful CLI Commands

```bash
# List all projects
argocd proj list

# Get project details (sources, destinations, roles)
argocd proj get team-frontend

# Add an allowed source repo to a project
argocd proj add-source team-frontend https://github.com/org/another-repo.git

# Add an allowed destination namespace
argocd proj add-destination team-frontend https://kubernetes.default.svc staging

# List project roles
argocd proj role list team-frontend

# Get role details and policies
argocd proj role get team-frontend frontend-admin
```

---

## 🧹 Cleanup — Delete Project Resources

> ⚠️ **Order matters** — always delete `Applications` before `AppProjects`.  
> If you delete the project first, ArgoCD will error: *"application still belongs to project"*.

### Option 1 — ArgoCD CLI

```bash
# 1. Delete Applications first
argocd app delete frontend-app --yes
argocd app delete backend-app --yes

# 2. Then delete the AppProjects
argocd proj delete team-frontend
argocd proj delete team-backend
```

### Option 2 — kubectl

```bash
# 1. Delete Applications
kubectl delete -f projects/team-frontend/application.yaml
kubectl delete -f projects/team-backend/application.yaml

# 2. Delete AppProjects
kubectl delete -f projects/team-frontend/appproject.yaml
kubectl delete -f projects/team-backend/appproject.yaml

# 3. Delete RBAC config (optional)
kubectl delete -f projects/rbac/argocd-rbac-cm.yaml
```

### Option 3 — Delete namespaces (full cleanup)

```bash
# Removes all deployed workloads inside the namespaces too
kubectl delete namespace frontend
kubectl delete namespace backend
```

> 💡 If `prune: true` is set in the Application's syncPolicy, deleting the Application will **automatically remove** the Deployment and Service from the cluster.
