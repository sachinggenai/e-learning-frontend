import axios from "axios";
import { transformCourseForBackend } from "../src/utils/transform";

async function run() {
  const rawCourse = {
    courseId: "int_test_course",
    title: "Integration Test",
    description: "Integration test description",
    author: "Test Author",
    version: "1.0.0",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    templates: [
      {
        id: "t1",
        type: "welcome",
        title: "Welcome",
        order: 0,
        data: { description: "Welcome content" },
      },
      {
        id: "t2",
        type: "content-text",
        title: "Body",
        order: 1,
        data: { body: "Some body content" },
      },
    ],
    assets: [],
    navigation: { allowSkip: true, showProgress: true, lockProgression: false },
    settings: { theme: "default", autoplay: false },
  } as any;

  const backendCourse = transformCourseForBackend(rawCourse);
  const baseURL = process.env.API_URL || "http://localhost:8000/api/v1";

  // Validate
  const validateResp = await axios.post(baseURL + "/export/validate", {
    course: JSON.stringify(backendCourse),
  });
  if (!validateResp.data.success) {
    throw new Error("Validation failed: " + JSON.stringify(validateResp.data));
  }
  console.log(
    "Validation success trace hash:",
    validateResp.data.trace?.course_hash
  );

  // Export
  const exportResp = await axios.post(
    baseURL + "/export",
    { course: JSON.stringify(backendCourse) },
    { responseType: "arraybuffer" }
  );
  if (exportResp.status !== 200) {
    throw new Error("Export failed status=" + exportResp.status);
  }
  console.log("Export succeeded size(bytes):", exportResp.data.byteLength);
}

run().catch((e) => {
  console.error("Integration test failed:", e.response?.data || e.message);
  process.exit(1);
});
