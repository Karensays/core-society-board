# CLAUDE.md — core-society-board

> Fichier lu automatiquement par Claude Code à chaque session.
> Ne pas supprimer. Mettre à jour après chaque session de travail.

---

## 1. Contexte du projet

**Projet :** Core Society Board — tableau de bord de pilotage interne  
**URL cible :** board.coresociety.fr  
**Repo GitHub :** core-society-board  
**Stack :** Next.js 14+ App Router · TypeScript · Tailwind CSS · Supabase · Vercel  
**Propriétaire :** Karen Auffret Barry — fondatrice de Core Society (studio Fitness Reformer, Bois-Colombes)

Ce Board est une app interne privée. Une seule utilisatrice. Pas de multi-tenant, pas de rôles.

---

## 2. Brand & design — règles non négociables

### Couleurs
```
Blue principal   #1C42BD
Blue bg light    #EFF4FF
Blue mid (bars)  #C5D2F7
Noir texte       #1A1A1A
Fond page        #F5F5F3
Fond blanc       #FFFFFF
Border           #E8E8E4
Border fort      #E0E0DC
Texte muted      #BBB / #888
Vert succès      #16A34A
Amber warning    #D97706
Rouge urgent     #DC2626
```

### Typographie
- **Police unique : Poppins** (Google Fonts) — 300, 400, 500, 600, 700, 800, italic
- **Zéro Space Mono** dans ce projet — toute la hiérarchie se fait par le poids Poppins
- Hiérarchie :
  - Valeur KPI principale : 28px / 700
  - Valeur KPI secondaire : 22px / 700
  - Greeting : 22px — "Bonjour," en 700 #1a1a1a + "Karen." en 300 #aaa
  - Label section : 9px / 600 / uppercase / letter-spacing 0.12em / #bbb
  - Texte tâche : 11px / 500
  - Tag statut : 9px / 600
  - Métadonnée : 9px / 400

### Design
- `border-radius: 8px` sur les cartes, `6px` sur les agents, `4px` sur les badges
- Aucun gradient, aucun shadow décoratif (border suffit)
- Fond page `#F5F5F3` (gris très doux, pas blanc pur)
- Top bar toujours `#1C42BD` pleine largeur

---

## 3. Architecture de la page (Option A — scroll continu)

```
┌─────────────────────────────────────────────────────┐
│  TOP BAR  #1C42BD  36px                             │
├─────────────────────────────────────────────────────┤
│  GREETING BAND  fond blanc  bordure bottom           │
├──────────────────────────────────┬──────────────────┤
│  MAIN COLUMN  flex:1  pad 16px   │  ASIDE  210px    │
│                                  │  sticky top       │
│  [KPI HERO — 4 colonnes]         │  fond blanc       │
│  [KPI SECONDAIRE — 4 colonnes]   │  border-left      │
│  [MINI BAR CHART]                │                   │
│  [TODO SECTION]                  │  · Équipe IA      │
│                                  │  · Alertes        │
│                                  │  · Santé outils   │
│                                  │  · Accès rapide   │
└──────────────────────────────────┴──────────────────┘
```

---

## 4. Base de données Supabase

### Table : `board_todos`
```sql
create table board_todos (
  id          uuid primary key default gen_random_uuid(),
  text        text not null,
  status      text not null default 'todo',
  due_date    date,
  position    integer default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
-- Statuts valides : 'todo' | 'inprogress' | 'urgent' | 'done'
```

### RLS (Row Level Security)
- Activer RLS sur `board_todos`
- Politique : accès complet avec la clé anon (app privée, pas d'accès public)

---

## 5. Variables d'environnement

```bash
# .env.local (jamais committé)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
BOARD_PASSWORD=...           # mot de passe de login
BOARD_SESSION_SECRET=...     # secret pour signer le cookie (32+ chars random)
```

**Sur Vercel :** définir ces 4 variables dans Settings → Environment Variables.

---

## 6. Auth — middleware cookie

- Pas de Supabase Auth en V1
- `src/middleware.ts` : vérifie un cookie `board_session` signé
- Si absent → redirect vers `/login`
- Page `/login` : input mot de passe → compare à `BOARD_PASSWORD` → pose cookie → redirect `/`
- Cookie : httpOnly, sameSite strict, maxAge 7 jours

---

## 7. Données KPIs — statiques V1

```typescript
// src/data/kpis.ts
export const KPI_DATA = {
  month: "juin 2025",
  ca: { value: 8240, trend: "+12%", target: 9000 },
  seances: { value: 94, trend: "+5", max: 140 },
  remplissage: { value: 68, target: 75 },
  note: { value: 5.0, avis: 500 },
  breakdown: {
    bsport: { value: 5680, detail: "Abonnements + séances" },
    classpass: { value: 1340, detail: "28 réservations" },
    egym: { value: 720, detail: "12 réservations" },
    decouvertes: { value: 18, detail: "6 → abonnées" },
  },
  weekActivity: [
    { day: "Lun", value: 12, state: "past" },
    { day: "Mar", value: 16, state: "past" },
    { day: "Mer", value: 14, state: "past" },
    { day: "Jeu", value: 10, state: "past" },
    { day: "Ven", value: 18, state: "today" },
    { day: "Sam", value: 0,  state: "future" },
    { day: "Dim", value: 0,  state: "future" },
  ],
  nextCours: { time: "09:00", places: 3 },
};
```

---

## 8. Agents IA — données statiques

```typescript
export const AGENTS = [
  { code: "CEO", name: "Stratège",      role: "Vision · Priorités",    status: "online"   },
  { code: "COO", name: "Opérateur",     role: "Planning · Ops",        status: "online"   },
  { code: "CFO", name: "Financier",     role: "Tréso · BRED",          status: "warning"  },
  { code: "CoS", name: "Chief of Staff",role: "Coordination",          status: "online"   },
  { code: "PA",  name: "Assistante",    role: "Agenda · Relances",     status: "online"   },
];
```

---

## 9. Outils monitorés — statiques V1

```typescript
export const TOOLS = [
  { name: "Bsport",              status: "online"  },
  { name: "ClassPass",           status: "online"  },
  { name: "Egym Wellpass",       status: "online"  },
  { name: "Dashboard finances",  status: "warning" },
  { name: "MMA platform",        status: "online"  },
  { name: "Instagram",           status: "online"  },
  { name: "Swello",              status: "online"  },
];
```

---

## 10. Composants à implémenter

| Composant | Fichier | Données |
|-----------|---------|---------|
| TopBar | `components/TopBar.tsx` | Date JS dynamique |
| Greeting | `components/Greeting.tsx` | Date JS dynamique |
| KPISection | `components/KPISection.tsx` | `kpis.ts` |
| KPICard | `components/KPICard.tsx` | props |
| MiniBarChart | `components/MiniBarChart.tsx` | `kpis.ts weekActivity` |
| TodoSection | `components/TodoSection.tsx` | Supabase `board_todos` |
| TodoItem | `components/TodoItem.tsx` | props + callbacks |
| Aside | `components/Aside/index.tsx` | sous-composants |
| AgentRow | `components/Aside/AgentRow.tsx` | `agents.ts` |
| AlertCard | `components/Aside/AlertCard.tsx` | statique V1 |
| ToolRow | `components/Aside/ToolRow.tsx` | `tools.ts` |

---

## 11. Protocole de travail avec Claude Code

### Avant chaque session
```bash
git remote -v   # vérifier que c'est bien core-society-board
git fetch origin
git status
```

### Avant chaque push
```bash
npm run build   # doit passer sans erreur
git push origin main
```

### Ordre d'implémentation
1. Scaffold + layout + TopBar + Greeting + auth (login/middleware)
2. KPISection + KPICard + MiniBarChart
3. TodoSection + TodoItem + Supabase CRUD
4. Aside complet (agents, alertes, outils, accès rapide)
5. Polish + responsive + déploiement Vercel + DNS board.coresociety.fr

---

## 12. Projets connexes (ne pas confondre les repos)

| Projet | Repo | Domaine |
|--------|------|---------|
| Site principal | core-society-website | coresociety.fr |
| MMA platform | naiom-platform | core-society-mma.vercel.app |
| Dashboard finances | core-society-dashboard-finance | compta.coresociety.fr |
| **Board (ce projet)** | **core-society-board** | **board.coresociety.fr** |

---

## 13. À faire en V2 (hors scope V1)

- Brancher API Bsport pour KPIs en temps réel
- Supabase Auth avec magic link email
- Graphiques courbes CA (recharts ou D3)
- Navigation multi-vues par onglets
- Notifications alertes (email ou push)
- Intégration Instagram analytics

---

*Dernière mise à jour : juin 2025 — Karen + Claude (Anthropic)*
