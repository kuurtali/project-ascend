# Changelog

Written after the fact, in English, for people reading the repo. The
authoritative record — with the reasoning, the rejected options and the
mistakes — is [`docs/SECOND_BRAIN.md`](docs/SECOND_BRAIN.md), in Turkish.

Entries are grouped by what changed in the *system*, not by release
number. There are no releases; the app deploys on every push to `main`.

---

## 2026-08-20 · The user decides

The system was making decisions on the user's behalf, and the reasoning
behind those decisions was thinner than it looked.

**Automatic promotion removed.** Reaching gold on a movement used to move
the slot up the tree silently. Replaced with a volume gate plus explicit
consent: `gold target × gold sets × 8 sessions` (288 reps for pike
push-up), then the app asks. Position in the tree became stored state
(`trackAt`) that only the user writes — including moving back.

A verified-gold requirement was part of the first version of this gate
and was then removed: the user couldn't see why the door wasn't opening,
so the gate felt arbitrary. The tier is still computed and shown, it just
doesn't lock anything.

**Consistency layer added.** Push-ups, dips, squats and gym attendance are
now a one-tap strip that counts *days*, not reps. The interval belongs to
the user — "every 2 days" means the second day isn't lateness. No daily
streak, on purpose. Marks don't feed tiers or XP.

**Calibration was measuring the wrong movements.** It asked about
push-ups, squats, planks and bench dips while the program prescribed pike
push-ups, rows and wall handstands — the only overlap was the hollow hold.
Entering real numbers changed almost nothing on the session screen. The
program's own movements were added to the calibration.

**And it was feeding a max into a rule that expected a session.** Enter 30
push-ups and the next day's target became **31** — three sets above a
one-set maximum. A max test is RIR 0; a prescription is RIR 2-4. Now
tagged `kind: 'calibration'` and converted through `targetFromMax()`.

Schema v4. 196 tests.

## 2026-08-15 · Outside training

The README had always claimed the system was built to coexist with other
training, but the app had no way to be told about it. The cost was a
silent measurement error: do 150 squats on Friday, hold ten seconds less
on Saturday, and the adaptation rule reads regression and permanently
lowers the target.

Outside sessions are now logged with type, intensity, whether they
involved jumping, and an optional note. Heavy outside load in the previous
two days suspends the "missed by 3+ → drop 20%" rule — forgiving one bad
day, not a pattern. Types map to tree categories so the app can warn about
same-tissue clashes *before* the session rather than after.

Deliberately excluded from streaks, XP and tiers: outside load is context,
not progress.

Schema v3.

## 2026-08-14 · Durability, after a four-perspective review

The project was reviewed as an athlete, a developer, a critic and a
foreign user, with field research first. Two findings changed the plan:
30-day retention in health and fitness apps is 3-4%, and the most cited
reason for abandonment is time-consuming manual entry; and gamification
built around *making failure visible* increases discomfort, while
gamification built around *supporting recovery* reduces it.

Added: a React error boundary with a data-rescue screen, schema versioning
with forward-only migrations, comeback mode after a break, weekly
bodyweight tracking, a one-tap "I hit the target" quick entry, and form
cues moved next to the movement instead of living in the tree screen.

**Deload and comeback are opposite operations**, and confusing them would
make both useless: a deload halves *sets* and keeps the target, shedding
fatigue from someone who has been training; a comeback lowers the *target*
and keeps sets, re-finding the level of someone who hasn't. A test guards
the distinction.

XP was moved out of the header — external rewards weaken intrinsic
motivation, and rank plus days are better signals of capability.

## 2026-08-09 · Coach report

The app lives on a phone; the coaching conversation happens on a desktop.
`coachReport()` compresses the last fourteen days, effort labels, trends,
tier changes and deload status into a few hundred characters that paste
into a chat. No sync, no file transfer, no personal data.

## 2026-08-06 · Promotion became real

Until this point promotion was announced on the Progress screen and
nothing happened. The Today screen read a fixed template, so reaching gold
changed nothing. A session resolver was added: the template describes the
*shape* of a week, the engine picks which movement fills each slot, and
both screens call the same resolver so they can't disagree.

Deload landed here too — every sixth week, counted from the user's first
logged session rather than the calendar.

## 2026-08-01 · The figures looked drunk

The first figure system stored joint *positions*, so forearms stretched
and shrank between animation frames. Rewritten as forward kinematics: a
pose is a root point plus joint angles, which makes bone length constant
by construction and carries limbs along natural arcs.

Poses are generated by a Python rig into TypeScript, because the same
skeleton math was needed in the preview tool and the app, and two
hand-maintained copies drift.

**The service worker was serving `index.html` cache-first**, so two
releases never reached the user at all. Now network-first for HTML,
cache-first only for hash-named assets.

## 2026-07-26 · Engine and app

Pure TypeScript engine: unlocking, mastery tiers with two-session
verification, the adaptation rule, the progression planner, role-based
skill slots. Thresholds defined at RIR 2 with one test day per week, so
the gamification can't push anyone into grinding themselves down.

## 2026-07-25 · Data foundation

197 movements with prerequisites, mastery tiers, XP curve, muscles,
families, tips and common mistakes — hand-written in Python and validated
by 11 checks into `movements.json`.

The equipment-cascade check caught a real bug immediately: one mobility
node was tagged as requiring a resistance band, which silently made **39
nodes and 8 bosses** unreachable for anyone without one. Equipment-free
access went from 72% to 93%.
