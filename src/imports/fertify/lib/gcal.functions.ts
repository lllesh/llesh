import { createServerFn } from "@tanstack/react-start";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_calendar/calendar/v3";

function authHeaders() {
  const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
  const GOOGLE_CALENDAR_API_KEY = process.env.GOOGLE_CALENDAR_API_KEY;
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");
  if (!GOOGLE_CALENDAR_API_KEY) throw new Error("GOOGLE_CALENDAR_API_KEY is not configured");
  return {
    Authorization: `Bearer ${LOVABLE_API_KEY}`,
    "X-Connection-Api-Key": GOOGLE_CALENDAR_API_KEY,
    "Content-Type": "application/json",
  };
}

export const listCalendars = createServerFn({ method: "GET" }).handler(async () => {
  const res = await fetch(`${GATEWAY_URL}/users/me/calendarList`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(`Google Calendar list failed [${res.status}]: ${JSON.stringify(data)}`);
  return (data.items ?? []).map((c: any) => ({
    id: c.id,
    summary: c.summary,
    primary: !!c.primary,
    backgroundColor: c.backgroundColor,
  }));
});

export const listEvents = createServerFn({ method: "GET" })
  .inputValidator((d: { calendarId?: string; timeMin?: string; timeMax?: string }) => d)
  .handler(async ({ data }) => {
    const calendarId = encodeURIComponent(data.calendarId ?? "primary");
    const now = new Date();
    const timeMin = data.timeMin ?? new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
    const timeMax = data.timeMax ?? new Date(now.getFullYear(), now.getMonth() + 2, 0).toISOString();
    const params = new URLSearchParams({
      timeMin,
      timeMax,
      singleEvents: "true",
      orderBy: "startTime",
      maxResults: "250",
    });
    const res = await fetch(`${GATEWAY_URL}/calendars/${calendarId}/events?${params}`, { headers: authHeaders() });
    const json = await res.json();
    if (!res.ok) throw new Error(`Google Calendar events failed [${res.status}]: ${JSON.stringify(json)}`);
    return (json.items ?? []).map((e: any) => ({
      id: e.id,
      summary: e.summary ?? "(sem título)",
      description: e.description ?? "",
      location: e.location ?? "",
      start: e.start?.dateTime ?? e.start?.date,
      end: e.end?.dateTime ?? e.end?.date,
      allDay: !!e.start?.date,
      htmlLink: e.htmlLink,
      status: e.status,
    }));
  });

export const createEvent = createServerFn({ method: "POST" })
  .inputValidator((d: {
    calendarId?: string;
    summary: string;
    description?: string;
    location?: string;
    start: string;
    end: string;
    type?: "exame" | "procedimento" | "transferencia" | "outro";
  }) => d)
  .handler(async ({ data }) => {
    const calendarId = encodeURIComponent(data.calendarId ?? "primary");
    const colorMap: Record<string, string> = {
      exame: "5",
      procedimento: "11",
      transferencia: "10",
      outro: "7",
    };
    const body = {
      summary: data.summary,
      description: data.description,
      location: data.location,
      start: { dateTime: new Date(data.start).toISOString() },
      end: { dateTime: new Date(data.end).toISOString() },
      colorId: colorMap[data.type ?? "outro"],
    };
    const res = await fetch(`${GATEWAY_URL}/calendars/${calendarId}/events`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(`Google Calendar create failed [${res.status}]: ${JSON.stringify(json)}`);
    return { id: json.id, htmlLink: json.htmlLink };
  });