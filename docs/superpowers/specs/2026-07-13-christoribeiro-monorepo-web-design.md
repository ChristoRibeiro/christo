# Spec — Monorepo `christoribeiro` : CLI + site Next.js

- **Date** : 2026-07-13
- **Statut** : validé (design), en attente de review spec
- **Repo** : https://github.com/ChristoRibeiro/christoribeiro
- **Auteur** : Christophe Ribeiro

## 1. Contexte

Le repo est aujourd'hui un mono-package npm : un CLI Ink (`cli.js`) publié sur
npm sous deux noms (`christo` et `christoribeiro`) via **OIDC trusted publishing**
(workflow `.github/workflows/publish.yml`, déclenché au push sur `main`). Le
double nom est obtenu en mutant `package.json` (`name` + `bin`) à la volée.

Le domaine `christoribeiro.com` n'héberge qu'un placeholder jetable — **rien à
récupérer**, on repart de zéro pour la partie web.

## 2. Objectif

Réorganiser le repo en **monorepo pnpm workspaces** hébergeant deux applications
indépendantes :

1. le **CLI existant**, déplacé tel quel, sans régression de publication ;
2. un **site de personal branding** (Next.js), déployé sur **Vercel** et branché
   sur `christoribeiro.com`.

Le site v1 se limite à une **landing / à propos + liens**, mais l'architecture
doit accueillir sans rework des pages ultérieures (CV tech, compétences, projets).

## 3. Décisions

| Sujet | Décision | Raison |
|---|---|---|
| Gestionnaire | **pnpm** workspaces | Choix de Christophe. Isolation stricte des deps (React 18 CLI vs React 19 web sans conflit). |
| Version pnpm | `pnpm@10.33.3` (champ `packageManager`) | Version locale ; lue par Vercel/corepack pour épingler. |
| Stack web | **Next.js (App Router) + TypeScript + Tailwind**, statique-first (SSG) | Natif Vercel ; structure claire pour ajouter des pages. |
| Structure | `apps/cli` + `apps/web` | Racine neutre, deux apps de premier rang. |
| Lockfile | `pnpm-lock.yaml` **committé** | Fiabilité CI + Vercel. |
| Publication npm | Le step de publish reste **`npm publish`** (pas `pnpm publish`) | Préserve l'OIDC trusted publishing éprouvé (npm ≥ 11.5.1). pnpm ne gère que l'install/dev. |

## 4. Structure cible du repo

```
christoribeiro/
├─ package.json              # racine : "private": true, "packageManager": "pnpm@10.33.3", scripts
├─ pnpm-workspace.yaml       # packages: ["apps/*"]
├─ pnpm-lock.yaml            # committé
├─ .gitignore                # retire package-lock.json ; ignore node_modules, .next, etc.
├─ LICENSE                   # couvre tout le repo (inchangé)
├─ README.md                 # présentation repo → renvoie vers apps/cli et apps/web
├─ docs/superpowers/specs/   # cette spec
├─ .github/workflows/publish.yml   # MÊME CHEMIN (l'OIDC npm ne se reconfigure pas)
└─ apps/
   ├─ cli/
   │  ├─ cli.js              # inchangé (0 ligne modifiée)
   │  ├─ package.json        # name "christo", bin, files, deps cfonts/ink/open/react
   │  ├─ publish.sh          # déplacé
   │  ├─ README.md           # page npm (déplacée depuis la racine)
   │  └─ LICENSE             # copie, pour que npm l'inclue dans le tarball
   └─ web/                   # app Next.js (voir §6)
```

### `package.json` racine (glue)

```json
{
  "name": "christoribeiro-monorepo",
  "private": true,
  "packageManager": "pnpm@10.33.3",
  "scripts": {
    "dev": "pnpm --filter web dev",
    "build": "pnpm --filter web build",
    "cli": "pnpm --filter christo start"
  }
}
```

### `pnpm-workspace.yaml`

```yaml
packages:
  - "apps/*"
```

## 5. Migration du CLI (préserver la publication)

Contrainte forte : **ne pas casser l'OIDC trusted publishing**. La config du
trusted publisher sur npmjs est liée au repo **et au chemin du fichier workflow**
(`.github/workflows/publish.yml`). On garde donc ce chemin identique.

Changements :

1. **Déplacer** `cli.js`, `package.json`, `publish.sh`, `README.md` → `apps/cli/`.
   Copier `LICENSE` dans `apps/cli/` (npm n'inclut le LICENSE que depuis le
   dossier du package). `cli.js` n'est pas modifié.
2. **`publish.yml`** : les steps d'install et de publish s'exécutent dans
   `apps/cli` (`working-directory: apps/cli` ou `cd apps/cli`). Le fichier reste
   au même chemin.
   - Install : `pnpm install --frozen-lockfile` à la racine (workspaces).
   - S'assurer de npm ≥ 11.5.1 : `npm install -g npm@latest` (déjà présent).
   - Publish : `npm publish --access public` depuis `apps/cli` (logique double
     nom `christo` / `christoribeiro` inchangée, elle mute `apps/cli/package.json`).
3. **`publish.sh`** : mêmes commandes, exécuté désormais depuis `apps/cli`.
4. **`.gitignore`** : retirer `package-lock.json` ; committer `pnpm-lock.yaml` ;
   ajouter `apps/web/.next/`.

**Critère de non-régression** : un push sur `main` republie `christo` et
`christoribeiro` (ou skip si version inchangée) exactement comme avant.

## 6. Site — `apps/web` (Next.js)

### Stack
- Next.js App Router, TypeScript, Tailwind CSS, ESLint. Statique-first (SSG).
- React 19 côté web (isolé du React 18 du CLI par pnpm).
- Scripts standard : `dev`, `build`, `start`, `lint`.

### Contenu v1 — page `/` unique
- **Hero** : nom « Christophe Ribeiro » + accroche « Entrepreneur & Software Engineer ».
- **À propos** : pitch court (2-3 phrases).
- **Liens** : site, email, x, github, linkedin (mêmes cibles que le CLI).
- **Clin d'œil terminal** : mention discrète `npx christo`.

### Architecture d'évolution
- App Router : `/` en v1 ; emplacements prêts pour `/cv`, `/skills`, `/projects`
  (nouvelles routes + composants réutilisables), **sans rework** de l'existant.
- Composants découpés par responsabilité (Hero, Links, Section) pour être
  réutilisés par les futures pages.

### Cohérence de marque
Reprendre la palette « dusk / starry night » du CLI :
`star #eef2fb`, `sky #8b9dc9`, `muted #56678a`, `amber #f6b87a`,
`amberDim #c98a51`, `pink #c86b8e`. Fond dusk sombre, dégradé **amber→pink** sur
le nom, touche **monospace** pour rappeler le terminal. Exposées en tokens
Tailwind pour réutilisation.

## 7. Déploiement Vercel + domaine

- Projet Vercel, **Root Directory = `apps/web`**, framework Next.js auto-détecté.
- pnpm détecté via `pnpm-lock.yaml` ; version épinglée par `packageManager`.
  Install exécuté au niveau racine (workspaces) par Vercel.
- Vérifier un **preview deploy** avant de brancher le domaine.
- `christoribeiro.com` (+ `www`) rebranché sur ce projet Vercel — étape
  dashboard/DNS, hors code, documentée au moment de l'exécution.

## 8. Vérification

- **CLI** : `pnpm --filter christo start` (ou `node apps/cli/cli.js`) rend la
  carte ; `npm pack --dry-run` dans `apps/cli` liste `cli.js` (+ README/LICENSE).
- **Publish** : relecture de `publish.yml` (chemins, OIDC) ; le prochain push
  `main` republie sans erreur.
- **Web** : `pnpm --filter web dev` sert `/` ; `pnpm --filter web build` passe ;
  preview Vercel OK.

## 9. Hors périmètre v1

CV tech + export PDF, page compétences, vitrine projets, blog, analytics, i18n.
La structure les accueillera ultérieurement (chacun sa propre spec).

## 10. Points ouverts

Aucun bloquant. La version pnpm sera confirmée à l'implémentation (`pnpm -v`).
