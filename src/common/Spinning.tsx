import * as React from "react";
import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";

// A full page loading spinner.

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(359deg); }
`;

const Container = styled.div`
  align-items: center;
  background: #fdfdfd;
  bottom: 0;
  display: flex;
  left: 0;
  justify-content: center;
  position: fixed;
  right: 0;
  top: 0;
`;

const Spinner = styled.div`
  animation: ${rotate} 0.6s infinite linear;
  border: solid 4px #bac9ff;
  border-radius: 50%;
  border-top-color: #6485ff;
  width: 32px;
  height: 32px;
`;

export const Spinning = () => (
  <Container>
    <Spinner />
  </Container>
);
