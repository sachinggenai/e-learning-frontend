import {
  mapTemplateDtoToVm,
  mapTemplateList,
  TemplateDTO,
} from "../../adapters/templateAdapter";

describe("templateAdapter", () => {
  const introDto: TemplateDTO = {
    id: "template_intro_001",
    name: "Course Introduction",
    description: "Welcome page",
    category: "introduction",
    fields: [
      {
        id: "course_title",
        name: "courseTitle",
        type: "text",
        label: "Course Title",
        required: true,
      },
    ],
  };

  const mcqDto: TemplateDTO = {
    id: "template_assessment_001",
    name: "Quiz Assessment",
    description: "Multiple choice quiz",
    category: "assessment",
    fields: [
      {
        id: "quiz_title",
        name: "quizTitle",
        type: "text",
        label: "Quiz Title",
        required: true,
      },
    ],
  };

  it("maps introduction template to VM with content-text defaults", () => {
    const vm = mapTemplateDtoToVm(introDto);
    expect(vm.type).toBe("content-text");
    expect(vm.defaults.content).toBeDefined();
    expect(vm.defaults.title).toBe("Course Introduction");
  });

  it("maps assessment template to VM with mcq defaults", () => {
    const vm = mapTemplateDtoToVm(mcqDto);
    expect(vm.type).toBe("mcq");
    expect(vm.defaults.question).toBeDefined();
    expect(Array.isArray(vm.defaults.options)).toBe(true);
    expect(vm.defaults.options.length).toBe(4);
  });

  it("bulk maps list", () => {
    const list = mapTemplateList([introDto, mcqDto]);
    expect(list.length).toBe(2);
    expect(list[1].type).toBe("mcq");
  });
});
