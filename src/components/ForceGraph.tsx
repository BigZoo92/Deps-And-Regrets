import ForceGraph3D from "react-force-graph-3d";

export const ForceGraph = () => {
  return (
    <ForceGraph3D
      graphData={{ nodes: [{ id: 1 }, { id: 2 }], links: [{ source: 1, target: 2 }] }}
    />
  );
};
