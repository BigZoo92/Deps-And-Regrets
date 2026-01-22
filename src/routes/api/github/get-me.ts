import { getMe } from "@/server/github/services";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/github/get-me")({
  server: {
    handlers: {
      GET: async () => {
        try {
          return Response.json(await getMe());
        } catch (e: any) {
          return new Response(e?.message ?? "Server error", { status: 500 });
        }
      },
    },
  },
});
