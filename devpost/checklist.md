---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast

## Slices

- [x] **1. Log a drink and watch it pour into the cup**
  Becomes usable: A phone-sized app with a bottom nav; on Coffee you search drinks (Tim Hortons, Starbucks, espresso…), tap one, watch it pour into the mug, see the white level line with mg, the red dotted max line, "X mg more," and the fade-to-bedtime graph. Drinks survive a refresh.
  Why now: This is the kernel's most distinctive moment and the riskiest visual; scaffold comes along for the ride.
  PRD ref: `prd.md > Caffeine logging and the cup`
  Spec ref: `spec.md > Coffee`, `spec.md > Vessel`, `spec.md > Caffeine math (caffeine.js)`, `spec.md > App shell and nav`, `spec.md > File Structure`
  Build: Scaffold Vite React app in `app/`; App shell with four tabs; `drinks.js`, `caffeine.js`, `Coffee.jsx` with search, custom mg entry, SVG mug with pour animation, level/max lines, graph; localStorage for today's drinks.
  Verify (mechanical): `npm run build` succeeds; a node check of `caffeine.js` returns expected decay and limit values; dev server serves the page.
  Learner check: Open the Coffee tab, search "Tim", tap a drink, and watch it pour; check the white line, red dotted line, and "mg more."
  Commit: `Add coffee screen with drink search, pour animation, and caffeine lines`

- [x] **2. Ring the alarm, solve the maze, see the rings close**
  Becomes usable: On Alarm, pick a difficulty and tap "Ring alarm now"; the clock shakes, a maze appears; drag the walking figure from top-left to bottom-right leaving a dotted trail; you land on Home where the nested rings fill and sparkle.
  Why now: Completes the wake-up half of the kernel and the main celebration moment.
  PRD ref: `prd.md > Wake-up alarm and maze`, `prd.md > Rings, ladder, and completion`
  Spec ref: `spec.md > Alarm and Maze`, `spec.md > Home`
  Build: `maze.js` generator; `Alarm.jsx` (tab, ringing screen, draggable maze, trail, faceless walker); Home with nested rings + path bar; wake-up result saved to localStorage; sparkle.
  Verify (mechanical): `npm run build` succeeds; a node check confirms generated mazes are fully connected (start reaches end).
  Learner check: Ring the alarm, solve an easy maze, and watch the rings on Home.
  Commit: `Add alarm, draggable maze, and home rings`

- [x] **3. Home shows progress from a sample week, and Sleep shows the bars**
  Becomes usable: Home shows the goal ladder, this-week counts, and last-week vs. this-week columns; Sleep shows a "Going to bed" button and bars for the sample week with dashed 11 pm–6 am lines.
  Why now: Fills out the chain and the progress story for the demo once the kernel works.
  PRD ref: `prd.md > Rings, ladder, and completion`, `prd.md > Bedtime and sleep bars`, `prd.md > Sample week for the demo`
  Spec ref: `spec.md > Home`, `spec.md > Sleep`, `spec.md > Sample week (sampleWeek.js)`
  Build: `sampleWeek.js` (labeled); ladder, counts, week columns on Home; `Sleep.jsx` bars + going-to-bed button.
  Verify (mechanical): `npm run build` succeeds; dev server serves the page.
  Learner check: Scroll Home and open Sleep; check the bars stick out on late nights.
  Commit: `Add sample week progress on home and sleep bars`

## Hands-on Checkpoints

- [x] Early usable behavior explored — after slice 1 (Coffee): learner asked for side pour + sound, longer red line, per-drink remove, vessel picker; all built in c0d3171 (retry folded into final review for time)
- [ ] Final kick-the-tires exploration and feedback completed

## Final Review

- [x] Revert pour animation, remove sound; travel mug handle, jar silver lid, paper cup with green lid
- [x] Living backgrounds for coffee, alarm, home; sunrise after maze
- [x] Bigger, faster sun with rays; latte background back on Coffee
- [x] Morning check-in after the maze
- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence:
Route and stops:
Edit outcome:
Reflection:
Activity mode:

## Revisions
- Home progress (ladder, this-week counts, week columns) and the sample week were built in slice 2 instead of slice 3 — the ladder needed the sample history to show the "goal reached" moment after the maze; slice 3 is now just Sleep.
- Coffee pour reverted to the straight stream and the pour sound removed; travel mug gets a handle, mason jar a silver lid, new paper cup with green lid — learner feedback at final review.
- Living backgrounds added (coffee: dark espresso with rising bubbles; alarm: dawn sky with a slow curved sunrise and birds; home: floating warm light) and a sunrise animation after the maze — learner wanted every screen to feel like Sleep. Reverses the spec's "gradients instead of animated scenes" simplification.
- Morning check-in built after the maze (yesterday's sample drinks + bedtime, or tonight's "Going to bed" tap) — learner chose to add it back from the deferred list at final review. Onboarding remains deferred.
- Sun made bigger with rotating rays and faster; coffee background returned to the light latte gradient with the moving bubbles kept — learner feedback.
