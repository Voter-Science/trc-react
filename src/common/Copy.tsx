import * as React from "react";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

// Copy is a generic copy component responsible for styling text blocks such as
// paragraphs, lists, block quotes, etc.

interface IProps {
  children: React.ReactNode;
}

interface IContainer {
  alignCenter?: boolean;
  alignRight?: boolean;
  bold?: boolean;
}

const Container = styled.div<IContainer>`
  font-size: 1rem;
  line-height: 1.4;
  margin: 1rem 0;
  *:first-child {
    margin-top: 0;
  }
  *:last-child {
    margin-bottom: 0;
  }
  pre {
    white-space: normal;
  }
  ${(props) =>
    props.alignCenter &&
    css`
      &,
      * {
        text-align: center;
      }
    `}
  ${(props) =>
    props.alignRight &&
    css`
      &,
      * {
        text-align: right;
      }
    `}
  ${(props) =>
    props.bold &&
    css`
      &,
      * {
        font-weight: 600;
      }
    `}
`;

export const Copy = ({ children, ...rest }: IProps & IContainer) => (
  <Container {...rest}>{children}</Container>
);
