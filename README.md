# Wake Early

**Drink right. Sleep tight. Wake early.**

Wake Early treats waking up early as a whole process, not just an alarm. It connects the chain in one place, from caffeine to bedtime to wake-up, and celebrates completion instead of streaks.

Built for Devpost Learn's *Build With AI: Basics* hackathon as a proof of concept.

## What it does

- **Onboarding:** set your wake time, choose cold turkey or phased (the alarm moves 15 minutes earlier each day), read a caffeine explainer, pick your vessel, set your bedtime, and choose your maze difficulty.
- **Coffee:** search common drinks (Tim Hortons, Starbucks, espresso, energy drinks…) and watch them pour into your mug, travel mug, mason jar, or paper cup. A white line shows the caffeine in your system now. A red dotted line shows the most you can have right now and still be clear by bedtime, and it drops as the day goes on. A graph shows caffeine fading until bedtime.
- **Alarm:** when it rings, you guide a walker through a maze to the sun to turn it off, followed by a sunrise.
- **Morning check-in:** two taps confirm yesterday's caffeine and bedtime.
- **Home:** three nested rings (wake-up, caffeine, bedtime), a ☕ → 🛏 → ☀️ path, a goal ladder of on-time wake-ups (1 → 2 → 4 → 7 → 30) that never resets, and week-over-week progress.
- **Sleep:** a "Going to bed" button and bars showing each night against your target window.

## Run it

```bash
cd app
npm install
npm run dev
```

Open the printed URL (usually http://localhost:5173). It's designed as a phone-sized screen, so use a narrow window or Chrome DevTools device mode.

## Notes

- React 18 + Vite, plain CSS and SVG. No server, accounts, or API keys. Your data stays in your browser's localStorage.
- Past days' history is **sample data** for the demo. The **"Ring alarm now"** button and the **demo clock** on the Coffee screen exist so the demo can be shown in a minute.
- Caffeine math uses approximate general values: a 5-hour half-life and about 50 mg at bedtime. Drink caffeine amounts are approximate. **Not medical advice.**
- Planning docs (scope, PRD, spec, build checklist) are in [`devpost/`](devpost/).
