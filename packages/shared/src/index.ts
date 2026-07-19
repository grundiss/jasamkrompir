// Types and utilities shared between the API and the web frontend.

export interface HealthResponse {
  status: 'ok';
  timestamp: string;
}

export interface ApiError {
  error: string;
  message: string;
}

// ---------------------------------------------------------------------------
// Content DTOs (dates are ISO strings over the wire)
//
// The real content model is not designed yet — the app ships at a "Hello World"
// stage. `Greeting` is the single placeholder domain type, carried end-to-end
// through the DB + API + web so every technology stays wired. Replace this with
// the real content model when it exists.
// ---------------------------------------------------------------------------

export interface Greeting {
  id: number;
  text: string;
  createdAt: string;
}

// The API's Hello-World endpoint response.
export interface HelloResponse {
  message: string;
}
