import { ForceGraph } from "@/components/ForceGraph";
import { useGetAndFormatGraphData } from "@/hooks/useGetAndFormatGraphData";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
  const test = useGetAndFormatGraphData();
  console.log({ test });
  return (
    <ForceGraph graphData={{ nodes: [{ id: 1 }, { id: 2 }], links: [{ source: 1, target: 2 }] }} />
  );
}
