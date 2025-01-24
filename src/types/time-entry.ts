export interface TimeEntry {
  date: string;
  ministryHours: number;
  bibleStudies: number;
  houseToHouse: boolean;
  bibleStudy: boolean;
  returnVisit: boolean;
  cartWitnessing: boolean;
  letterWriting: boolean;
  informalWitnessing: boolean;
  others: boolean;
  activities: string[];
}

export const createActivitiesArray = (entry: TimeEntry): string[] => {
  const activities = [];
  if (entry.houseToHouse) activities.push('House to House');
  if (entry.bibleStudy) activities.push('Bible Study');
  if (entry.returnVisit) activities.push('Return Visit');
  if (entry.cartWitnessing) activities.push('Cart Witnessing');
  if (entry.letterWriting) activities.push('Letter Writing');
  if (entry.informalWitnessing) activities.push('Informal Witnessing');
  if (entry.others) activities.push('Others');
  return activities;
}

export const createBooleanFlags = (activities: string[]): Partial<TimeEntry> => {
  return {
    houseToHouse: activities.includes('House to House'),
    bibleStudy: activities.includes('Bible Study'),
    returnVisit: activities.includes('Return Visit'),
    cartWitnessing: activities.includes('Cart Witnessing'),
    letterWriting: activities.includes('Letter Writing'),
    informalWitnessing: activities.includes('Informal Witnessing'),
    others: activities.includes('Others'),
  };
}
