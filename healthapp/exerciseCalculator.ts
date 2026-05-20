interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

interface Exercises {
  target: number;
  daily: number[];
}

const parseArguments = (args: string[]): Exercises => {
  if (args.length < 4) throw new Error("Not enough arguments");

  const target = Number(args[2]);
  const daily = args.slice(3).map((arg) => Number(arg));

  if (isNaN(target) || daily.some((day) => isNaN(day))) {
    throw new Error("Provided arguments are not numbers");
  }

  return {
    target,
    daily,
  };
};

export const calculateExercise = (
  dailyExercises: number[],
  target: number,
): ExerciseResult => {
  const periodLength = dailyExercises.length;
  const trainingDays = dailyExercises.filter((d) => d > 0).length;
  const average =
    dailyExercises.reduce((accumulator, current) => {
      return accumulator + current;
    }) / periodLength;

  const percentage = average / target;
  let rating: number;
  let ratingDescription: string;

  if (percentage < 0.5) {
    rating = 1;
    ratingDescription = "Not met the target. Need to improve";
  } else if (percentage < 1) {
    rating = 2;
    ratingDescription = "Not bad, but could be a bit better";
  } else {
    rating = 3;
    ratingDescription = "Perfect! Exceeding Expectations!";
  }

  return {
    periodLength,
    trainingDays,
    success: percentage >= 1,
    rating,
    ratingDescription,
    target,
    average,
  };
};

try {
  if (process.argv[1] === import.meta.filename) {
    const { target, daily } = parseArguments(process.argv);
    console.log(calculateExercise(daily, target));
  }
} catch (error: unknown) {
  let errorMessage = "Something bad happened.";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }
  console.log(errorMessage);
}
