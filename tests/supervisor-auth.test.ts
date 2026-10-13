import { describe, it, expect } from "vitest";
import { registerSupervisor, loginSupervisor } from "@/lib/supervisor-auth";

describe("supervisor auth", () => {
  it("registers and logs in", () => {
    expect(registerSupervisor("Dr. Test", "t@example.com", "secret1").ok).toBe(true);
    expect(loginSupervisor("t@example.com", "secret1").ok).toBe(true);
  });
  it("rejects a wrong password", () => {
    registerSupervisor("Dr. Test", "t@example.com", "secret1");
    expect(loginSupervisor("t@example.com", "wrong").ok).toBe(false);
  });
  it("rejects short passwords and duplicates", () => {
    expect(registerSupervisor("A", "a@example.com", "123").ok).toBe(false);
    registerSupervisor("A", "a@example.com", "123456");
    expect(registerSupervisor("A", "a@example.com", "123456").ok).toBe(false);
  });
});