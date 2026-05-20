import express from "express";
import { calculateBmi } from "./bmiCalculator.ts";
import { calculateExercise } from "./exerciseCalculator.ts";

const app = express();
app.use(express.json());

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const height = req.query.height as string;
  const weight = req.query.weight as string;
  if (!height || !weight) {
    res.status(400).json({ error: "malformatted parameters" });
  } else if (isNaN(Number(height)) || isNaN(Number(weight))) {
    res.status(400).json({ error: "malformatted parameters" });
  }
  try {
    res.json({
      weight: Number(weight),
      height: Number(height),
      bmi: calculateBmi(Number(height), Number(weight)),
    });
  } catch (error: unknown) {
    if (error instanceof Error) res.status(404).json({ error: error.message });
  }
});

app.post("/exercises", (req, res) => {
  const body: unknown = req.body;
  if (!isRecord(body) || !("daily_exercises" in body) || !("target" in body)) {
    return res.status(400).send({ error: "parameters missing" });
  }

  const { target, daily_exercises } = body;
  if (
    typeof target !== "number" ||
    Number.isNaN(target) ||
    !Array.isArray(daily_exercises) ||
    !daily_exercises.every(
      (num): num is number => typeof num === "number" && !Number.isNaN(num),
    )
  ) {
    return res.status(400).json({ error: "malformatted parameters" });
  }
  return res.json(calculateExercise(daily_exercises, target));
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
