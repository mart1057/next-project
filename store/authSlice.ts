import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthState = {
  user: null,
  status: "idle",
  error: null,
};

export const login = createAsyncThunk<
  { user: User },
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return rejectWithValue(data?.message || "Login failed");
    }
    const data = await res.json();
    return { user: data.user as User };
  } catch (e) {
    return rejectWithValue("Network error");
  }
});

export const fetchMe = createAsyncThunk<{ user: User }, void, { rejectValue: string }>(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/me");
      if (!res.ok) return rejectWithValue("Unauthenticated");
      const data = await res.json();
      return { user: data.user as User };
    } catch {
      return rejectWithValue("Network error");
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await fetch("/api/logout", { method: "POST" });
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // login
    builder.addCase(login.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.status = "authenticated";
      state.user = action.payload.user;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.status = "error";
      state.error = action.payload ?? "Login failed";
      state.user = null;
    });

    // me
    builder.addCase(fetchMe.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchMe.fulfilled, (state, action) => {
      state.status = "authenticated";
      state.user = action.payload.user;
      state.error = null;
    });
    builder.addCase(fetchMe.rejected, (state) => {
      state.status = "idle";
      state.user = null;
    });

    // logout
    builder.addCase(logout.fulfilled, (state) => {
      state.status = "idle";
      state.user = null;
    });
  },
});

export default authSlice.reducer;
