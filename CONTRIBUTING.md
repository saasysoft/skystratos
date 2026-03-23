# Contributing to Skyline

## Branch Strategy

- **`dev`** is the default branch. All work starts here.
- **`main`** is the production branch. Merges to main happen via PR only.
- Feature branches: `feature/description`, `fix/description`, `chore/description`

## Workflow

1. Create a branch from `dev`:
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feature/your-feature
   ```

2. Make your changes. Verify:
   ```bash
   npx tsc --noEmit    # Zero TypeScript errors
   npm run dev          # Dev server starts
   ```

3. Commit with conventional commits:
   ```
   feat: add new panel for X
   fix: correct CPFH calculation in cost panel
   chore: update dependencies
   ```

4. Push and open a PR against `dev`:
   ```bash
   git push origin feature/your-feature
   gh pr create --base dev
   ```

## Aviation Domain Notes

- Use correct aviation terminology (CPFH, MEL, AD, SB, AOG, MRO, ATA chapters)
- Mock data must be internally consistent (aircraft IDs match across all data files)
- Keep the HUD design system conventions (monospace fonts, dark theme, status colors)

## Project Structure

```
src/
  app/           # Next.js App Router pages + API routes
  components/
    auth/        # PIN Gate, Boot Sequence, Guided Tour
    hud/         # Design system primitives
    layout/      # App shell, navigation, status bar
    panels/      # 4 core dashboard panels
      aviation/  # 5 aviation-specific panels
      fleet/     # Fleet map component
    tower/       # Tower AI sidebar components
  lib/
    data/        # Data access layer (abstracts mock data)
    mock-data/   # All mock data + types
    tower/       # AI system prompt, tools, handlers
    i18n/        # Translations
```
