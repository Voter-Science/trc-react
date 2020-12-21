import styled from "@emotion/styled";

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  secondary?: boolean;
}

export const Button = styled.button<IProps>`
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
