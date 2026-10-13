import { describe, it, expect } from "vitest";
import { groupStatus } from "@/lib/project-data";

const t = (status: "Pending" | "In Progress" | "Completed") => ({
  id: "x", title: "t", description: "", status,
});

describe("groupStatus", () => {
  it("is Pending with no tasks", () => expect(groupStatus([])).toBe("Pending"));
  it("is Completed when all done", () =>
    expect(groupStatus([t("Completed"), t("Completed")])).toBe("Completed"));
  it("is In Progress when mixed", () =>
    expect(groupStatus([t("Completed"), t("Pending")])).toBe("In Progress"));
});