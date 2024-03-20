import * as React from "react";
import styled from "@emotion/styled";

interface IProps {
  secondary?: boolean;
}

const StyledButton = styled.button<IProps>`
  color: #fff;
  background: ${(props) => (props.secondary ? "#777" : "#6485ff")};
  border: none;
  border-radius: 2px;
  cursor: pointer;
  font-size: 0.9rem;
  height: 2.4rem;
  padding: 0 1rem;
  &:disabled {
    opacity: 0.5;
  }
`;

export const Button = (
  props: IProps & React.ButtonHTMLAttributes<HTMLButtonElement>
) => {
  return <StyledButton {...props} />;
};
