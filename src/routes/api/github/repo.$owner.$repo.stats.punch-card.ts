import { getRepoStatsPunchCard } from "@/server/github/services";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/github/repo/$owner/$repo/stats/punch-card")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          const { owner, repo } = params;
          return Response.json(await getRepoStatsPunchCard(owner, repo));
        } catch (e: any) {
          return new Response(e?.message ?? "Server error", { status: 500 });
        }
      },
    },
  },
});
