import { writeFileSync } from "node:fs";
import { runScenarios } from "../packages/motion/test/morph-reference.ts";

writeFileSync(new URL("../packages/motion/test/fixtures/morph-reference.json", import.meta.url), JSON.stringify(runScenarios()));
