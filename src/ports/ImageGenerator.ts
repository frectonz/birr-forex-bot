import { readFileSync } from "fs";
import { CurrencyData } from "../domain";

export type Themes = Map<
  ThemeType,
  {
    name: string;
    preview: string;
    template: string;
  }
>;

export const themes: Themes = new Map([
  [
    "dark",
    {
      name: "Dark Big",
      preview: "./templates/preview-dark.png",
      template: readFileSync("./templates/dark.svg", "utf-8"),
    },
  ],
  [
    "light",
    {
      name: "Light Big",
      preview: "./templates/preview-light.png",
      template: readFileSync("./templates/light.svg", "utf-8"),
    },
  ],
]);

export type ThemeType = "light" | "dark";

export interface ImageGenerator {
  generateForExImage(data: CurrencyData, theme: ThemeType): Promise<string>;
}
