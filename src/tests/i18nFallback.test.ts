import { t } from "../i18n/strings";

describe("i18n fallback behavior", () => {
  test("returns key when missing and no explicit fallback", () => {
    const key = "non.existent.translation.key";
    const value = t(key);
    expect(value).toBe(key);
  });

  test("returns provided fallback when missing", () => {
    const key = "another.missing.key";
    const fallback = "Custom Fallback";
    const value = t(key, fallback);
    expect(value).toBe(fallback);
  });

  test("returns actual translation for existing key", () => {
    const key = "menu.file";
    const value = t(key);
    expect(value).toBe("File");
  });
});
