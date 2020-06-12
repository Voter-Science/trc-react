import * as React from 'react';
import styled from '@emotion/styled';

// SelectInput is a generic select component.

interface IProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  label?: string;
  options: any[];
  values?: any[];
}

const Wrapper = styled.div`
  margin: 1rem 0;
  &:first-child {
    margin-top: 0;
  }
  &:last-child {
    margin-bottom: 0;
  }
`;

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

const Select = styled.select`
  border: solid 1px #bbb;
  border-radius: 2px;
  display: block;
  font-size: 1rem;
  height: 2.6rem;
  padding: 0.5rem;
  width: 100%;
`;

export const SelectInput = ({ error, label, options, values, ...rest }: IProps) => (
  <Wrapper>
    {label && (
      <Label>
        {label}:
      </Label>
    )}
    <Select {...rest}>
      <option />
      {options.map((option, i) => (
        <option key={i} value={values ? values[i] : option}>
          {option}
        </option>
      ))}
    </Select>
    {error && (
      <Error>
        {error}
      </Error>
    )}
  </Wrapper>
);
