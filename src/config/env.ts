/**
 * Centralized access to the frontend environment variables.
 * Anything exposed to the browser must use the VITE_ prefix (Vite rule).
 */
export const env = {
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "",
  /**
   * Base URL of the backend (no trailing slash). Empty in local dev, so calls
   * stay relative and go through the Vite proxy; set it in production.
   */
  apiUrl: (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, ""),
};

/** True when a Client ID is configured to enable Google sign-in. */
export const isGoogleEnabled = env.googleClientId.length > 0;
