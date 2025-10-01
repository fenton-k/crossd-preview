export const config = {
  runtime: "edge",
};

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const tParam = url.searchParams.get("t");
  const timeSeconds = parseInt(tParam || "0", 10);
  const timeFormatted = formatTime(timeSeconds);

  const ogTitle = `You beat the San Fran divides in ${timeFormatted}!`;
  const gameUrl = `https://fenton-k.github.io/crossd/?t=${timeSeconds}`;

  const userAgent = request.headers.get("user-agent") || "";
  const isBot =
    /bot|crawl|spider|twitter|facebook|embed|slack|discord|WhatsApp|iMessage/i.test(
      userAgent
    );

  if (!isBot) {
    return Response.redirect(gameUrl, 302);
  }

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta property="og:title" content="${ogTitle}" />
      <meta property="og:description" content="Try to beat this time!" />
      <meta property="og:url" content="${gameUrl}" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="og:image" content="https://yourdomain.com/default-og-image.png" />
      <title>${ogTitle}</title>
    </head>
    <body>
      <p>Redirecting to the game...</p>
      <script>
        window.location.href = "${gameUrl}";
      </script>
    </body>
    </html>
  `;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
}
