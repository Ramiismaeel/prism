import { z } from "zod";

// Shared by the contact page (per-step validation) and server/api/contact.post.ts,
// so client and server always agree on what a valid message is.

export const TOPICS = {
  branding: "Branding",
  web: "Website or product",
  motion: "Motion & animation",
  strategy: "Strategy",
  other: "Something else",
} as const;

export const BUDGETS = {
  small: "Under $5k",
  medium: "$5k – $15k",
  large: "$15k – $50k",
  xl: "$50k+",
} as const;

type Keys<T> = [keyof T & string, ...(keyof T & string)[]];
const keys = <T extends object>(o: T) => Object.keys(o) as Keys<T>;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please tell us your name (at least 2 characters).").max(80, "That name is a bit long (80 characters max)."),
  email: z.string().trim().pipe(z.email("Please enter a valid email address.")),
  topic: z.enum(keys(TOPICS), { error: "Please pick a topic." }),
  budget: z.enum(keys(BUDGETS), { error: "Please pick a budget range." }),
  message: z
    .string()
    .trim()
    .min(20, "Tell us a little more (at least 20 characters).")
    .max(2000, "Please keep it under 2000 characters."),
  consent: z.literal(true, { error: "Please agree so we can reply to you." }),
});

export type ContactForm = z.infer<typeof contactSchema>;
export type ContactField = keyof ContactForm;

/** Which fields each form step owns, in order. */
export const CONTACT_STEPS: { title: string; fields: ContactField[] }[] = [
  { title: "About you", fields: ["name", "email"] },
  { title: "Your project", fields: ["topic", "budget"] },
  { title: "Your message", fields: ["message", "consent"] },
];

/** First error message per field, e.g. `{ email: "Please enter a valid email address." }`. */
export function fieldErrors(error: z.ZodError): Partial<Record<ContactField, string>> {
  const out: Partial<Record<ContactField, string>> = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as ContactField;
    out[field] ??= issue.message;
  }
  return out;
}
