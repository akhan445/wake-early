---
doc: prd
status: approved
---

# Wake Early — Product Requirements

**Drink right. Sleep tight. Wake early.** A fun, encouraging app for someone who keeps meaning to wake up early but can't make it stick. It connects caffeine → bedtime → wake-up in one place and celebrates completion instead of streaks.
Source: `scope.md > The Unique Kernel`, `scope.md > Who It's For`.

## The Core Journey
Source: `scope.md > The Core Loop`, `scope.md > What "Working" Looks Like`.

1. **First open → onboarding.** A stepped onboarding with a progress bar (circles; current step highlighted). Each section has its own color and mood. The user sets: their target wake time and bedtime, cold turkey or phased, their maze difficulty (easy / medium / hard), and reads a short explainer on how caffeine affects bedtime.
2. **Land on Home.** Today's three rings are empty; the first goal is "Wake up on time 1×."
3. **During the day → Coffee tab.** The user searches for a drink (e.g. a Tim Hortons or Starbucks drink, an espresso), picks it, and watches it **pour** into their chosen vessel. The cup shows the caffeine in their system; a red line shows how much more they can have and still be clear by bedtime; a small graph shows the caffeine fading toward bedtime.
4. **At night → Sleep tab.** The user taps **"Going to bed."** The screen goes to starry-night mode.
5. **Morning → the alarm goes off.** The alarm clock shakes on screen. The user solves the maze (top-left to bottom-right) to turn it off. Solving it by the target time closes today's **wake-up ring**.
6. **Morning check-in.** One card, pre-filled from yesterday: confirm caffeine ("Anything else?" → *That's everything* / *Add one*) and bedtime ("In bed at 11:10 pm?" → *Yes* / *Edit*). This finalizes **yesterday's** caffeine and bedtime rings.
7. **Home celebrates.** Rings fill and sparkle; the goal ladder advances if a goal was reached; an encouraging message appears. The path bar shows what's left today: "You're up on time — keep caffeine under the line and be in bed by 11 to complete today."
8. **Repeat.** Each morning completes the last day and starts the next. With phased, tomorrow's alarm is a bit earlier.

**Success** = a user can go through steps 1–8, and a demo user with a week of sample data shows rings, the ladder, the caffeine cup, sleep bars, and week-over-week improvement.

## Screens and Layout

- **Onboarding** — full-screen steps with a circle progress bar; background color and mood change per section (alarm, caffeine, sleep).
- **Alarm ringing → Maze → Morning check-in** — a full-screen sequence that ends on Home.
- **Main app with a bottom nav bar of four tabs:** Home · Alarm (clock icon) · Coffee (cup icon) · Sleep (bed icon). Each tab is scrollable.

### Home (top to bottom)
1. **Today's rings** — three nested rings: wake-up (outer), caffeine, bedtime. Under them, the **path bar**: ☕ under the line → 🛏 in bed on time → ☀️ up on time, highlighting what's done and what's left.
2. **Goal ladder** — checkpoints for on-time wake-ups: 1 → 2 → 4 → 7 → 30. Finished ones lit, the next one glowing.
3. **This week** — simple counts, not a 7-day strip: "Under your caffeine line 4 days this week," "In bed on time 3 days this week."
4. **Week comparison** — two growing columns: last week vs. this week on-time wake-ups, with praise when this week passes last week.

### Alarm tab
Sunrise scene (sun slowly rising, birds flying). Shows the next alarm time, the target wake time, the approach (and, for phased, the upcoming schedule), and maze difficulty. The alarm clock does a little shake whenever the user opens this tab — on screen only, no phone vibration.

### Coffee tab
Latte vibe. The user's chosen vessel — coffee mug, mason jar with ice and a straw, or travel mug — selectable here. Drink search, the pour animation, the moving red line, current mg, and the caffeine-fading graph under the vessel.

### Sleep tab
Starry night drifting from the bottom of the screen to the top, continuously, with a bed/blanket visual. The **"Going to bed"** button. Horizontal bars per night (bedtime → wake time) with dashed lines marking the target window (e.g. 11 pm–6 am), so the user can see themselves fitting into it.

## Look and Feel
Source: `scope.md > Inspiration & Identity`.

- **Fun, interactive, positive.** It should take away the feeling of "doing something difficult." Impressive on first open: "simple yet engaging," "visibly very intuitive." It must **not look like an AI built it.**
- **Each section has its own color and mood**, carried through onboarding and the tabs:
  - Alarm / wake-up — sunrise (warm orange); rising sun, birds.
  - Coffee / caffeine — latte (warm browns).
  - Sleep / bedtime — night (indigo); drifting stars.
- **Motion is part of the identity:** pouring drinks, draining cup, sparkle on completion, shaking alarm clock, rising sun, drifting stars.
- **No faces anywhere** — no people, no eyes or mouths, no face emojis or characters.
- **Encouraging tone.** Celebrate wins; never shame misses.

## Features and Behavior

### Onboarding
Source: `scope.md > The POC Boundary`.
- Steps: target wake time and bedtime → cold turkey or phased (phased also asks the user's current usual wake time) → caffeine explainer → maze difficulty.
- [ ] The progress bar shows each step as a circle and highlights the current one.
- [ ] The background color and mood change when moving between the alarm, caffeine, and sleep sections.
- [ ] After the last step, the user lands on Home with empty rings and the goal "Wake up on time 1×."

### Wake-up alarm and maze
Source: `scope.md > The POC Boundary`, `scope.md > Explicitly Cut` (sensor challenges replaced by the maze).
- The alarm rings at the scheduled time; the clock shakes on screen; the maze appears.
- Maze: start top-left, reach bottom-right. Easy / medium / hard change the maze size and complexity.
- [ ] The alarm doesn't stop until the maze is solved.
- [ ] Hard mazes are visibly bigger and twistier than easy ones.
- [ ] Solving the maze by the target time closes today's wake-up ring; solving it later doesn't, and the user sees an encouraging message, not a scolding one.
- [ ] After the maze, the morning check-in appears, then Home.

### Phased schedule
Source: `scope.md > The POC Boundary`.
- Cold turkey: the alarm is the target time every day.
- Phased: the alarm starts at the user's current wake time and moves earlier each day until it reaches the target.
- [ ] With phased, the Alarm tab shows the upcoming days' alarm times stepping toward the target.
- [ ] Win messages project progress forward: "You woke up 15 minutes earlier today — keep this up for a week and you'll be up almost two hours earlier."

### Morning check-in
- One card, pre-filled from yesterday's data.
- [ ] Shows yesterday's logged drinks and total; *That's everything* or *Add one*.
- [ ] Shows yesterday's bedtime from the "Going to bed" tap; *Yes* or *Edit* the time.
- [ ] Usually two taps to finish; on confirming, yesterday's caffeine and bedtime rings are finalized.

### Caffeine logging and the cup
Source: `scope.md > Inspiration & Identity` (caffeine cup idea).
- Search common caffeinated drinks, including brand drinks (Tim Hortons, Starbucks) and generics (espresso, drip coffee, energy drinks). Each drink has its caffeine amount.
- Picking a drink plays a **pouring animation** into the vessel — the drink visibly pours in, not just a level rising.
- The cup level is the caffeine in the user's system right now, and drains over the day as it wears off.
- The **red line** is the most caffeine the user can have in their system right now and still be clear enough by bedtime. It drops as bedtime gets closer. The screen shows how much more they can have ("You can have about 50 mg more").
- A line graph under the vessel shows the caffeine fading from now until bedtime, with bedtime marked.
- The **caffeine ring** closes for a day if the user never went past the line that day.
- [ ] Searching "Tim Hortons" or "espresso" shows matching drinks with their caffeine.
- [ ] Picking a drink plays the pour and the mg total rises.
- [ ] Viewing the cup later in the day shows a lower level and a lower red line than earlier.
- [ ] Going past the line shows the liquid above the red line and a gentle warning; that day's caffeine ring won't close.
- [ ] The user can switch between mug, mason jar, and travel mug, and the vessel changes.

### Bedtime and sleep bars
Source: `scope.md > Inspiration & Identity` (sleep/wake bars idea).
- [ ] Tapping "Going to bed" records the time and switches to starry-night mode.
- [ ] The Sleep tab shows one horizontal bar per night from bedtime to wake time, with dashed lines at the target bedtime and wake time.
- [ ] A night outside the window (e.g. bed at 12, up at 8) visibly sticks out past the dashed lines.
- [ ] The bedtime ring closes for a day when the confirmed bedtime is on or before the target.

### Rings, ladder, and completion
- Today's rings: wake-up (closed by the maze), caffeine and bedtime (finalized at the next morning's check-in).
- The goal ladder counts on-time wake-ups, not streaks — a missed day never resets it.
- Completion is the reward: rings close with a sparkle; reaching a checkpoint lights it up and reveals the next goal.
- [ ] Closing all three rings for a day plays a sparkle effect.
- [ ] Reaching an on-time wake-up goal (1, 2, 4, 7, 30) lights that checkpoint and shows the next goal.
- [ ] Missing a day never lowers the ladder.
- [ ] Week comparison shows last week vs. this week on-time wake-ups as two columns.

### Sample week for the demo
Source: `scope.md > What "Working" Looks Like`.
- [ ] A user with a week of sample data shows filled-in rings, ladder progress, sleep bars, the week comparison, and caffeine history.

## States and Boundaries

- **First use** — empty rings, ladder at "Wake up on time 1×," empty cup with the red line high, no sleep bars yet; each screen shows a short, friendly hint about what to do first.
- **No drinks logged** — empty cup; the caffeine ring counts as under the line.
- **Over the line** — liquid visibly above the red line, gentle warning ("This much caffeine may make it harder to fall asleep by 11"); no shaming.
- **Drink not found** — the user can add a custom drink by entering its caffeine in mg.
- **Forgot to tap "Going to bed"** — the morning check-in asks for the bedtime instead of confirming one.
- **Late wake-up** — wake-up ring stays open; encouraging message; ladder unchanged.
- **Persistence** — settings, logged drinks, bedtimes, wake-ups, and progress are still there after closing and reopening the app.

## Product Decisions

- **Completion over streaks** — counting wins (1, 2, 4, 7, 30) motivates without the discouragement of breaking a streak.
- **Completion is the reward; no "build something" game** — the learner couldn't picture what to build, and completion plus sparkles is enough for the POC.
- **Three nested rings for the day** — "it looks the clearest"; plus the ☕ → 🛏 → ☀️ path bar to show they're part of one whole.
- **A day is the calendar day (Option B)** — waking up on time gives an immediate win and "today propels to tomorrow," instead of waiting overnight to find out.
- **Morning check-in right after the maze** — two pre-filled taps keep it quick and keep the celebration in one moment.
- **"Going to bed" tap instead of phone-activity detection** — detection needs restricted native access; it's in Later.
- **Ladder counts on-time wake-ups** — waking up early is the point of the app.
- **"This week" counts instead of a 7-day strip** — one lit day out of seven could feel discouraging.
- **Moving red line tied to bedtime** — shows how much more caffeine is OK *right now*, not a fixed daily limit.
- **Pour animation, not a rising level** — a signature moment that sets it apart from other apps.
- **On-screen shake, not phone vibration** — vibrating every time would get annoying.
- **No faces** — learner's rule for the visual identity.
- **Name: Wake Early** — tagline "Drink right. Sleep tight. Wake early."

**Assumptions (proposed by the agent; accepted by the learner at PRD approval):**
- "On time" means the maze is solved by the target wake time, with no grace period.
- Phased steps the alarm 15 minutes earlier each day (scope said 10–15).
- The demo's sample week is loaded through a simple "load sample week" option.
- The 7–14-day trend under the main ring was dropped in favor of the ladder, "This week" counts, and the week comparison.

## What We're Building
- Onboarding with a circle progress bar and per-section colors.
- Alarm + maze (three difficulties) + morning check-in.
- Cold turkey and phased schedules with forward-projecting win messages.
- Home: nested rings + path bar, goal ladder, this-week counts, week comparison columns.
- Coffee: drink search with brand drinks, three vessels, pour animation, draining cup, moving red line, caffeine graph, custom drink fallback.
- Sleep: "Going to bed," starry-night mode, sleep bars with a dashed target window.
- Animated section scenes (sunrise + birds, latte, drifting stars), sparkle on completion, shaking alarm clock.
- Saved progress between sessions; a sample week for the demo.

## Deferred From the POC
- **Phone-activity sleep detection** — needs restricted native access; replaced by the "Going to bed" tap.
- **Check-in notifications** — the check-in happens right after the maze instead.
- **Sensor wake-up challenges** (move the phone, push-ups, shaking) — need native sensors; replaced by the maze.
- **Accounts / sync across devices** — not needed to prove the idea.

## Possible Later Enhancements
- A "build something" reward layer (e.g. a garden) once there's a clear idea for it.
- Four Tendencies personality profiling in onboarding.
- Deeper sleep tracking and bedtime reminders.
- Physical vibration as an optional alarm setting.

## Non-Goals
- **No AI** — the personalization needed is simple math (`scope.md > Explicitly Cut`).
- **No streaks or badges** — the learner explicitly doesn't want them.
- **No faces or characters** — part of the visual identity.
- **No medical advice** — caffeine guidance is approximate and framed as general information.

## Open Questions
- **Drink data source** — find a library, dataset, or API of common caffeinated drinks including brand drinks; fallback is a hand-picked list. *Answer in `4-spec`.*
- **Caffeine science values** — the half-life, and how much caffeine at bedtime is "clear enough" to sleep. *Research in `4-spec`.*
- **More design discussion** — the learner wants to revisit the caffeine page design and colors. *Discuss in `4-spec` (Look and Feel).*
- **How the alarm actually rings** — depends on whether this is a phone app or runs in a browser. *Answer in `4-spec`.*
