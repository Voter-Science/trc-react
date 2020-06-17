import * as React from 'react';
import styled from '@emotion/styled';

// TextareaInput is a generic textarea input component.

interface IProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  label?: string;
}

const Error = styled.p`
  color: red;
  font-size: .8rem;
  margin: .2rem 0 0;
  text-align: right;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  display: block;
  margin-bottom: .2rem;
`;

const Input = styled.textarea`
  border: solid 1px #bbb;
  border-radius: 2px;
  display: block;
  font-size: 1rem;
  height: 16rem;
  padding: 0.5rem;
  width: 100%;
`;

export const TextareaInput = ({ error, label, ...rest }: IProps) => (
  <div>
    {label && (
      <Label>
        {label}:
      </Label>
    )}
    <Input {...rest} />
    {error && (
      <Error>
        {error}
      </Error>
    )}
  </div>
);
