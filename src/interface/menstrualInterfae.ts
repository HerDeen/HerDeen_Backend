export interface IMenstrualLog {
  lastFlowDate: Date;
  averageFlowDuration: number;
  cycleLength: number;
  useStandardCycle: boolean;
  quranGoalDuringPeriod: number;
  memorizationFrequency: string;
  reminderPreference: {
    spiritualEncouragement: boolean;
    restReminder: boolean;
    disableIbadahReminders: boolean;
  };
}

export interface IUpdateMenstrualLog {
  lastFlowDate?: Date;
  averageFlowDuration?: number;
  cycleLength?: number;
  useStandardCycle?: boolean;
  quranGoalDuringPeriod: number;
  memorizationFrequency?: string;
  reminderPreference?: {
    spiritualEncouragement: boolean;
    restReminder: boolean;
    disableIbadahReminders: boolean;
  };
}
