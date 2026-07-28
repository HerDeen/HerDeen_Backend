import { IDuePrayerTime } from "../../interface/duePrayer.interface";
import { newCustomError } from "../../middleware/errorHandler";

export function formatPrayerTime(date: Date, timezone: string) {
  try {
    return date
      .toLocaleTimeString("en-NG", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replace(/\b(am|pm)\b/i, (match) => match.toUpperCase());
  } catch (error: any) {
    throw newCustomError("Invalid timezone", 400);
  }
}

export function getDuePrayerTime(
  prayerTimes: {
    fajr: Date;
    dhuhr: Date;
    asr: Date;
    maghrib: Date;
    isha: Date;
  },
  minutesBefore: number,
  currentTime: Date = new Date(),
): IDuePrayerTime | null {
  const prayers = [
    { name: "Fajr", time: prayerTimes.fajr },
    { name: "Dhuhr", time: prayerTimes.dhuhr },
    { name: "Asr", time: prayerTimes.asr },
    { name: "Maghrib", time: prayerTimes.maghrib },
    { name: "Isha", time: prayerTimes.isha },
  ];
  for (const prayer of prayers) {
    const reminderTime = new Date(prayer.time);
    reminderTime.setMinutes(reminderTime.getMinutes() - minutesBefore);

    // console.log(
    //   prayer.name,
    //   "Prayer:",
    //   prayer.time.toLocaleTimeString(),
    //   "Reminder:",
    //   reminderTime.toLocaleTimeString(),
    //   "Current:",
    //   currentTime.toLocaleTimeString(),
    // );
    if (
      currentTime.getHours() === reminderTime.getHours() &&
      currentTime.getMinutes() === reminderTime.getMinutes()
    ) {
      return {
        prayer: prayer.name,
        prayerTime: prayer.time,
        reminderTime,
      };
    }
  }

  return null;
}
