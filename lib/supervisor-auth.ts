import {
  getAccounts,
  saveAccounts,
  setCurrentUser,
} from "@/lib/project-storage";

type Result = { ok: true } | { ok: false; error: string };

function startSession(name: string, email: string) {
  // Same keys that getCurrentUser() reads
  localStorage.setItem("fyp-user-email", email);
  localStorage.setItem("fyp-user-name", name);
  localStorage.setItem("fyp-user-role", "supervisor");
  setCurrentUser({ name, email, role: "supervisor" });
}

export function registerSupervisor(
  name: string,
  email: string,
  password: string,
): Result {
  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanName || !cleanEmail || !password) {
    return { ok: false, error: "Please fill in all fields." };
  }
  if (password.length < 6) {
    return { ok: false, error: "Password must be at least 6 characters." };
  }

  const accounts = getAccounts();
  const exists = accounts.some(
    (a) => a.email.toLowerCase() === cleanEmail && a.role === "supervisor",
  );
  if (exists) {
    return {
      ok: false,
      error: "An account with this email already exists. Use 'Already have an account'.",
    };
  }

  saveAccounts([
    ...accounts,
    { name: cleanName, email: cleanEmail, password, role: "supervisor" },
  ]);
  startSession(cleanName, cleanEmail);
  return { ok: true };
}

export function loginSupervisor(email: string, password: string): Result {
  const cleanEmail = email.trim().toLowerCase();

  const account = getAccounts().find(
    (a) => a.email.toLowerCase() === cleanEmail && a.role === "supervisor",
  );

  if (!account || account.password !== password) {
    return { ok: false, error: "Incorrect email or password." };
  }

  startSession(account.name, account.email);
  return { ok: true };
}

export function logoutSupervisor() {
  localStorage.removeItem("fyp-user-email");
  localStorage.removeItem("fyp-user-name");
  localStorage.removeItem("fyp-user-role");
  setCurrentUser(null);
}