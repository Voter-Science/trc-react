import * as React from "react";
import styled from "@emotion/styled";

// Grid is a generic grid layout component.

interface IProps {
  children: React.ReactNode[];
}

const Container = styled.div`
  display: grid;
  grid-column-gap: 1rem;
  grid-row-gap: 1rem;
  grid-template-columns: 1fr 1fr;
  margin: 1rem 0;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const Grid = ({ children }: IProps) => (
  <Container>
    {children.map((child, i) => (
      <div key={i}>{child}</div>
    ))}
  </Container>
);
