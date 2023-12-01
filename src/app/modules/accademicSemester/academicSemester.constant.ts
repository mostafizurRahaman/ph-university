import {
  TAcademicSemesterCode,
  TAcademicSemesterCodeNameMapper,
  TAcademicSemesterName,
  TMonth,
} from './academicSemester.interface';

export const months: TMonth[] = [
  'January',
  'February',
  'March',
  'April',
  'June',
  'July',
  'May',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const academicSemesterName: TAcademicSemesterName[] = [
  'Autumn',
  'Summer',
  'Fall',
];

export const academicSemesterCodeNameMapper: TAcademicSemesterCodeNameMapper = {
  Autumn: '01',
  Summer: '02',
  Fall: '03',
};

export const academicSemesterCode: TAcademicSemesterCode[] = ['01', '02', '03'];
