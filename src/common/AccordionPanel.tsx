import * as React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

// AccordionPanel is a component for organizing content into expandable sections.

interface IProps {
  children: React.ReactNode[];
  accordionNames: string[];
}

interface IElementsProps {
  active: boolean;
}

const Accordion = styled.ul`
  list-style-type: none;
  margin: 2rem auto;
  max-width: 900px;
  padding: 0;
`;

const Row = styled.li`
  margin-top: 2rem;
`;

const Title = styled.h2<IElementsProps>`
  background: #6485ff;
  border-radius: ${(props) => (props.active ? "4px 4px 0 0" : "4px")};
  color: #fff;
  cursor: pointer;
  font-weight: 500;
  margin: 0;
  padding: 1.5rem;
  &:after {
    content: "+";
    float: right;
    ${(props) =>
      props.active &&
      css`
        content: "−";
      `}
  }
`;

const Content = styled.div<IElementsProps>`
  background: #fff;
  border: solid 1px #e9e9e9;
  border-radius: 0 0 4px 4px;
  display: ${(props) => (props.active ? "block" : "none")};
  padding: 2rem;
  > *:first-child {
    margin-top: 0;
  }
  > *:last-child {
    margin-bottom: 0;
  }
`;

export const AccordionPanel = ({ children, accordionNames }: IProps) => {
    const [activeAccordion, setActiveAccordion] = React.useState<number>(0);

    const handleAccordionClick = (index: number) => {
        setActiveAccordion(index === activeAccordion ? -1 : index);
    };

    return (
        <Accordion>
            {children.map((child, index) => {
            const isActive = index === activeAccordion;

            return (
                child && (
                <Row key={index}>
                    <Title
                    active={isActive}
                    onClick={() => handleAccordionClick(index)}
                    >
                    {accordionNames[index]}
                    </Title>
                    <Content active={isActive}>{child}</Content>
                </Row>
                )
            );
            })}
        </Accordion>
    );
    };

