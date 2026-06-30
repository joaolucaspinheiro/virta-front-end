/**
 * Centralized access to the frontend environment variables.
 * Anything exposed to the browser must use the VITE_ prefix (Vite rule).
 */
export const env = {
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "",
};

/** True when a Client ID is configured to enable Google sign-in. */
export const isGoogleEnabled = env.googleClientId.length > 0;
