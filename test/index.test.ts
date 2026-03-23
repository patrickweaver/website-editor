import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

const htmlPath = resolve(process.cwd(), "src/index.html");
const html = readFileSync(htmlPath, "utf8");

function renderSourceHtml(): void {
  const parsed = new DOMParser().parseFromString(html, "text/html");
  document.body.innerHTML = parsed.body.innerHTML;
}

describe("src/index.html", () => {
  beforeEach(() => {
    renderSourceHtml();
  });

  test("includes the H1 text in the document", () => {
    expect(
      screen.getByRole("heading", { level: 1, name: "Website" }),
    ).toBeInTheDocument();
  });

  test("sets H1 contentEditable=true after click", async () => {
    await import("../src/main.ts");
    const heading = screen.getByRole("heading", { level: 1, name: "Website" });
    await userEvent.click(heading);
    expect(heading.contentEditable).toBe("true");
  });
});
