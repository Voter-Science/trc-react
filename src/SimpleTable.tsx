import * as React from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";

import { SheetContents, ISheetContents } from "trc-sheet/sheetContents";

import { HorizontalList } from "./common/HorizontalList";
import { DownloadCsv } from "./DownloadCsv";

import reorderISheetColumns from "./utils/reorderISheetColumns";

// Render <Table> around a basic ISheetContents.
// Readonly.

interface IProps {
  data: ISheetContents;
  downloadIcon?: boolean;
  onRowClick?: (recId: string) => void;
  selectedRows?: { [dynamic: string]: boolean };
  defaultSortBy?: string;
  columnsOrdering?: string[];
  hasFullScreen?: boolean;
  hasColumnFiltering?: boolean;
}

interface TrProps {
  highlight?: boolean;
}

const FullScreenWrapper = styled.div<{ fullScreen: boolean }>`
  margin: 1rem 0;
  ${(props) =>
    props.fullScreen &&
    css`
      margin: 0;
      background: #fff;
      padding: 2rem;
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
    `}
`;

const FullScreenActions = styled.div`
  height: 30px;
  text-align: right;
`;

const Action = styled.button`
  font-size: 14px;
  border: none;
  background: none;
  color: #6485ff;
  font-weight: 600;
  padding: 0;
  margin-left: 2rem;
  cursor: pointer;
  &:focus,
  &:active {
    outline: none;
  }
`;

const TableWrapper = styled.div<{ fullScreen: boolean }>`
  overflow: auto;
  ${(props) =>
    props.fullScreen &&
    css`
      height: calc(100% - 30px);
    `}
`;

const Table = styled.table`
  border: none;
  border-collapse: collapse;
  padding: 5px;
  width: 100%;
`;

const Tr = styled.tr<TrProps>`
  border: solid 1px #e9e9e9;
  border-left: none;
  border-right: none;
  cursor: pointer;
  ${(props) =>
    props.highlight &&
    css`
      background: #f0f0f0;
    `}
  &:hover {
    background: #f8f8f8;
    ${(props) =>
      props.highlight &&
      css`
        background: #f0f0f0;
      `}
  }
`;

const Th = styled.th<{
  isSorter: boolean;
  sortingOrder: string;
  columnFiltering: boolean;
}>`
  background: #6485ff;
  color: #fff;
  cursor: pointer;
  font-weight: 500;
  padding: 1rem 1rem 2rem 1rem;
  position: relative;
  text-align: left;
  vertical-align: middle;
  > span:after {
    content: "▾";
    ${(props) =>
      props.sortingOrder === "DSC" &&
      css`
        content: "▴";
      `};
    margin-left: 0.5rem;
    visibility: hidden;
  }
  &:hover {
    background: #5c7df2;
    &:after {
      opacity: ${(props) => (props.isSorter ? 1 : 0.5)};
      visibility: visible;
    }
  }
  ${(props) =>
    props.isSorter &&
    css`
      span:after {
        visibility: visible;
      }
    `}
  ${(props) =>
    !props.columnFiltering &&
    css`
      padding: 1rem;
    `}
  > input {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.8);
    background: transparent;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 5px;
    width: calc(100% - 1.4rem);
    border: none;
    padding: 3px 0.3rem;
    border-bottom: solid 1px #3655c4;
    &::placeholder {
      color: rgba(255, 255, 255, 0.4);
      font-style: italic;
    }
    &:focus,
    &:active {
      outline: none;
    }
  }
`;

const Td = styled.td`
  padding: 1rem;
  vertical-align: top;
  white-space: nowrap;
`;

export function SimpleTable({
  data,
  downloadIcon,
  onRowClick,
  selectedRows,
  defaultSortBy,
  columnsOrdering,
  hasFullScreen,
  hasColumnFiltering,
}: IProps) {
  let columns = Object.keys(data);
  const colFilters: { [dynamic: string]: string } = {};
  columns.forEach((col) => (colFilters[col] = ""));

  const [fullScreen, setFullScreen] = React.useState(false);
  const [columnFilters, setColumnFilters] = React.useState(colFilters);

  const originalData = JSON.parse(JSON.stringify(data));

  if (columnsOrdering) {
    data = reorderISheetColumns(
      JSON.parse(JSON.stringify(data)),
      columnsOrdering
    );
    columns = Object.keys(data);
  }

  // Filter by column filter
  columns.forEach((col) => {
    if (columnFilters[col]) {
      const regex = new RegExp(columnFilters[col], "i");
      const allIndexes: number[] = [];
      data[col].forEach((entry, index) => {
        if (regex.test(entry)) {
          allIndexes.push(index);
        }
      });
      const newData: { [dynamic: string]: any[] } = {};
      columns.forEach((col) => {
        newData[col] = [];
        allIndexes.forEach((indx) => {
          newData[col].push(data[col][indx]);
        });
      });
      data = { ...newData };
    }
  });

  let defaultSortByIndex;
  if (defaultSortBy) {
    defaultSortByIndex = Object.keys(data).findIndex(
      (x) => x === defaultSortBy
    );
  }

  const [sorter, setSorter] = React.useState(defaultSortByIndex || 0);
  const [sortingOrder, setSortingOrder] = React.useState("ASC");

  function onHeaderClick(i: number) {
    if (sorter === i) {
      const newSortingOrder = sortingOrder === "ASC" ? "DSC" : "ASC";
      setSortingOrder(newSortingOrder);
    } else {
      setSorter(i);
    }
  }

  if (!data) {
    return <p>No results.</p>;
  }

  const headers: string[] = Object.keys(data);

  // Data is grouped by row, instead of being grouped by header.
  //
  // Example:
  // [
  //   ['Angelina', 'Camel', 'F', '55044'],
  //   ['Jerald', 'Ditto', 'M', '55044'],
  //   ['Nickolas', 'Alphonse', 'M', '55044']
  // ]
  const normalizedData: any[][] = data[headers[0]].map((_, i) => {
    return headers.map((header) => data[header][i]);
  });

  // Sort data
  const isSorterNumeric = !normalizedData
    .filter((entry) => Boolean(entry[sorter]))
    .some((entry) => isNaN(entry[sorter]));

  if (isSorterNumeric) {
    normalizedData.sort((a, b) => {
      if (!a[sorter] || !b[sorter]) {
        return -1;
      }
      return sortingOrder === "ASC"
        ? a[sorter] - b[sorter]
        : b[sorter] - a[sorter];
    });
  } else {
    normalizedData.sort((a, b) => {
      return a[sorter] < b[sorter]
        ? sortingOrder === "ASC"
          ? -1
          : 1
        : sortingOrder === "DSC"
        ? -1
        : 1;
    });
  }

  return (
    <>
      <FullScreenWrapper fullScreen={fullScreen}>
        {hasFullScreen && (
          <FullScreenActions>
            {hasColumnFiltering && (
              <Action
                type="button"
                onClick={() => {
                  const columnFiltersCopy = { ...columnFilters };
                  columns.forEach((col) => (columnFiltersCopy[col] = ""));
                  setColumnFilters(columnFiltersCopy);
                }}
              >
                Clear filters &#8861;
              </Action>
            )}
            <Action type="button" onClick={() => setFullScreen(!fullScreen)}>
              {fullScreen ? <>Collapse &#10066;</> : <>Full screen &#10063;</>}
            </Action>
          </FullScreenActions>
        )}
        <TableWrapper fullScreen={fullScreen}>
          <Table>
            <thead>
              <Tr>
                {headers.map((header, i) => (
                  <Th
                    key={header}
                    isSorter={header === headers[sorter]}
                    sortingOrder={sortingOrder}
                    onClick={() => onHeaderClick(i)}
                    columnFiltering={hasColumnFiltering}
                  >
                    <span>{header}</span>
                    {hasColumnFiltering && (
                      <input
                        type="text"
                        placeholder="Filter"
                        onClick={(e) => e.stopPropagation()}
                        value={columnFilters[header]}
                        onChange={(e) => {
                          const columnFiltersCopy = { ...columnFilters };
                          columnFiltersCopy[header] = e.target.value;
                          setColumnFilters(columnFiltersCopy);
                        }}
                      />
                    )}
                  </Th>
                ))}
              </Tr>
            </thead>
            <tbody>
              {normalizedData.slice(0, 500).map((row, i) => (
                <Tr
                  key={`r${i}`}
                  onClick={() => {
                    const firstKey = Object.keys(originalData)[0];
                    const dataKeys = Object.keys(data);
                    const firstKeyIndex = dataKeys.findIndex(
                      (x) => x === firstKey
                    );
                    onRowClick(row[firstKeyIndex]);
                  }}
                  highlight={selectedRows && selectedRows[row[0]]}
                >
                  {row.map((field, j) => (
                    <Td key={`${i}_${j}`}>{field}</Td>
                  ))}
                </Tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      </FullScreenWrapper>
      {downloadIcon && (
        <HorizontalList alignRight>
          <DownloadCsv data={data} />
        </HorizontalList>
      )}
    </>
  );
}
