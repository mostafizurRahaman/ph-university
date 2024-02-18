const calculateGradePoints = (totalMarks: number) => {
  // ** Define a result :
  let result = {
    grade: 'N/A',
    gradePoints: 0.0,
  };

  if (totalMarks >= 0 && totalMarks <= 20) {
    result = {
      grade: 'F',
      gradePoints: 0.0,
    };
  } else if (totalMarks >= 21 && totalMarks <= 40) {
    result = {
      grade: 'D',
      gradePoints: 2.0,
    };
  } else if (totalMarks >= 41 && totalMarks <= 60) {
    result = {
      grade: 'C',
      gradePoints: 3.0,
    };
  } else if (totalMarks >= 61 && totalMarks <= 80) {
    result = {
      grade: 'B',
      gradePoints: 3.5,
    };
  } else if (totalMarks >= 81 && totalMarks <= 100) {
    result = {
      grade: 'A',
      gradePoints: 4.0,
    };
  } else {
    result = {
      grade: 'N/A',
      gradePoints: 0.0,
    };
  }

  return result;
};

export default calculateGradePoints;
