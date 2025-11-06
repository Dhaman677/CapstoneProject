// api/jest.config.ts
import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
  setupFilesAfterEnv: ["<rootDir>/test/setup.ts"],
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  maxWorkers: 1,         // windows + mongodb-memory-server behaves better single-threaded
  testTimeout: 120000,   // global test timeout
};

export default config;
