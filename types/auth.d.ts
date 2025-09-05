type User = { id: string; name: string; email: string };

type AuthState = {
  user: User | null;
  status: "idle" | "loading" | "authenticated" | "error";
  error?: string | null;
};