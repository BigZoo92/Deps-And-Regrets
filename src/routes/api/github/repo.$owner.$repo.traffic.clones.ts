import { getRepoTrafficClones } from "@/server/github/services";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/github/repo/$owner/$repo/traffic/clones")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          const { owner, repo } = params;
          return Response.json(await getRepoTrafficClones(owner, repo));
        } catch (e: any) {
          return new Response(e?.message ?? "Server error", { status: 500 });
        }
      },
    },
  },
});
