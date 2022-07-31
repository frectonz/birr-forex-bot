import { readFileSync } from "fs";
import { CurrencyData } from "../domain";

export type ThemeType = "light" | "dark" | "light-small" | "dark-small";

export type ThemeInfo = {
  name: string;
  preview: string;
  template: string;
  width: number;
  height: number;
};

export type Themes = Map<ThemeType, ThemeInfo>;

export const themes: Themes = new Map([
  [
    "dark",
    {
      name: "Dark Big",
      preview: "./assets/preview/dark.png",
      template: readFileSync("./assets/templates/dark.svg", "utf-8"),
      width: 2000,
      height: 1500,
    },
  ],
  [
    "light",
    {
      name: "Light Big",
      preview: "./assets/preview/light.png",
      template: readFileSync("./assets/templates/light.svg", "utf-8"),
      width: 2000,
      height: 1500,
    },
  ],
  [
    "light-small",
    {
      name: "Light Small",
      preview: "./assets/preview/light-small.png",
      template: readFileSync("./assets/templates/light-small.svg", "utf-8"),
      width: 1000,
      height: 1500,
    },
  ],
  [
    "dark-small",
    {
      name: "Dark Small",
      preview: "./assets/preview/dark-small.png",
      template: readFileSync("./assets/templates/dark-small.svg", "utf-8"),
      width: 1000,
      height: 1500,
    },
  ],
]);

export interface ImageGenerator {
  generateForExImage(data: CurrencyData, theme: ThemeType): Promise<string>;
}
