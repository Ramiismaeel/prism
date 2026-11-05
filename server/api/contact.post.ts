import { contactSchema, fieldErrors } from "#shared/utils/contactSchema";

/**
 * POST /api/contact. Validates with the same Zod schema as the form.
 * 200 { ok: true } on success, 400 with `data.fieldErrors` otherwise.
 * No email is sent: the message is just logged.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => undefined);
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid contact form",
      data: { fieldErrors: fieldErrors(parsed.error) },
    });
  }

  const { name, email, topic, budget, message } = parsed.data;
  console.info("[contact] new message", { name, email, topic, budget, message: message.slice(0, 200) });

  return { ok: true as const };
});
