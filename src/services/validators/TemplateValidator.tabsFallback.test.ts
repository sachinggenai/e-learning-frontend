import { TemplateValidator } from "./TemplateValidator";

describe("TemplateValidator tabs fallback", () => {
  const validator = new TemplateValidator();

  it("does not raise tabs-empty error when tabs exist in component data", async () => {
    const result = await validator.validate({
      pages: [
        {
          templateType: "tabs",
          content: {},
          components: [
            {
              componentType: "tabs",
              data: {
                tabs: [{ title: "Tab 1", body: "Body 1" }],
              },
            },
          ],
        },
      ],
    } as any);

    const hasTabsEmptyError = result.errors.some(
      (error) => error.field === "pages[0].content.tabs"
    );

    expect(hasTabsEmptyError).toBe(false);
  });

  it("keeps tabs-empty error when no tabs exist in content or component data", async () => {
    const result = await validator.validate({
      pages: [
        {
          templateType: "tabs",
          content: {},
          components: [
            {
              componentType: "tabs",
              data: {},
            },
          ],
        },
      ],
    } as any);

    const hasTabsEmptyError = result.errors.some(
      (error) => error.field === "pages[0].content.tabs"
    );

    expect(hasTabsEmptyError).toBe(true);
  });
});
