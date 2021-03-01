import * as React from "react";
import styled from "@emotion/styled";

// TextareaInput is a generic textarea input component.

interface IProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
  height?: string;
}

const Error = styled.p`
  color: red;
  font-size: 0.8rem;
  margin: 0.2rem 0 0;
  text-align: right;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  display: block;
  margin-bottom: 0.2rem;
`;

const Input = styled.textarea<{ height: string }>`
  border: solid 1px #bbb;
  border-radius: 2px;
  display: block;
  font-size: 1rem;
  height: ${(props) => (props.height ? props.height : "16rem")};
  padding: 0.5rem;
  width: 100%;
`;

export const TextareaInput = ({ error, label, height, ...rest }: IProps) => (
  <div>
    {label && <Label>{label}:</Label>}
    <Input height={height} {...rest} />
    {error && <Error>{error}</Error>}
  </div>
);
