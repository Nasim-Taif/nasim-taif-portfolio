export function GET() {
  return Response.json(
    {
      status: "ok",
      service: "nasim-taif-portfolio",
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
