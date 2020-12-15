import * as React from "react";
import styled from "@emotion/styled";

// TabsPanel is a component for organizing content into tabs.

interface IProps {
  children: React.ReactNode[];
  initialTab?: string;
  tabNames: string[];
  onTabClick?(tab: string): void;
}

interface ITabNameProps {
  active: boolean;
}

const Container = styled.div`
  background: #fff;
  border: solid 1px #e9e9e9;
  border-radius: 4px;
  margin: 2rem auto;
  max-width: 900px;
`;

const TabNames = styled.ul`
  border-bottom: solid 2px #6485ff;
  display: flex;
  justify-content: center;
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const TabName = styled.li<ITabNameProps>`
  background: ${(props) => (props.active ? "#6485ff" : "none")};
  color: ${(props) => (props.active ? "#fff" : "inherit")};
  cursor: pointer;
  padding: 1rem 1.5rem;
  &:hover {
    background: ${(props) => (props.active ? "#6485ff" : "#8fa7ff")};
    color: #fff;
  }
`;

const TabContent = styled.div`
  padding: 2rem;
  > *:first-child {
    margin-top: 0;
  }
  > *:last-child {
    margin-bottom: 0;
  }
`;

export const TabsPanel = ({
  children,
  initialTab,
  onTabClick,
  tabNames,
}: IProps) => {
  const [activeTab, setActiveTab] = React.useState(initialTab || tabNames[0]);

  React.useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  return (
    <Container>
      <TabNames>
        {tabNames.map((name) => (
          <TabName
            key={name}
            active={name === activeTab}
            onClick={() => {
              setActiveTab(name);
              if (onTabClick) onTabClick(name);
            }}
          >
            {name}
          </TabName>
        ))}
      </TabNames>
      {children.map((child, i) => (
        <TabContent
          key={i}
          style={{
            display: activeTab === tabNames[i] ? "block" : "none",
          }}
        >
          {child}
        </TabContent>
      ))}
    </Container>
  );
};
