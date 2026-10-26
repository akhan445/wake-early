---
doc: scope
status: approved
---

# Wake-Up App (working title)

A fun, encouraging app that treats waking up early as a whole process — not just an alarm.

## The Unique Kernel
**It connects the whole chain in one place:** caffeine affects when you can fall asleep, bedtime affects when you wake up, and the app shows you that chain in your own data instead of just ringing at you. **And it makes the habit feel like a game, not a grind:** it celebrates your wins and projects them forward ("you woke up 15 minutes earlier today — keep this up for a week and you'll be up two hours earlier"), so the user doesn't dwell on how hard it is.

## Who It's For
Someone — starting with the learner — who keeps meaning to wake up early but struggles to make it stick, especially someone who finds focus and routines hard (the learner has ADD). Today they set an alarm and hope; they don't see how caffeine and late bedtimes set up the failed morning.

## The Core Loop
Evening: log a drink, see when the caffeine clears. Morning: the alarm goes off and you solve a maze to turn it off. Then see your wins and patterns, and the next day's wake-up time moves earlier if you chose the phased approach. They come back because it's encouraging and they can see themselves improving.

## Inspiration & Identity
- Fun, interactive, gamified, positive — "it takes away from the fact that they're actually doing something difficult."
- Impressive UI right away: "simple yet engaging," "visibly very intuitive." It "shouldn't look like an AI built it."
- Feels personal — "an experience that is unique to them."
- Encouraging tone; wins are front and center.
- Data views for "data nerds" who want to understand their patterns.

Screen ideas the learner volunteered (detail belongs in the PRD):
- **Caffeine cup:** a coffee cup that fills with "watery," brown coffee as drinks are logged (e.g. 150 mg), with a marker line — "you shouldn't go past this mark" or you'll struggle to sleep on time. It drains through the day as the caffeine's half-life wears off.
- **Sleep/wake bars:** horizontal bars per night showing bedtime → wake time, with dashed lines marking the target window (e.g. bed at 11, up at 6). A night like "bed at 12, up at 8" visibly falls outside it; the pattern shows the user fitting themselves into the window.

## Why This Matters to the Learner
Sleeping and waking on time is a real problem for the learner. As someone with ADD, they want tools that "work for me, but also… for anybody else." They believe in understanding how different types of people work and building around that — "how I can create one app that can be personalized for everybody." Underlying philosophy: teach someone to fish, not just hand them a fish.

## What "Working" Looks Like
A short demo in two parts:
1. **Onboarding:** a new user picks their goal and approach (cold turkey vs. phased), sees a short explainer about how caffeine affects bedtime, and picks a maze difficulty for their wake-up challenge.
2. **A user with a week of mock data:** log a drink and see when the caffeine will clear; view the caffeine → bedtime → wake-time patterns; see encouraging win messages and the phased schedule; trigger the alarm and solve the maze to turn it off.

The "oh, that's cool" beat: seeing your own caffeine, bedtime, and wake-up times connected, with a message celebrating how far you've come.

## The POC Boundary
- Onboarding: wake-up goal, cold turkey vs. phased, caffeine explainer, maze difficulty (easy/medium/hard).
- Log a caffeinated drink and see when the caffeine will clear (half-life).
- Mock data for a week of caffeine, bedtime, and wake times; a view that connects them.
- Phased schedule math: move the wake time 10–15 minutes earlier a day (possibly starting from a baseline average).
- Encouraging win and projection messages.
- Wake-up maze challenge: start top-left, reach bottom-right to turn off the alarm; three difficulty levels.

## Later
- Real device alarms and sensor challenges (move the phone 15–20 feet, push-ups, shaking).
- Tokens / "build something" game layer.
- Four Tendencies (Upholder, Questioner, Obliger, Rebel) personality profiling in onboarding.
- Detecting wake-ups from phone activity (and telling a real wake-up from a 3 a.m. scroll).
- Deeper sleep tracking and bedtime reminders.

## Explicitly Cut
- **AI** — the personalization the POC needs (phased schedule, averaging a baseline) is simple math; the learner decided it isn't necessary at this stage.
- **Sensor-based wake-up challenges** — need native phone access and would consume the whole time budget; replaced by the maze.
