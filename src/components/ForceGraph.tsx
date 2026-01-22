import ForceGraph3D, { GraphData, LinkObject, NodeObject } from "react-force-graph-3d";
import { styled } from "styled-components";
import { ClientOnly } from "@tanstack/react-router";

export const ForceGraph = ({
  graphData,
}: {
  graphData: GraphData<NodeObject<any>, LinkObject<any, any>>;
}) => {
  return (
    <ClientOnly>
      <Container>
        <ForceGraph3D graphData={graphData} />
      </Container>
    </ClientOnly>
  );
};

const Container = styled.div`
  height: 100dvh;
  width: 100dvw;
  display: flex;
  justify-content: center;
  align-items: center;
`;
