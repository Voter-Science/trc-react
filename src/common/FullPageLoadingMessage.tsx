import * as React from "react";
import { keyframes } from "@emotion/core";
import styled from "@emotion/styled";

interface IProps {
  title?: string;
  message?: string;
  zIndex?: number;
}

const dots = keyframes`
  0% { content: '.'; }
  33% { content: '..'; }
  66% { content: '...'; }
`;

const Container = styled.div<{ zIndex: number }>`
  align-items: center;
  background: rgba(0, 0, 0, 0.75);
  bottom: 0;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: ${(props) => props.zIndex};
`;

const MainMessage = styled.p`
  font-weight: 600;
  font-size: 16px;
  position: relative;
  &:after {
    animation: ${dots} 2s linear infinite;
    content: "";
    position: absolute;
    left: 100%;
  }
`;

const SecondaryMessage = styled.p`
  font-size: 13px;
`;

export function FullPageLoadingMessage({
  title,
  message,
  zIndex = 100,
}: IProps) {
  return (
    <Container zIndex={zIndex}>
      <MainMessage>{title || "Loading data"}</MainMessage>
      <SecondaryMessage>
        {message || "Please wait, this could take up to 30 seconds."}
      </SecondaryMessage>
    </Container>
  );
}
