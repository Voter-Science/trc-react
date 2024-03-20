import { keyframes } from "@emotion/react";
import styled from "@emotion/styled";
import * as React from "react";

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(359deg); }
`;

// Small spinner control (like <div>).
// Useful for individual components
// Whereas  <Spinning> takes over entire page .
const SpinnerSmallDiv = styled.div`
  animation: ${rotate} 0.6s infinite linear;
  border: solid 4px #bac9ff;
  border-radius: 50%;
  border-top-color: #6485ff;
  width: 32px;
  height: 32px;
`;

export const SpinnerSmall = () => <SpinnerSmallDiv />;
