import { listMyRepos } from "@/server/github/services";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/github/my-repos")({
  server: {
    handlers: {
      GET: async () => {
        try {
          return Response.json(await listMyRepos());
        } catch (e: any) {
          return new Response(e?.message ?? "Server error", { status: 500 });
        }
      },
    },
  },
});
