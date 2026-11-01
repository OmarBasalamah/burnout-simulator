import type { Choice, DayInfo, Stats, Tag } from './types'

/** Compact choice builder. */
function c(
  id: string,
  label: string,
  description: string,
  effects: Partial<Stats>,
  tags: Tag[],
  insight: string,
  feedback: string,
): Choice {
  return { id, label, description, effects, tags, insight, feedback }
}

export const DAYS: DayInfo[] = [
  {
    day: 1,
    title: 'Fresh Start',
    event: 'A new sprint kicks off. Your backlog is already respectable, and expectations are high.',
    incoming: 0,
    scenarios: [
      {
        id: 'd1-am',
        title: 'The Monday Inbox',
        prompt: '47 unread emails and a project kickoff at 10:00. How do you start?',
        choices: [
          c('d1a1', 'Plan & prioritize', 'Spend 20 minutes sorting tasks by importance before touching email.', { workload: -10, exhaustion: 2, engagement: 4 }, ['focus'], 'control', 'You walk into kickoff knowing exactly what matters this week. It feels good to steer.'),
          c('d1a2', 'Dive in reactively', 'Answer emails as they arrive and figure the rest out later.', { workload: -8, exhaustion: 6, recovery: -3, engagement: -2 }, ['push'], 'switching', 'You clear a lot of small things, but by 11 your head is buzzing from constant context switches.'),
          c('d1a3', 'Start at 7am', 'Come in an hour early to get ahead before anyone else arrives.', { workload: -14, exhaustion: 7, recovery: -8 }, ['overtime'], 'effortRecovery', 'The quiet hour is productive — but you borrowed it from your sleep.'),
        ],
      },
      {
        id: 'd1-pm',
        title: 'Lunch, Interrupted',
        prompt: 'Kickoff ran long. It is 2pm and your lunch is still in your bag.',
        choices: [
          c('d1b1', 'Take a real lunch', 'Step away from your desk for 30 minutes. No laptop.', { exhaustion: -6, recovery: 8, engagement: 2 }, ['break'], 'lunch', 'Sunlight, food, a little quiet. You come back noticeably sharper.'),
          c('d1b2', 'Eat at your desk', 'Multitask: lunch in one hand, mouse in the other.', { workload: -6, exhaustion: 3, recovery: -2 }, ['push'], 'lunch', 'You fed your body, but your mind never left work.'),
          c('d1b3', 'Skip lunch', 'Power through to finish the slide deck.', { workload: -10, exhaustion: 6, recovery: -6, engagement: -1 }, ['push'], 'effortRecovery', 'The deck is done. You are also hungry, foggy, and a bit irritable.'),
        ],
      },
      {
        id: 'd1-eve',
        title: 'The 6pm Ping',
        prompt: "Your manager messages: 'Got a sec tomorrow? No rush.'",
        choices: [
          c('d1c1', 'Log off & unwind', 'Reply in the morning. Spend the evening on something you enjoy.', { recovery: 10, exhaustion: -5, engagement: 1 }, ['recovery', 'boundary'], 'detachment', 'You cook, watch a show, and genuinely stop thinking about work.'),
          c('d1c2', 'Reply & keep checking', 'Answer right away and keep Slack open “just in case”.', { workload: -3, exhaustion: 4, recovery: -6 }, ['push'], 'alwaysOn', "Nothing urgent happened — but you checked your phone 30 times wondering what 'a sec' meant."),
          c('d1c3', 'Stay late', 'Use the quiet office to get ahead on the week.', { workload: -14, exhaustion: 9, recovery: -10 }, ['overtime'], 'longHours', 'You make real progress. You also get home at 9pm with nothing left in the tank.'),
        ],
      },
    ],
  },
  {
    day: 2,
    title: 'The Pile Grows',
    event: 'A client sent revised requirements overnight. Part of yesterday’s work needs redoing.',
    incoming: 15,
    scenarios: [
      {
        id: 'd2-am',
        title: 'Moving Goalposts',
        prompt: 'The revisions conflict with what your lead asked for last week. What now?',
        choices: [
          c('d2a1', 'Clarify priorities', 'Ask your manager which version wins and what can wait.', { workload: -10, exhaustion: -2, engagement: 3 }, ['support'], 'roleClarity', 'A five-minute conversation saves you two days of guessing.'),
          c('d2a2', 'Redo it all quietly', "Don't make waves. Rework everything on your own.", { workload: -12, exhaustion: 7, engagement: -4 }, ['push'], 'sixAreas', "You get through it, but there's a growing sense this isn't fair."),
          c('d2a3', 'Vent, then start', 'Grab a coworker for a quick vent before diving in.', { workload: -5, exhaustion: -3, recovery: 2, engagement: 2 }, ['support'], 'coRumination', 'A laugh and a groan together. You feel lighter — and you kept it short.'),
        ],
      },
      {
        id: 'd2-pm',
        title: 'The Same Paragraph',
        prompt: 'You have been rereading the same paragraph for 15 minutes.',
        choices: [
          c('d2b1', '10-minute walk', 'Get outside, move, and let your mind wander.', { exhaustion: -7, recovery: 7, engagement: 2 }, ['break'], 'microBreaks', 'Fresh air resets your focus. The paragraph makes sense now.'),
          c('d2b2', 'Third coffee', 'Caffeine up and push on.', { workload: -8, exhaustion: 4, recovery: -4 }, ['push'], 'caffeine', "You're wired and productive... and you'll feel it at bedtime."),
          c('d2b3', 'Switch to easier work', 'Shift to admin tasks for a while.', { workload: -5, exhaustion: -2, engagement: 1 }, ['focus'], 'energy', 'Light tasks keep you moving while your brain catches its breath.'),
        ],
      },
      {
        id: 'd2-eve',
        title: 'Dinner Invitation',
        prompt: 'Friends invite you to a casual dinner tonight.',
        choices: [
          c('d2c1', 'Go, laptop stays home', 'Be fully present with your friends.', { recovery: 12, exhaustion: -6, engagement: 3 }, ['recovery'], 'socialRecovery', 'Stories, laughter, good food. Work feels a lot smaller from here.'),
          c('d2c2', 'Go, but check email', 'Join them, but glance at your inbox under the table.', { workload: -2, recovery: 4, exhaustion: -1 }, ['push'], 'halfPresent', 'You were there... sort of. A client email lingered in your head all night.'),
          c('d2c3', 'Decline & work', 'Stay in to finish the revisions.', { workload: -14, exhaustion: 9, recovery: -10, engagement: -2 }, ['overtime'], 'effortRecovery', 'Revisions done. The group chat photos sting a little.'),
        ],
      },
    ],
  },
  {
    day: 3,
    title: 'Deadline Crunch',
    event: 'Leadership moved the product demo up — it’s now in two days. Everyone feels it.',
    incoming: 25,
    scenarios: [
      {
        id: 'd3-am',
        title: 'Doubled To-Do List',
        prompt: 'Your task list just doubled and the team is tense. Your move?',
        choices: [
          c('d3a1', 'Negotiate scope', 'Propose cutting two low-value features from the demo.', { workload: -16, exhaustion: 1, engagement: 2 }, ['boundary'], 'jobCrafting', 'Your lead agrees. The demo gets smaller — and better.'),
          c('d3a2', 'Say yes to everything', 'Nod along and absorb every request.', { workload: -6, exhaustion: 8, recovery: -4, engagement: -3 }, ['push'], 'sixAreas', "Everyone's happy with you. You're the only one who isn't."),
          c('d3a3', 'Block focus time', 'Three hours, notifications off, door closed.', { workload: -14, exhaustion: 4 }, ['focus'], 'interruptions', 'Deep, uninterrupted work. You get more done than in the last two days combined.'),
        ],
      },
      {
        id: 'd3-pm',
        title: 'An Offer of Help',
        prompt: "A teammate says: 'I've got some capacity — want me to take something?'",
        choices: [
          c('d3b1', 'Accept gratefully', 'Hand over a well-defined task.', { workload: -12, exhaustion: -2, engagement: 3 }, ['support'], 'socialSupport', 'They knock it out. You feel less alone in this.'),
          c('d3b2', 'Decline politely', "You don't want to look like you can't handle it.", { workload: -6, exhaustion: 5, engagement: -2 }, ['push'], 'helpSeeking', 'Image preserved. Workload also preserved.'),
          c('d3b3', 'Propose a trade', 'Swap one of your big tasks for one of their small ones.', { workload: -8, engagement: 4 }, ['support'], 'socialSupport', 'A fair trade that plays to both your strengths.'),
        ],
      },
      {
        id: 'd3-eve',
        title: '8pm, Deck at 60%',
        prompt: 'The demo deck is 60% done and it is 8pm.',
        choices: [
          c('d3c1', 'Stop & sleep', 'Hard stop. Finish tomorrow with a rested brain.', { recovery: 10, exhaustion: -6 }, ['recovery', 'boundary'], 'sleep', 'Eight hours of sleep. Future-you is grateful.'),
          c('d3c2', 'Work until midnight', 'Finish it tonight, whatever it takes.', { workload: -18, exhaustion: 14, recovery: -15, engagement: -3 }, ['overtime'], 'sleep', "Deck finished at 12:40am. You'll pay for it tomorrow."),
          c('d3c3', 'One focused hour', 'One more hour with a timer, then stop.', { workload: -8, exhaustion: 4, recovery: -3 }, ['overtime'], 'bounded', 'Contained extra effort. You close the laptop when the timer rings.'),
        ],
      },
    ],
  },
  {
    day: 4,
    title: 'Running Hot',
    event: 'Demo rehearsal is tomorrow. Your calendar is packed and your manager wants a check-in.',
    incoming: 12,
    scenarios: [
      {
        id: 'd4-am',
        title: 'How Are You, Really?',
        prompt: "In your 1:1, your manager asks: 'How are you really doing?'",
        choices: [
          c('d4a1', 'Be honest', 'Name the load and ask for help prioritizing.', { workload: -12, exhaustion: -4, engagement: 4 }, ['support'], 'psychSafety', "Your manager moves a deliverable to someone else. 'Thanks for telling me.'"),
          c('d4a2', "Say 'All good!'", 'Smile and change the subject.', { exhaustion: 3, engagement: -2 }, ['push'], 'masking', 'The meeting ends early. The weight on your shoulders does not.'),
          c('d4a3', 'Request an extension', 'Ask to push one non-critical deadline by a week.', { workload: -10, exhaustion: -2, engagement: 1 }, ['boundary'], 'control', 'Granted without fuss. You wonder why you waited.'),
        ],
      },
      {
        id: 'd4-pm',
        title: 'Meeting Marathon',
        prompt: 'Back-to-back meetings from 1pm to 5pm.',
        choices: [
          c('d4b1', 'Decline optional ones', 'Skip two optional meetings to protect focus.', { workload: -8, exhaustion: -3, engagement: 2 }, ['boundary'], 'meetings', 'Two hours reclaimed. Nobody even noticed.'),
          c('d4b2', 'Attend & multitask', 'Go to all of them and work on your laptop.', { workload: -4, exhaustion: 6, recovery: -3 }, ['push'], 'switching', "You half-listened and half-worked. Neither went particularly well."),
          c('d4b3', 'Attend with breathers', 'Go to all of them, but take 5 minutes between each.', { workload: -2, exhaustion: -3, recovery: 4 }, ['break'], 'microBreaks', 'Short pauses keep the afternoon from blurring together.'),
        ],
      },
      {
        id: 'd4-eve',
        title: 'Hobby Night',
        prompt: 'Your weekly climbing class is tonight.',
        choices: [
          c('d4c1', 'Go to class', 'Chalk up and get on the wall.', { recovery: 12, exhaustion: -6, engagement: 4 }, ['recovery'], 'mastery', 'You finally send that route. Work did not cross your mind once.'),
          c('d4c2', 'Rest on the couch', 'Skip class and just do nothing.', { recovery: 7, exhaustion: -4 }, ['recovery'], 'relaxation', 'A quiet evening. Not thrilling, but restful.'),
          c('d4c3', 'Skip it to prep', 'Rehearse the demo all evening.', { workload: -14, exhaustion: 9, recovery: -10 }, ['overtime'], 'effortRecovery', 'Well-rehearsed. Also: wired, tired, and achy.'),
        ],
      },
    ],
  },
  {
    day: 5,
    title: 'Demo Day',
    event: 'The demo is at 3pm. A colleague called in sick — some of their work is now yours.',
    incoming: 20,
    scenarios: [
      {
        id: 'd5-am',
        title: 'An Extra Queue',
        prompt: "Your sick colleague's urgent tickets land on your desk.",
        choices: [
          c('d5a1', 'Triage & flag', 'Do the truly urgent items and flag the rest to your lead.', { workload: -12, exhaustion: 2, engagement: 2 }, ['boundary'], 'control', 'Critical things handled; the rest is visible and someone else’s decision.'),
          c('d5a2', 'Absorb it all', 'Quietly take on every ticket.', { workload: -8, exhaustion: 10, recovery: -6, engagement: -3 }, ['push'], 'sixAreas', 'You become the safety net — and nobody is catching you.'),
          c('d5a3', 'Split it with the team', 'Post in the team channel to divide the queue.', { workload: -14, engagement: 3 }, ['support'], 'socialSupport', 'Three people grab tickets in minutes. Teams are good at this when asked.'),
        ],
      },
      {
        id: 'd5-pm',
        title: 'After the Demo',
        prompt: 'The demo went... okay. One feature glitched on stage.',
        choices: [
          c('d5b1', 'Team debrief', 'Note what worked, what didn’t, and next steps.', { workload: -4, exhaustion: -2, engagement: 5 }, ['support'], 'community', 'The glitch becomes a lesson instead of a weight.'),
          c('d5b2', 'Replay it in your head', 'Mentally rerun the glitch all afternoon.', { exhaustion: 6, recovery: -4, engagement: -5 }, ['push'], 'rumination', 'By 5pm it feels like a disaster. It wasn’t.'),
          c('d5b3', 'Celebrate what worked', 'Grab a coffee with the team and toast the wins.', { exhaustion: -4, recovery: 5, engagement: 3 }, ['break'], 'savoring', "Most of it went great — and you let yourself notice that."),
        ],
      },
      {
        id: 'd5-eve',
        title: 'Phone-Free Evening?',
        prompt: 'Your partner suggests a phone-free evening together.',
        choices: [
          c('d5c1', 'Phones in the drawer', 'Fully disconnect for the night.', { recovery: 12, exhaustion: -7, engagement: 2 }, ['recovery', 'boundary'], 'detachment', 'Board games, long talks, and an early night.'),
          c('d5c2', 'TV + Slack', 'Stay half-available, just in case.', { workload: -3, recovery: 4, exhaustion: -1 }, ['push'], 'halfPresent', 'You “relaxed” with one eye on notifications.'),
          c('d5c3', 'Fix the glitch tonight', 'You can’t let it go — debug until it works.', { workload: -14, exhaustion: 10, recovery: -10, engagement: -2 }, ['overtime'], 'longHours', 'Fixed at 11pm. Your partner went to bed alone.'),
        ],
      },
    ],
  },
  {
    day: 6,
    title: 'Aftershocks',
    event: "Leadership loved the concept and wants a v2 'ASAP'. No date, no extra people.",
    incoming: 15,
    scenarios: [
      {
        id: 'd6-am',
        title: "'ASAP'",
        prompt: "Everyone looks at you when 'ASAP' is said.",
        choices: [
          c('d6a1', 'Ask what ASAP means', '“What’s the real date — and what can drop to make room?”', { workload: -12, engagement: 3 }, ['boundary'], 'roleClarity', "Turns out 'ASAP' means 'in three weeks'. Good to know."),
          c('d6a2', 'Promise it tomorrow', 'Show commitment with an aggressive deadline.', { workload: -6, exhaustion: 9, recovery: -5, engagement: -2 }, ['push'], 'sixAreas', 'Leadership is impressed. You have no idea how you’ll deliver.'),
          c('d6a3', 'Propose a phased plan', 'Work with your lead on a v2 roadmap in stages.', { workload: -10, exhaustion: -1, engagement: 4 }, ['support'], 'jobCrafting', 'A realistic plan everyone can rally around.'),
        ],
      },
      {
        id: 'd6-pm',
        title: 'A Sharp Reply',
        prompt: 'You snapped at a coworker over something trivial.',
        choices: [
          c('d6b1', 'Apologize & reset', 'Say sorry, then take a short break to reset.', { exhaustion: -6, recovery: 6, engagement: 3 }, ['break'], 'warningSigns', "'No worries — it's been a week.' The air clears."),
          c('d6b2', 'Ignore it, keep going', 'No time for feelings. Back to work.', { workload: -8, exhaustion: 5, engagement: -4 }, ['push'], 'warningSigns', 'The tension lingers. So does the irritability.'),
          c('d6b3', 'Talk to someone', 'Reach out to a mentor, friend, or your EAP.', { exhaustion: -5, recovery: 4, engagement: 3 }, ['support'], 'reachOut', 'Saying it out loud helps you see the pattern.'),
        ],
      },
      {
        id: 'd6-eve',
        title: 'Tired but Wired',
        prompt: "Your body is exhausted but your brain won't switch off.",
        choices: [
          c('d6c1', 'Write a to-do list', 'Jot tomorrow’s tasks on paper, then wind down.', { workload: -2, recovery: 10, exhaustion: -6 }, ['recovery'], 'todoList', "Out of your head, onto the page. You're asleep in 15 minutes."),
          c('d6c2', 'Scroll until 1am', 'Doomscroll in bed until you pass out.', { recovery: -2, exhaustion: 4 }, ['push'], 'screens', 'You wake up feeling like you never slept.'),
          c('d6c3', '“Just one thing”', 'Open the laptop to check one thing...', { workload: -10, exhaustion: 8, recovery: -9 }, ['overtime'], 'alwaysOn', "'One thing' became two hours."),
        ],
      },
    ],
  },
  {
    day: 7,
    title: 'The Finish Line',
    event: 'Final day of the sprint: last push, a team retrospective, and then — finally — the weekend.',
    incoming: 10,
    scenarios: [
      {
        id: 'd7-am',
        title: 'Last Push',
        prompt: 'A few hours left to hit the sprint goals.',
        choices: [
          c('d7a1', 'Top 3 must-dos', 'Focus only on what truly matters.', { workload: -14, exhaustion: 3 }, ['focus'], 'control', 'The essentials ship. The rest goes to next sprint — as it should.'),
          c('d7a2', 'Close every ticket', 'Leave nothing open, no matter what.', { workload: -16, exhaustion: 9, recovery: -6 }, ['push'], 'effortRecovery', 'Inbox zero, ticket zero, energy zero.'),
          c('d7a3', 'Pair on the hardest item', 'Team up with a colleague on the gnarliest problem.', { workload: -12, engagement: 4 }, ['support'], 'socialSupport', 'Two heads crack it in half the time — and it’s actually fun.'),
        ],
      },
      {
        id: 'd7-pm',
        title: 'Sprint Retrospective',
        prompt: 'The team asks for honest feedback on how the sprint went.',
        choices: [
          c('d7b1', 'Raise workload concerns', 'Constructively name the overload and suggest fixes.', { workload: -6, exhaustion: -3, engagement: 5 }, ['boundary'], 'organizational', "Others nod — they felt it too. Leadership commits to better planning."),
          c('d7b2', 'Stay quiet', 'Avoid friction. It’s fine. Everything’s fine.', { exhaustion: 2, engagement: -4 }, ['push'], 'masking', 'Nothing changes. Next sprint will probably look the same.'),
          c('d7b3', 'Propose a team norm', "Suggest: no work messages after 7pm unless it's an emergency.", { exhaustion: -2, recovery: 4, engagement: 4 }, ['boundary'], 'disconnect', 'The team adopts it. Evenings just got quieter for everyone.'),
        ],
      },
      {
        id: 'd7-eve',
        title: 'Closing the Week',
        prompt: 'The sprint is over. How do you close it out?',
        choices: [
          c('d7c1', 'Reflect & plan rest', 'Note what you learned and plan a truly restful weekend.', { recovery: 12, exhaustion: -8, engagement: 3 }, ['recovery'], 'savoring', 'You close the laptop with a sense of completion.'),
          c('d7c2', 'Get a head start', 'Start on next sprint’s backlog tonight.', { workload: -12, exhaustion: 8, recovery: -8 }, ['overtime'], 'longHours', 'Next week is a bit lighter. This weekend starts heavier.'),
          c('d7c3', 'Celebrate with the team', 'Drinks, snacks, and stories from the trenches.', { recovery: 6, exhaustion: -3, engagement: 6 }, ['support', 'recovery'], 'community', 'Laughing about the glitch already. That’s a good sign.'),
        ],
      },
    ],
  },
]

export const SLOT_NAMES = ['Morning', 'Afternoon', 'Evening'] as const
export const SLOT_SHORT = ['AM', 'PM', 'Eve'] as const
