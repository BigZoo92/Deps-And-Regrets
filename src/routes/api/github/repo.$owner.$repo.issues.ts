import { getRepoIssues } from "@/server/github/services";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/github/repo/$owner/$repo/issues")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          const { owner, repo } = params;
          return Response.json(await getRepoIssues(owner, repo));
        } catch (e: any) {
          return new Response(e?.message ?? "Server error", { status: 500 });
        }
      },
    },
  },
});
