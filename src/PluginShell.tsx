import * as React from 'react';
import styled from '@emotion/styled';

import { Copy } from './common/Copy';

// PluginShell is the wrapper for the consuming plugin. It includes an header at
// the top of the page, showing the plugin name and a short description with
// useful links.

interface IProps {
  children: React.ReactNode;
  description: React.ReactNode;
  title: string;
}

const Header = styled.header`
  background: #eee;
  padding: 3rem 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 600;
  margin: 0 0 2rem;
`;

export const PluginShell = ({ children, description, title }: IProps) => (
  <main>
    <Header>
      <Title>
        {title}
      </Title>
      <Copy>
        {description}
      </Copy>
    </Header>
    {children}
  </main>
);
