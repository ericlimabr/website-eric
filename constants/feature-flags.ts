// Server-side feature flags. Set ASK_ERIC_ENABLED="true" to re-enable the Ask Eric chat.
export const ASK_ERIC_ENABLED = process.env.ASK_ERIC_ENABLED === "true"
