import type { Insight } from './types'

/**
 * Short, evidence-informed explanations attached to choices.
 * Summaries are simplified for education; see sources for nuance.
 */
export const INSIGHTS: Record<string, Insight> = {
  control: {
    title: 'Control is a buffer',
    body: "In Karasek's Demand–Control model, high demands combined with low control are linked to the most strain. Planning your day is a small way to take back control.",
    source: 'Karasek, 1979',
  },
  switching: {
    title: 'Switching tasks has a cost',
    body: 'Each switch between tasks costs time and mental effort. Reactive, inbox-driven work fragments attention and drains energy faster than focused work.',
    source: 'Monsell, 2003',
  },
  effortRecovery: {
    title: 'Effort must be repaid',
    body: 'The Effort–Recovery model holds that strain from effort is normally reversible — if there is enough recovery time. Long hours shrink that window, so fatigue accumulates.',
    source: 'Meijman & Mulder, 1998',
  },
  lunch: {
    title: 'Real breaks restore',
    body: 'Lunch breaks that involve relaxation and personal choice are associated with lower end-of-day fatigue than breaks spent doing work.',
    source: 'Trougakos et al., 2014',
  },
  detachment: {
    title: 'Switching off matters',
    body: 'Psychological detachment — mentally disengaging from work during off-hours — is one of the most consistent predictors of recovery and lower exhaustion.',
    source: 'Sonnentag & Fritz, 2007',
  },
  alwaysOn: {
    title: 'The “always-on” trap',
    body: 'Work-related smartphone use after hours is linked to poorer psychological detachment and higher exhaustion, even when little actual work gets done.',
    source: 'Derks et al., 2014',
  },
  roleClarity: {
    title: 'Clarity reduces strain',
    body: 'Role ambiguity is a classic job demand. In the Job Demands–Resources model, unclear expectations add strain while clear guidance acts as a resource.',
    source: 'Bakker & Demerouti, 2007',
  },
  coRumination: {
    title: 'Support vs. co-rumination',
    body: 'Talking with coworkers helps — but repeatedly rehashing problems without moving toward solutions (co-rumination) can amplify stress. Vent briefly, then act.',
    source: 'Haggard et al., 2011',
  },
  microBreaks: {
    title: 'Micro-breaks work',
    body: 'A 2022 meta-analysis found short breaks (10 minutes or less) reliably boost vigor and reduce fatigue; effects on performance depend on the type of task.',
    source: 'Albulescu et al., 2022',
  },
  caffeine: {
    title: "Caffeine masks, it doesn't repay",
    body: "Caffeine can temporarily improve alertness but doesn't remove the need for rest — and caffeine taken even six hours before bed can disrupt that night's sleep.",
    source: 'Drake et al., 2013',
  },
  energy: {
    title: 'Manage energy, not just time',
    body: 'Knowledge workers commonly use small strategies — like switching to a lighter task — to sustain energy. Helpful, but not a substitute for real rest.',
    source: 'Fritz, Lam & Spreitzer, 2011',
  },
  socialRecovery: {
    title: 'Connection recharges',
    body: 'Time with friends away from work supports detachment and mood. Recovery research highlights detachment, relaxation, mastery, and control as key restorative experiences.',
    source: 'Sonnentag & Fritz, 2007',
  },
  halfPresent: {
    title: "Half-present isn't recovery",
    body: 'Checking work messages during leisure time blocks detachment, which lowers the restorative value of that time off.',
    source: 'Derks et al., 2014',
  },
  jobCrafting: {
    title: 'Shape your job',
    body: 'Job crafting — proactively adjusting tasks, scope, or relationships — is linked to higher engagement and lower burnout risk over time.',
    source: 'Tims, Bakker & Derks, 2013',
  },
  sixAreas: {
    title: 'Workload is one of six areas',
    body: 'Maslach & Leiter describe six areas of worklife where mismatch drives burnout: workload, control, reward, community, fairness, and values.',
    source: 'Maslach & Leiter, 2016',
  },
  interruptions: {
    title: 'Interruptions cost more than time',
    body: 'People who are interrupted often compensate by working faster — but report more stress, frustration, and perceived workload.',
    source: 'Mark, Gudith & Klocke, 2008',
  },
  socialSupport: {
    title: 'Support buffers demands',
    body: 'Help from colleagues is a key job resource. In the JD-R model, resources buffer the impact of high demands on exhaustion and fuel engagement.',
    source: 'Bakker & Demerouti, 2007',
  },
  helpSeeking: {
    title: "Asking isn't weakness",
    body: 'Avoiding help to protect your image is common, but it means carrying demands alone. Teams with psychological safety speak up, learn, and adapt better.',
    source: 'Edmondson, 1999',
  },
  sleep: {
    title: 'Sleep debt accumulates',
    body: 'In a lab study, people limited to 6 hours of sleep for two weeks developed attention deficits similar to a full night without sleep — yet felt only slightly sleepy.',
    source: 'Van Dongen et al., 2003',
  },
  bounded: {
    title: 'Bounded effort',
    body: 'A defined stopping point limits how far work spills into recovery time. Short, planned extra effort costs far less than open-ended overtime.',
    source: 'Meijman & Mulder, 1998',
  },
  psychSafety: {
    title: 'Honesty enables help',
    body: 'When people feel safe to name problems, teams can fix them early. Psychological safety is linked to more learning behavior in teams.',
    source: 'Edmondson, 1999',
  },
  masking: {
    title: 'Masking strain is costly',
    body: 'Hiding how you really feel to appear fine (surface acting) is linked to greater emotional exhaustion over time.',
    source: 'Hülsheger & Schewe, 2011',
  },
  meetings: {
    title: 'Meeting load is a demand',
    body: 'Frequent meetings that interrupt focused work are linked to greater fatigue and a sense of higher workload.',
    source: 'Luong & Rogelberg, 2005',
  },
  mastery: {
    title: 'Mastery experiences',
    body: "Practicing a challenging hobby provides 'mastery' — one of four recovery experiences linked to better well-being and next-day energy.",
    source: 'Sonnentag & Fritz, 2007',
  },
  relaxation: {
    title: 'Rest counts too',
    body: "Recovery isn't one-size-fits-all. Low-effort relaxation is one of the four core recovery experiences — though it may restore less than activities you find meaningful.",
    source: 'Sonnentag & Fritz, 2007',
  },
  rumination: {
    title: 'Worry keeps stress switched on',
    body: "Repetitive worry — 'perseverative cognition' — keeps the body's stress response active long after the event itself is over.",
    source: 'Brosschot, Gerin & Thayer, 2006',
  },
  savoring: {
    title: 'Notice what went well',
    body: 'In a field study, briefly reflecting on positive events at work was associated with lower stress and better health at the end of the day.',
    source: 'Bono et al., 2013',
  },
  warningSigns: {
    title: 'Notice the early signs',
    body: "Irritability and growing distance from colleagues can reflect the 'cynicism' dimension of burnout described by Maslach — an early signal worth noticing.",
    source: 'Maslach, Schaufeli & Leiter, 2001',
  },
  reachOut: {
    title: 'Reach out early',
    body: 'Talking with a trusted person, or using workplace resources like an Employee Assistance Program, earlier rather than later helps you name what is happening and find options.',
    source: 'WHO Guidelines on Mental Health at Work, 2022',
  },
  todoList: {
    title: 'Offload before sleep',
    body: 'In a sleep-lab study, writing a specific to-do list for tomorrow before bed helped people fall asleep faster than writing about completed tasks.',
    source: 'Scullin et al., 2018',
  },
  screens: {
    title: 'Screens and sleep',
    body: 'Using light-emitting devices before bed is associated with later sleep onset and reduced alertness the next morning.',
    source: 'Chang et al., 2015',
  },
  longHours: {
    title: 'Long hours, real risks',
    body: 'WHO/ILO estimates link working 55+ hours per week with a higher risk of stroke and heart disease compared with a standard 35–40 hour week.',
    source: 'Pega et al., 2021 (WHO/ILO)',
  },
  organizational: {
    title: 'Burnout is organizational, too',
    body: "WHO's ICD-11 describes burnout as an occupational phenomenon from chronic workplace stress that hasn't been successfully managed — not a medical condition. Lasting fixes often need team and system change.",
    source: 'World Health Organization, 2019',
  },
  disconnect: {
    title: 'The right to disconnect',
    body: "Several countries, beginning with France in 2017, have introduced 'right to disconnect' rules that protect off-hours from work communication.",
    source: 'French Labour Code, 2017',
  },
  community: {
    title: 'Community fuels engagement',
    body: "Feeling recognized and connected is one of Maslach & Leiter's six areas of worklife. Shared celebration strengthens a team's sense of community.",
    source: 'Maslach & Leiter, 2016',
  },
}

export const REFERENCES: string[] = [
  'Albulescu, P. et al. (2022). "Give me a break!" A systematic review and meta-analysis on the efficacy of micro-breaks. PLOS ONE.',
  'Bakker, A. B., & Demerouti, E. (2007). The Job Demands-Resources model: State of the art. Journal of Managerial Psychology.',
  'Derks, D. et al. (2014). A diary study on work-related smartphone use, psychological detachment and exhaustion. J. Occupational Health Psychology.',
  'Edmondson, A. (1999). Psychological safety and learning behavior in work teams. Administrative Science Quarterly.',
  'Maslach, C., & Leiter, M. P. (2016). Understanding the burnout experience. World Psychiatry.',
  'Maslach, C., Schaufeli, W. B., & Leiter, M. P. (2001). Job burnout. Annual Review of Psychology.',
  'Meijman, T. F., & Mulder, G. (1998). Psychological aspects of workload. Handbook of Work and Organizational Psychology.',
  'Pega, F. et al. (2021). Global, regional, and national burdens of ischemic heart disease and stroke attributable to exposure to long working hours. Environment International.',
  'Sonnentag, S., & Fritz, C. (2007). The Recovery Experience Questionnaire. J. Occupational Health Psychology.',
  'Van Dongen, H. P. A. et al. (2003). The cumulative cost of additional wakefulness. Sleep.',
  'World Health Organization (2019). Burn-out an "occupational phenomenon": International Classification of Diseases (ICD-11).',
]
