import ForceGraph from "react-force-graph-3d";
import { useGetAndFormatGraphData } from "@/hooks/useGetAndFormatGraphData";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
  const { graph } = useGetAndFormatGraphData();
  return <ForceGraph graphData={graph} />;
}
