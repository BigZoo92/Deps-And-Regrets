import { getRepoContent } from "@/server/github/services";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/github/repo/$owner/$repo/content")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        try {
          const { owner, repo } = params;
          const url = new URL(request.url);
          const path = url.searchParams.get("path");

          if (!path) {
            return new Response("Missing path parameter", { status: 400 });
          }

          return Response.json(await getRepoContent(owner, repo, path));
        } catch (e: any) {
          return new Response(e?.message ?? "Server error", { status: 500 });
        }
      },
    },
  },
});
