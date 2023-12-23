import { ISchedule } from './offeredCourses.interface';

// create offered course utils to check time conflicts:

export const hasTimeConflicts = (
  oldSchedules: ISchedule[],
  newSchedule: ISchedule,
) => {
  for (const schedule of oldSchedules) {
    const existingStartTime = new Date(`1970-01-01T${schedule.startTime}`);
    const existingEndTime = new Date(`1970-01-01T${schedule.endTime}`);
    const newStartTime = new Date(`1970-01-01T${newSchedule.startTime}`);
    const newEndTime = new Date(`1970-01-01T${newSchedule.endTime}`);

    if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
      return true;
    }
  }

  return false;
};
