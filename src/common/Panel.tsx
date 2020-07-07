import * as React from 'react';
import styled from '@emotion/styled';

// Panel is a container for grouping related content.

interface IProps {
  children: React.ReactNode | React.ReactNode[];
}

const Container = styled.div`
  background: #fff;
  border: solid 1px #e9e9e9;
  border-radius: 4px;
  padding: 2rem;
  margin: 2rem auto;
  max-width: 900px;
  > *:first-child {
    margin-top: 0;
  }
  > *:last-child {
    margin-bottom: 0;
  }
`;

export const Panel = ({ children }: IProps) => (
  <Container>
    {children}
  </Container>
);
