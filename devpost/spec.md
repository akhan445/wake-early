---
doc: spec
status: approved
---

# Wake Early — Technical Spec

## How This Works, In Plain Language
Wake Early is a **web app that runs in your browser**, laid out like a phone screen. It's built with **React** (which you know) and started with **Vite**, a tool that creates and runs a React project in seconds.

There is **no server and no database**. Everything happens in the browser:
- **Screens** are React components: Home, Coffee, Sleep, and the Alarm → Maze sequence, with a bottom nav bar to switch tabs.
- **Data** comes from two places: a hand-written list of common drinks (a JavaScript file in the project), and a **sample week** of caffeine, bedtime, and wake-up data so the demo has history. Drinks you log today are saved in **localStorage**, a sticky note the browser keeps for one site, so they survive a page refresh.
- **The caffeine math** is a small function file: given what you drank and when, it works out how much is in your system now, where the red line is, and the curve to bedtime.

Why this shape: with under an hour to submit, one process with no accounts, server, or install steps is the fastest way to prove the kernel: the caffeine → bedtime → wake-up chain and the completion feel.

## The Core Journey Through the System
PRD ref: `prd.md > The Core Journey` (trimmed to the build order below).

1. **Open the app** → `App.jsx` loads, reads today's drinks from localStorage and the sample week from `sampleWeek.js` → Home shows rings, path bar, ladder, and week columns.
2. **Coffee tab → search "Tim Hortons"** → `Coffee.jsx` filters `drinks.js` → you tap a drink → it's added to today's drinks (saved to localStorage) → the `Vessel` pour animation plays → `caffeine.js` recalculates the mg in your system and the red line → the cup level, the line, and the graph update. A timer re-renders every minute so the cup drains and the line drops.
3. **Tap "Ring alarm now"** → the Alarm screen shows the shaking clock → `Maze.jsx` generates a maze for the chosen difficulty → you reach the bottom-right → today's wake-up is marked on time → back to Home → rings fill and sparkle, and the ladder advances.
4. **Sleep tab** → `Sleep.jsx` draws one bar per night from the sample week, with dashed lines at 11 pm and 6 am.

## Stack
- **React 18 + Vite** (JavaScript, no TypeScript, for speed). Docs: https://react.dev, https://vite.dev/guide/. Learner choice: React over Flutter — Flutter isn't installed and setup would eat the deadline; tradeoff accepted: Flutter is saved for a later rebuild.
- **Plain CSS** in one file, with CSS animations for the pour, sparkle, and shake. No UI library.
- **SVG** for the rings, cup, graph, and sleep bars (drawn by hand, no chart library).
- Node v24 / npm 11 are installed (verified).

## Where It Runs and How Someone Tries It
- Runs locally in a browser. No API keys.
- Start: `cd app && npm install && npm run dev`, then open the printed URL (usually http://localhost:5173).
- **For the demo recording:** open Chrome DevTools device mode (an iPhone size) or a narrow window, and record: Coffee (search, pour, line) → Ring alarm now → maze → Home sparkle → Sleep bars.
- Submission needs a **short demo video** and a **public GitHub repo**. Deployment is optional and not planned.

## Look and Feel
From `prd.md > Look and Feel`:
- Section colors: **wake/alarm = sunrise orange** (`#F2953A`), **caffeine = latte brown** (`#A8724A`) on a cream background, **sleep = night indigo** (`#5B5FC7`) on deep navy. Each tab's background uses a soft gradient in its color instead of the animated scenes (deferred).
- Rounded, friendly sans-serif (system font), big numbers, lots of space. Simple, playful, never generic dashboard-gray.
- Motion: pour stream into the cup, liquid level easing, sparkle burst when the rings close, shaking alarm clock.
- **No faces** anywhere. Emoji limited to ☕ 🛏 ☀️ ⏰.
- Copy is encouraging, never shaming.

## Components

### App shell and nav
`App.jsx` holds the current tab and the shared data (today's drinks, today's wake-up result), and renders the bottom nav: Home · Alarm · Coffee · Sleep.
PRD ref: `prd.md > Screens and Layout`.

### Home
Nested rings (wake outer, caffeine, bedtime), path bar ☕ → 🛏 → ☀️, goal ladder (1 → 2 → 4 → 7 → 30 on-time wake-ups), "this week" counts, and last-week vs. this-week columns. Sparkle plays when the wake-up ring closes.
PRD ref: `prd.md > Rings, ladder, and completion`.

### Coffee
Search box over `drinks.js`, results list, custom mg entry fallback, the `Vessel`, "You can have about X mg more," and the fade-to-bedtime graph.
PRD ref: `prd.md > Caffeine logging and the cup`.

#### Vessel
SVG mug. On a new drink, a pour stream animates from above, then the watery-brown liquid rises.
- **Liquid surface:** a solid white line where the coffee meets the top, labeled with the current amount beside it (e.g. "150 mg").
- **Max line:** a **red dotted line** at the allowed mg right now, labeled (e.g. "250 mg max now"). It lowers through the day.
- Under the mug: "You can have about 100 mg more."
- Liquid above the max line turns a warning tint.

#### Caffeine math (`caffeine.js`)
- `mgNow(drinks, now)` = sum of `mg × 0.5^(hoursSince / HALF_LIFE)`.
- `limitNow(now, bedtime)` = `SLEEP_OK_MG × 2^(hoursUntilBed / HALF_LIFE)` — the most you can have in your system now and still decay to `SLEEP_OK_MG` by bedtime.
- `curve(drinks, now, bedtime)` = points every 30 min for the graph.
- `HALF_LIFE = 5` hours and `SLEEP_OK_MG = 50` — **approximate general values, not medical advice**; shown as such in the UI.

### Alarm and Maze
Alarm tab: next alarm 6:00 am, maze difficulty picker (easy 6×6, medium 10×10, hard 14×14), and a **"Ring alarm now"** button for the demo. Ringing screen: shaking clock, then the maze. Maze uses a randomized depth-first search generator; the user **drags a finger (or mouse) through the maze** from top-left to bottom-right; moves only follow open paths. The path walked is drawn as a **dotted line**, and the user's position is a **walking-person figure** — a simple silhouette with **no face**, per the no-faces rule. Arrow keys also work. Solving it marks today's wake-up as on time and returns to Home.
PRD ref: `prd.md > Wake-up alarm and maze`.

### Sleep
Horizontal bars for the sample week (bedtime → wake), dashed lines at 11 pm and 6 am; nights outside the window stick out.
PRD ref: `prd.md > Bedtime and sleep bars`.

### Sample week (`sampleWeek.js`)
Seven past days of `{date, drinks, bedtime, wakeTime}` plus last week's on-time count — **labeled sample data**.
PRD ref: `prd.md > Sample week for the demo`.

## Data Model
| Data | Lives in | Updated by | After refresh |
|---|---|---|---|
| Drinks list (`{id, name, brand, mg}`) | `drinks.js` | — (hand-written) | same |
| Today's drinks (`{drinkId/name, mg, time}`) | React state + localStorage `we.today` | logging a drink | restored (cleared if the date changed) |
| Today's wake-up on time | React state + localStorage `we.wake` | solving the maze | restored |
| Sample week | `sampleWeek.js` | — | same |
| Settings: bedtime 23:00, wake 06:00, difficulty | constants; difficulty in state | picker | difficulty resets to medium |

Rings for today: wake = maze solved; caffeine = `mgNow ≤ limitNow` all day (checked on each log); bedtime = not yet (closes at the next check-in — deferred), so it shows empty today with sample history filled.

## File Structure
```
build-with-ai/
├── app/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx          # React entry
│       ├── App.jsx           # tabs, shared state, localStorage
│       ├── styles.css        # colors, layout, animations
│       ├── data/
│       │   ├── drinks.js     # hand-picked drinks with mg
│       │   └── sampleWeek.js # labeled sample history
│       ├── lib/
│       │   ├── caffeine.js   # half-life math, red line, curve
│       │   └── maze.js       # maze generator
│       └── screens/
│           ├── Home.jsx      # rings, path bar, ladder, week columns
│           ├── Coffee.jsx    # search, Vessel, graph
│           ├── Alarm.jsx     # alarm tab, ringing screen, Maze
│           └── Sleep.jsx     # sleep bars
├── devpost/                  # planning docs
└── README.md
```

## External Services and Dependencies
None beyond npm packages (`react`, `react-dom`, `vite`, `@vitejs/plugin-react`). No APIs, keys, or costs.

## Important Failure Modes
- **Drink not in the list** → custom entry: name + mg.
- **localStorage unavailable** → app still works; data just resets on refresh.
- **Maze too hard to film quickly** → difficulty picker; record on easy.

## What Was Simplified and Why
All agreed with the learner because of the under-one-hour deadline:
- **React web app** instead of Flutter — no install time; same screens/logic for a later Flutter rebuild.
- **Hand-picked ~15 drinks** instead of a drink library/API — no research or network risk. A fuller version would use a caffeine database.
- **"Ring alarm now" button** instead of a real scheduled alarm — browsers can't reliably wake a phone; a native app would use scheduled notifications.
- **Fixed settings, no onboarding** — 11 pm / 6 am hardcoded.
- **Gradients instead of animated scenes**; **one mug** instead of three vessels.
- **No phased schedule or morning check-in**; bedtime history comes from sample data.

## Decisions and Open Issues
- **Learner decisions:** React + Vite over Flutter (time); the cut and build order above (kernel first: Coffee → Alarm/Maze → Home → Sleep).
- **Agent-derived details:** plain JS, SVG by hand, localStorage keys, maze sizes, half-life constants.
- **Learner's useful unknown:** "how pieces fit together end to end." Clarified by `How This Works` and `The Core Journey Through the System`: a tap → React state → saved to localStorage → math in `caffeine.js` → SVG redraws. The build will point to these files as each step lands.
- **Open:** caffeine values are approximations (5 h half-life, 50 mg at bed); refine later. `prd.md > Open Questions` on drink data and alarm ringing are resolved by the simplifications above.
