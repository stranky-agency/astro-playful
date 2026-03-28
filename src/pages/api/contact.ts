import type { APIRoute } from 'astro';

// Email klienta — PŘEPIŠ pro každý projekt
const TO_EMAIL = 'info@klient.cz';
// Jméno firmy — pro subject emailu
const FIRMA = 'Název Firmy';

export const POST: APIRoute = async ({ request }) => {
  const data = await request.formData();
  const jmeno  = data.get('jmeno')?.toString().trim() ?? '';
  const email  = data.get('email')?.toString().trim() ?? '';
  const telefon = data.get('telefon')?.toString().trim() ?? '';
  const zprava = data.get('zprava')?.toString().trim() ?? '';

  if (!jmeno || !email || !zprava) {
    return new Response(JSON.stringify({ ok: false, error: 'Chybí povinná pole.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = import.meta.env.RESEND_API_KEY;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Kontaktní formulář <onboarding@resend.dev>',
      to: [TO_EMAIL],
      reply_to: email,
      subject: `Nová zpráva z webu — ${FIRMA}`,
      text: `Jméno: ${jmeno}\nE-mail: ${email}\nTelefon: ${telefon || '—'}\n\nZpráva:\n${zprava}`,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Resend error:', err);
    return new Response(JSON.stringify({ ok: false, error: 'Odeslání selhalo. Zkuste to prosím znovu.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
