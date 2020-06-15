import * as React from 'react';
import styled from '@emotion/styled';

// DescriptionList is a component to display a list of labels, and their
// respective description.

type Entry = [string, string | React.ReactNode];

interface IProps {
  entries: Entry[];
}

const List = styled.dl`
  display: grid;
  grid-column-gap: 1rem;
  grid-row-gap: .5rem;
  grid-template-columns: 1fr 3fr;
  list-style-type: none;
  margin: 1rem 0;
  padding: 0;
`;

const Title = styled.dt`
  font-weight: 600;
`;

const Description = styled.dd`
  font-style: italic;
`;

export const DescriptionList = ({ entries }: IProps) => {
  return (
    <List>
      {entries.map(entry => {
        const [title, description] = entry;

        return (
          <React.Fragment key={title}>
            <Title>
              {title}:
            </Title>
            <Description>
              {description}
            </Description>
          </React.Fragment>
        );
      })}
    </List>
  )
};
