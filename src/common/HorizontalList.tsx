import * as React from 'react';
import { css } from "@emotion/core";
import styled from '@emotion/styled';

// HorizontalList is a component that takes an array of arbitrary react nodes,
// and places them on a single row horizontally.

interface IProps {
  children: React.ReactNode | React.ReactNode[];
}

interface IListProps {
  alignRight?: boolean;
  responsiveBreakpoint?: number;
}

const List = styled.ul<IListProps>`
  display: flex;
  justify-content: ${props => props.alignRight ? 'flex-end' : 'flex-start'};
  list-style-type: none;
  margin: 1rem 0;
  padding: 0;
  &:first-child {
    margin-top: 0;
  }
  &:last-child {
    margin-bottom: 0;
  }
  ${props => props.responsiveBreakpoint && css`
    @media (max-width: ${props.responsiveBreakpoint}px) {
      flex-direction: column;
    }
  `}
`;

const Item = styled.li`
  margin: 0 .8rem;
  &:first-child {
    margin-left: 0;
  }
  &:last-child {
    margin-right: 0;
  }
`;

export const HorizontalList = ({ alignRight, children, responsiveBreakpoint }: IProps & IListProps) => {
  const childrenArray = Array.isArray(children) ? children : [children];

  return (
    <List alignRight={alignRight} responsiveBreakpoint={responsiveBreakpoint}>
      {childrenArray.map((child, i) => (
        <Item key={i}>
          {child}
        </Item>
      ))}
    </List>
  )
};
