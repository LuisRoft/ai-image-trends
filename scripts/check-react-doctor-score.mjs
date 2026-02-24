import { execSync } from "node:child_process";

const minScore = Number(process.env.REACT_DOCTOR_MIN_SCORE ?? "75");

if (Number.isNaN(minScore) || minScore < 0 || minScore > 100) {
  console.error("Invalid REACT_DOCTOR_MIN_SCORE. Use a number between 0 and 100.");
  process.exit(1);
}

let output = "";

try {
  output = execSync("pnpm react-doctor . --score -y", {
    encoding: "utf8",
    stdio: ["pipe", "pipe", "pipe"],
  });
} catch (error) {
  console.error("React Doctor execution failed.");
  if (error instanceof Error) {
    console.error(error.message);
  }
  process.exit(1);
}

const scoreMatches = output.match(/\b\d{1,3}\b/g) ?? [];
const score = Number(scoreMatches.at(-1));

if (Number.isNaN(score)) {
  console.error("Could not parse React Doctor score output.");
  console.error(output);
  process.exit(1);
}

if (score < minScore) {
  console.error(
    `React Doctor score ${score} is below required minimum ${minScore}. Failing build.`
  );
  process.exit(1);
}

console.log(`React Doctor score ${score} meets minimum ${minScore}.`);
