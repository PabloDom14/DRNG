# Deep Rock Galactic Randomizer (DRNG)

A web app that randomly generates class loadouts for Deep Rock Galactic co-op sessions.

## Tech Stack
- React + Vite
- Tailwind CSS
- Static JSON data (no backend)

## Current Phase: MVP (Phase 1)

### MVP Features
- Player count input (1-4)
- "Allow duplicate classes" toggle
- "Generate Run" button
- Per-player output: Class, Primary, Secondary, Grenade, Traversal Tool
- Click any slot to reroll just that item
- Mobile-responsive (works on phones for on-the-couch use)

### Future Phases
- **Phase 2**: Build archetypes (Crowd Control, DPS, etc.) with static weapon matching
- **Phase 3**: Challenge modifiers ("No resupply unless team agrees", etc.)
- **Phase 4**: Team feedback (Swarm Clear: High, Single Target: Medium, etc.)
- **Phase 5**: Overclock mode (Balanced / Meta / Unhinged)

## Project Structure
```
/src
  /data
    classes.json       # All DRG class/weapon/grenade data
  /components
    App.jsx
    PlayerInput.jsx
    GenerateButton.jsx
    ResultsDisplay.jsx
    PlayerCard.jsx
  /utils
    randomizer.js      # generateRun() and rerollSlot() functions
```

## Design Guidelines
- Dark theme matching DRG aesthetic
- Large, readable text for Discord screen sharing
- Fun energy, not sterile

## Game Data Notes
- 4 classes: Scout, Gunner, Engineer, Driller
- Each class has 3 primary weapons, 3 secondary weapons, 3 grenades
- Traversal tools are fixed per class (not randomized):
  - Scout: Grappling Hook
  - Gunner: Zipline Launcher
  - Engineer: Platform Gun
  - Driller: Reinforced Power Drills

## Commands
```bash
npm run dev    # Start dev server
npm run build  # Build for production
```
