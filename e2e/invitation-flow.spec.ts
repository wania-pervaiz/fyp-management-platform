import { test, expect } from "@playwright/test";

test("student invites a new supervisor who accepts", async ({ page }) => {
  // Student creates a project
  await page.goto("/project-management?view=create");
  await page.getByPlaceholder("Member 1 name").fill("Test Student");
  await page.getByPlaceholder("Email").nth(0).fill("student@example.com");
  await page.getByPlaceholder("Supervisor 1 name").fill("Dr. New");
  await page.getByPlaceholder("Email").nth(1).fill("newsup@example.com");
  await page.getByRole("button", { name: "Create Project" }).click();
  await expect(page).toHaveURL(/student\/project/, { timeout: 10_000 });

  // New supervisor signs up and accepts
  await page.goto("/supervisor/dashboard");
  await page.getByRole("button", { name: "Sign In" }).first().click();
  const dialog = page.getByRole("dialog");
  await dialog.getByPlaceholder("Dr. Ahmed").fill("Dr. New");
  await dialog.getByPlaceholder("supervisor@example.com").fill("newsup@example.com");
  await dialog.getByPlaceholder("At least 6 characters").fill("secret123");
  await dialog.getByRole("button", { name: "Sign In" }).click();

  await expect(page.getByRole("button", { name: "Accept" })).toBeVisible();
  await page.getByRole("button", { name: "Accept" }).click();
  await expect(page.getByRole("heading", { name: "Student Attendance Management System" })).toBeVisible();
});