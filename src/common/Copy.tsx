import * as React from 'react';
import styled from '@emotion/styled';

// Copy is a generic copy component responsible for styling text blocks such as
// paragraphs, lists, block quotes, etc.

interface IProps {
  children: React.ReactNode;
}

const Container = styled.div`
  font-size: 1rem;
  line-height: 1.4;
  *:first-child {
    margin-top: 0;
  }
  *:last-child {
    margin-top: 0;
  }
  a {
    color: inherit;
  }
`;

export const Copy = ({ children }: IProps) => (
  <Container>
    {children}
  </Container>
);
