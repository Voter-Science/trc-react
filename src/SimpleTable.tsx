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
}

interface TrProps {
  highlight?: boolean;
}

const TableWrapper = styled.div`
  overflow-x: auto;
  margin: 1rem 0;
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

const Th = styled.th<{ isSorter: boolean; sortingOrder: string }>`
  background: #6485ff;
  color: #fff;
  cursor: pointer;
  font-weight: 500;
  padding: 1rem;
  text-align: left;
  vertical-align: middle;
  &:after {
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
      &:after {
        visibility: visible;
      }
    `}
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
}: IProps) {
  const originalData = JSON.parse(JSON.stringify(data));

  if (columnsOrdering) {
    data = reorderISheetColumns(
      JSON.parse(JSON.stringify(data)),
      columnsOrdering
    );
  }

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
      <TableWrapper>
        <Table>
          <thead>
            <Tr>
              {headers.map((header, i) => (
                <Th
                  key={header}
                  isSorter={header === headers[sorter]}
                  sortingOrder={sortingOrder}
                  onClick={() => onHeaderClick(i)}
                >
                  {header}
                </Th>
              ))}
            </Tr>
          </thead>
          <tbody>
            {normalizedData.map((row, i) => (
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
      {downloadIcon && (
        <HorizontalList alignRight>
          <DownloadCsv data={data} />
        </HorizontalList>
      )}
    </>
  );
}
