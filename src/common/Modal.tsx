import * as React from "react";
import styled from "@emotion/styled";

interface IProps {
  close(): void;
  children: any;
  maxWidth?: string;
  zIndex?: number;
}

const Scroller = styled.div<{ zIndex: number }>`
  overflow-y: auto;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  z-index: ${(props) => props.zIndex};
  transform: translate3d(0, 0, 0);
`;

const Wrapper = styled.div`
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  min-height: 100%;
`;

const Content = styled.div<{ maxWidth: string }>`
  background: #fff;
  padding: 2rem;
  position: relative;
  max-width: ${(props) => props.maxWidth};
`;

const Close = styled.button`
  background: #fff;
  border: none;
  position: absolute;
  font-weight: 500;
  top: -19px;
  right: 0;
  font-size: 13px;
  padding: 3px 10px;
`;

export default ({
  close,
  children,
  maxWidth = "35rem",
  zIndex = 50,
}: IProps) => {
  return (
    <Scroller zIndex={zIndex}>
      <Wrapper>
        <Content maxWidth={maxWidth}>
          <Close onClick={close}>Close</Close>
          <div>{children}</div>
        </Content>
      </Wrapper>
    </Scroller>
  );
};
