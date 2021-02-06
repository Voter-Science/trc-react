import * as React from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";

import { SheetContents, ISheetContents } from "trc-sheet/sheetContents";

import { Button } from "./common/Button";
import { HorizontalList } from "./common/HorizontalList";
import { Grid } from "./common/Grid";
import Modal from "./common/Modal";
import { DownloadCsv } from "./DownloadCsv";

import reorderISheetColumns from "./utils/reorderISheetColumns";

// Render <Table> around a basic ISheetContents.
// Readonly.

interface IProps {
  colors?: ISheetContents;
  customColumn?: React.ReactNode;
  data: ISheetContents;
  disableQueryString?: boolean;
  downloadIcon?: boolean;
  onRowClick?: (recId: string) => void;
  rowIdentifier?: number;
  selectedRows?: { [dynamic: string]: boolean };
  defaultSortBy?: string;
  columnsOrdering?: string[];
  hasFullScreen?: boolean;
  hasColumnFiltering?: boolean;
  hasGroupBy?: boolean;
  tableIdentifier?: string;
}

interface TrProps {
  highlight?: boolean;
  separator?: boolean;
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
      z-index: 1000;
    `}
`;

const FullScreenActions = styled.div`
  height: 30px;
  display: flex;
  > p {
    margin: 0;
    font-size: 13px;
    position: relative;
    top: 4px;
  }
  > div {
    text-align: right;
    flex-grow: 1;
  }
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

const GroupBySelect = styled.select`
  color: #6485ff;
  font-size: 14px;
  border: none;
  padding: 0;
  font-weight: 600;
  background: none;
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
  ${(props) =>
    props.highlight &&
    css`
      background: #f0f0f0;
    `}
  ${(props) =>
    props.separator &&
    css`
      cursor: pointer;
      background: #f2f2f2;
      font-weight: 600;
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
  isSorter?: boolean;
  sortingOrder?: string;
  columnFiltering?: boolean;
  collapsed?: boolean;
}>`
  background: #6485ff;
  color: #fff;
  font-weight: 500;
  padding: 1rem 1rem 2rem 1rem;
  position: relative;
  text-align: left;
  vertical-align: middle;
  .header-string {
    display: flex;
  }
  span:first-child {
    flex-grow: 1;
  }
  span:first-child:after {
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
      span:first-child:after {
        visibility: visible;
      }
    `}
  ${(props) =>
    !props.columnFiltering &&
    css`
      padding: 1rem;
    `}
  span {
    cursor: pointer;
  }
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
    padding: 3px 21px 3px 0.3rem;
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
  > button {
    cursor: pointer;
    position: absolute;
    bottom: 10px;
    right: 0.8rem;
    background: #fff;
    border: none;
    padding: 1px 2px;
    border-radius: 2px;
    font-size: 10px;
    opacity: 0.5;
    &:hover {
      opacity: 1;
    }
    &:focus,
    &:active {
      outline: none;
    }
  }
  ${(props) =>
    props.collapsed &&
    css`
      max-width: 80px;
      min-width: 80px;
      width: 80px;
      text-overflow: ellipsis;
    `}
`;

const Td = styled.td<{ collapsed?: boolean; background?: string }>`
  padding: 1rem;
  vertical-align: top;
  white-space: nowrap;
  ${(props) =>
    props.collapsed &&
    css`
      max-width: 80px;
      width: 80px;
      overflow: hidden;
      text-overflow: ellipsis;
    `}
  ${(props) =>
    props.background &&
    css`
      background: ${props.background};
    `}
`;

const RowValueSelector = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
  > li {
    min-width: 300px;
    margin: 3px 0;
    > input {
      margin-right: 5px;
    }
  }
`;

const NumericFilterLi = styled.li`
  padding: 6px 0;
  > span {
    display: inline-block;
    width: 105px;
  }
`;

export function SimpleTable({
  colors,
  customColumn,
  data,
  disableQueryString = false,
  downloadIcon,
  onRowClick,
  rowIdentifier = 0,
  selectedRows,
  defaultSortBy,
  columnsOrdering,
  hasFullScreen = true,
  hasColumnFiltering = true,
  hasGroupBy = true,
  tableIdentifier = "Table1",
}: IProps) {
  let columns = Object.keys(data);
  const colFilters: { [dynamic: string]: string } = {};
  columns.forEach((col) => (colFilters[col] = ""));
  const colExpanded: { [dynamic: string]: boolean } = {};
  columns.forEach((col) => (colExpanded[col] = false));

  const [fullScreen, setFullScreen] = React.useState(false);
  const [columnFilters, setColumnFilters] = React.useState(colFilters);
  const [collapsedColumns, setCollapsedColumns] = React.useState(colExpanded);
  const [groupBy, setGroupBy] = React.useState("");
  const [selectedRowValues, setSelectedRowValues] = React.useState<any[]>(null);
  const [selectedHeader, setSelectedHeader] = React.useState("");
  const [isSelectedHeaderNumeric, setIsSelectedHeaderNumeric] = React.useState(
    false
  );
  const [collapsedGroups, setCollapsedGroups] = React.useState<{
    [dynamic: string]: boolean;
  }>({});

  const originalData = JSON.parse(JSON.stringify(data));

  React.useEffect(() => {
    if (!disableQueryString) {
      const urlParams = new URLSearchParams(window.location.search);
      const hashed = urlParams.get("TableFilters");
      if (hashed) {
        const decoded = decodeURI(hashed);
        const toObject = JSON.parse(decoded);
        if (
          Object.keys(toObject[tableIdentifier].cf).toString() !==
          columns.toString()
        ) {
          const newRelativePathQuery = `${
            window.location.href.replace(window.location.hash, "").split("?")[0]
          }${window.location.hash}`;
          history.pushState(null, "", newRelativePathQuery);
          return;
        }
        setColumnFilters(toObject[tableIdentifier].cf);
        setSorter(parseInt(toObject[tableIdentifier].s));
        setSortingOrder(toObject[tableIdentifier].o);
      }
    }
  }, []);

  React.useEffect(() => {
    setCollapsedGroups({});
  }, [groupBy]);

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
      const allIndexes: number[] = [];
      data[col].forEach((entry, index) => {
        const filtersArr = columnFilters[col].split("|");
        filtersArr.forEach((filter) => {
          if (!filter) {
            return;
          }
          if (filter === "[blank]") {
            if (!entry) {
              allIndexes.push(index);
            }
            return;
          }
          // test for numeric filter
          if (filter.includes("<>")) {
            const numericFilters = filter.split("<>");

            if (numericFilters[0] && numericFilters[1]) {
              if (
                !isNaN(toNumber(numericFilters[0])) &&
                !isNaN(toNumber(numericFilters[1]))
              ) {
                if (
                  toNumber(entry) < toNumber(numericFilters[0]) &&
                  toNumber(entry) > toNumber(numericFilters[1])
                ) {
                  allIndexes.push(index);
                }
              }
              return;
            }

            if (numericFilters[0]) {
              if (!isNaN(toNumber(numericFilters[0]))) {
                if (toNumber(entry) < toNumber(numericFilters[0])) {
                  allIndexes.push(index);
                }
              }
              return;
            }

            if (numericFilters[1]) {
              if (!isNaN(toNumber(numericFilters[1]))) {
                if (toNumber(entry) > toNumber(numericFilters[1])) {
                  allIndexes.push(index);
                }
              }
              return;
            }

            return;
          }
          // test for string
          const regex = new RegExp(filter.trim(), "i");
          if (regex.test(entry)) {
            allIndexes.push(index);
          }
        });
      });
      const newData: { [dynamic: string]: any[] } = {};
      const newColors: { [dynamic: string]: any[] } = {};
      columns.forEach((col) => {
        newData[col] = [];
        if (colors?.[col]) {
          newColors[col] = [];
        }
        [...new Set(allIndexes)].forEach((indx) => {
          newData[col].push(data[col][indx]);
          if (colors?.[col]) {
            newColors[col].push(colors[col][indx]);
          }
        });
      });
      data = { ...newData };
      colors = { ...newColors };
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
    setGroupBy("");
    if (sorter === i) {
      const newSortingOrder = sortingOrder === "ASC" ? "DSC" : "ASC";
      setSortingOrder(newSortingOrder);
    } else {
      setSorter(i);
    }
  }

  React.useEffect(() => {
    if (!disableQueryString) {
      const hasValues = columns.some((x) => columnFilters[x] !== "");

      const urlParams = new URLSearchParams(window.location.search);
      const hashed = urlParams.get("TableFilters");
      let currentQueryStringObject: { [dynamic: string]: any } = {};
      if (hashed) {
        const decoded = decodeURI(hashed);
        currentQueryStringObject = JSON.parse(decoded);
      }

      if (hasValues) {
        currentQueryStringObject[tableIdentifier] = {};
        currentQueryStringObject[tableIdentifier].cf = columnFilters;
        currentQueryStringObject[tableIdentifier].s = sorter;
        currentQueryStringObject[tableIdentifier].o = sortingOrder;
        const encoded = encodeURI(JSON.stringify(currentQueryStringObject));
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set("TableFilters", encoded);
        const newRelativePathQuery =
          `${
            window.location.href.replace(window.location.hash, "").split("?")[0]
          }?${urlParams.toString()}` + window.location.hash;
        history.pushState(null, "", newRelativePathQuery);
      } else {
        let urlParams = new URLSearchParams(window.location.search);
        delete currentQueryStringObject[tableIdentifier];
        if (Object.keys(currentQueryStringObject).length === 0) {
          urlParams.delete("TableFilters");
        } else {
          const encoded = encodeURI(JSON.stringify(currentQueryStringObject));
          urlParams.set("TableFilters", encoded);
        }
        const newRelativePathQuery =
          `${
            window.location.href.replace(window.location.hash, "").split("?")[0]
          }?${urlParams.toString()}` + window.location.hash;
        history.pushState(null, "", newRelativePathQuery);
      }
    }
  }, [colFilters, sorter, sortingOrder]);

  if (!data) {
    return <p>No results.</p>;
  }

  const headers: string[] = Object.keys(data);

  // Data is grouped by row, instead of being grouped by header.
  //
  // Example:
  // [
  //   { values: ['Angelina', 'Camel', 'F', '55044'], originalIndex: 0 },
  //   { values: ['Jerald', 'Ditto', 'M', '55044'], originalIndex: 1 },
  //   { values: ['Nickolas', 'Alphonse', 'M', '55044'], originalIndex: 2 },
  // ]
  const normalizedData: { values: any[]; originalIndex: number }[] = data[
    headers[0]
  ].map((_, i) => {
    return {
      values: headers.map((header) => data[header][i]),
      originalIndex: i,
    };
  });

  // Sort data
  function toNumber(val: string): number {
    return parseFloat(val);
  }

  const isSorterNumeric = !normalizedData
    .filter((entry) => Boolean(entry.values[sorter]))
    .some((entry) => isNaN(toNumber(entry.values[sorter])));

  if (isSorterNumeric) {
    normalizedData.sort((a, b) => {
      if (!a.values[sorter] || !b.values[sorter]) {
        return -1;
      }
      return sortingOrder === "ASC"
        ? toNumber(a.values[sorter]) - toNumber(b.values[sorter])
        : toNumber(b.values[sorter]) - toNumber(a.values[sorter]);
    });
  } else {
    normalizedData.sort((a, b) => {
      return a.values[sorter] < b.values[sorter]
        ? sortingOrder === "ASC"
          ? -1
          : 1
        : sortingOrder === "DSC"
        ? -1
        : 1;
    });
  }

  const areFiltersSet = columns.some((col) => columnFilters[col] !== "");

  function onColumnFilterChange(
    e: React.ChangeEvent<HTMLInputElement>,
    header: string
  ) {
    const columnFiltersCopy = { ...columnFilters };
    columnFiltersCopy[header] = e.target.value;
    setColumnFilters(columnFiltersCopy);
  }

  function clearFilter() {
    const columnFiltersCopy = { ...columnFilters };
    columnFiltersCopy[selectedHeader] = "";
    setColumnFilters(columnFiltersCopy);
    setSelectedRowValues(null);
  }

  function applyColumnFilter() {
    if (!isSelectedHeaderNumeric) {
      const rows: NodeListOf<HTMLInputElement> = document.querySelectorAll(
        "#rowsSelector input"
      );
      let searchString = "";
      rows.forEach((row) => {
        if (row.checked) {
          searchString = searchString
            ? `${searchString}|${row.value}`
            : row.value;
        }
      });
      const columnFiltersCopy = { ...columnFilters };
      columnFiltersCopy[selectedHeader] = searchString;
      setColumnFilters(columnFiltersCopy);
      setSelectedRowValues(null);
    } else {
      const greaterThan = document.querySelector<HTMLInputElement>(
        "#filterGreaterThan"
      ).value;
      const lessThan = document.querySelector<HTMLInputElement>(
        "#filterLessThan"
      ).value;
      let customFilter = "";
      if (greaterThan) customFilter = "<>" + greaterThan;
      if (!greaterThan && lessThan) customFilter = lessThan + "<>";
      if (greaterThan && lessThan) customFilter = `${lessThan}<>${greaterThan}`;
      const columnFiltersCopy = { ...columnFilters };
      columnFiltersCopy[selectedHeader] = customFilter;
      setColumnFilters(columnFiltersCopy);
      setSelectedRowValues(null);
    }
  }

  function showBlanks() {
    const columnFiltersCopy = { ...columnFilters };
    columnFiltersCopy[selectedHeader] = "[blank]";
    setColumnFilters(columnFiltersCopy);
    setSelectedRowValues(null);
  }

  function clearFilters() {
    const columnFiltersCopy = { ...columnFilters };
    columns.forEach((col) => (columnFiltersCopy[col] = ""));
    setColumnFilters(columnFiltersCopy);
  }

  function onGroupByChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setGroupBy(e.target.value);
    setSorter(columns.findIndex((x) => x === e.target.value));
    setSortingOrder("ASC");
  }

  function toggleColumnCollapse(header: string) {
    const collapsedColumnsCopy = { ...collapsedColumns };
    collapsedColumnsCopy[header] = !collapsedColumnsCopy[header];
    setCollapsedColumns(collapsedColumnsCopy);
  }

  function setModalData(header: string, i: number) {
    const uniqueValues = data[header]
      .reduce((result, element) => {
        var normalize = (x: any) =>
          typeof x === "string" ? x.toLowerCase() : x;

        var normalizedElement = normalize(element);
        if (
          result.every(
            (otherElement) => normalize(otherElement) !== normalizedElement
          )
        ) {
          result.push(element);
        }

        return result;
      }, [])
      .filter(Boolean);
    setSelectedRowValues(uniqueValues);
    setSelectedHeader(header);
    const isSelectedHeaderNumeric = !normalizedData
      .filter((entry) => Boolean(entry.values[i]))
      .some((entry) => isNaN(toNumber(entry.values[i])));
    setIsSelectedHeaderNumeric(isSelectedHeaderNumeric);
  }

  function onGroupClick(group: string) {
    const collapsedGroupsCopy = { ...collapsedGroups };
    collapsedGroupsCopy[group] = !collapsedGroups[group];
    setCollapsedGroups(collapsedGroupsCopy);
  }

  return (
    <>
      {selectedRowValues && (
        <Modal close={() => setSelectedRowValues(null)}>
          <RowValueSelector id="rowsSelector">
            {!isSelectedHeaderNumeric ? (
              selectedRowValues.map((rowValue) => (
                <li key={rowValue}>
                  <input type="checkbox" value={rowValue} />
                  {rowValue}
                </li>
              ))
            ) : (
              <>
                <NumericFilterLi>
                  <span>Greater than:</span>{" "}
                  <input type="number" id="filterGreaterThan" />
                </NumericFilterLi>
                <NumericFilterLi>
                  <span>Less than:</span>{" "}
                  <input type="number" id="filterLessThan" />
                </NumericFilterLi>
              </>
            )}
          </RowValueSelector>
          <Grid>
            <Button onClick={showBlanks}>Show blanks</Button>
            <HorizontalList alignRight>
              <Button secondary onClick={clearFilter}>
                Clear
              </Button>
              <Button onClick={applyColumnFilter}>Apply</Button>
            </HorizontalList>
          </Grid>
        </Modal>
      )}
      <FullScreenWrapper fullScreen={fullScreen}>
        {hasFullScreen && (
          <FullScreenActions>
            <p>
              Showing{" "}
              <strong>
                {data?.[Object.keys(data)?.[0]].length > 500
                  ? 500
                  : data?.[Object.keys(data)?.[0]].length}
              </strong>{" "}
              of{" "}
              <strong>
                {originalData?.[Object.keys(originalData)?.[0]].length}
              </strong>{" "}
              results
            </p>
            <div>
              {hasGroupBy && (
                <GroupBySelect value={groupBy} onChange={onGroupByChange}>
                  <option value="">Group by</option>
                  {columns.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </GroupBySelect>
              )}
              {hasColumnFiltering && areFiltersSet && (
                <Action type="button" onClick={clearFilters}>
                  Clear filters &#8861;
                </Action>
              )}
              <Action type="button" onClick={() => setFullScreen(!fullScreen)}>
                {fullScreen ? (
                  <>Collapse &#10066;</>
                ) : (
                  <>Full screen &#10063;</>
                )}
              </Action>
            </div>
          </FullScreenActions>
        )}
        <TableWrapper fullScreen={fullScreen}>
          <Table>
            <thead>
              <Tr>
                {customColumn && <Th />}
                {headers.map((header, i) => (
                  <Th
                    key={header}
                    isSorter={header === headers[sorter]}
                    sortingOrder={sortingOrder}
                    columnFiltering={hasColumnFiltering}
                    collapsed={collapsedColumns[header]}
                  >
                    <div className="header-string">
                      <span
                        onClick={() => onHeaderClick(i)}
                        style={
                          collapsedColumns[header]
                            ? {
                                width: "24px",
                                display: "inline-block",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }
                            : {}
                        }
                      >
                        {header}
                      </span>
                      <span
                        style={{ marginLeft: "10px" }}
                        onClick={() => toggleColumnCollapse(header)}
                      >
                        {collapsedColumns[header] ? <>&#8677;</> : <>&#8676;</>}
                      </span>
                    </div>
                    {hasColumnFiltering && (
                      <>
                        <input
                          type="text"
                          placeholder="Filter"
                          value={columnFilters[header]}
                          onChange={(e) => onColumnFilterChange(e, header)}
                        />
                        <button
                          type="button"
                          onClick={() => setModalData(header, i)}
                        >
                          <svg
                            id="Icons"
                            version="1.1"
                            viewBox="0 0 32 32"
                            style={{ width: "12px" }}
                          >
                            <path d="M16,2C9.3,2,2,3.4,2,6.5V11c0,0.3,0.1,0.6,0.3,0.7L13,21.4V29c0,0.3,0.2,0.7,0.5,0.9C13.6,30,13.8,30,14,30  c0.2,0,0.3,0,0.4-0.1l4-2c0.3-0.2,0.6-0.5,0.6-0.9v-5.6l10.7-9.7c0.2-0.2,0.3-0.5,0.3-0.7V6.5C30,3.4,22.7,2,16,2z M16,4  c8,0,11.9,1.8,12,2.5C27.9,7.2,24,9,16,9C8,9,4.1,7.2,4,6.5C4.1,5.8,8,4,16,4z" />
                          </svg>
                        </button>
                      </>
                    )}
                  </Th>
                ))}
              </Tr>
            </thead>
            <tbody>
              {normalizedData.slice(0, 500).map((row, i) => {
                const groupByIndex = columns.findIndex((x) => x === groupBy);

                return (
                  <React.Fragment key={i}>
                    {groupBy && i === 0 ? (
                      <Tr
                        separator
                        onClick={() => onGroupClick(row.values[groupByIndex])}
                      >
                        <Td colSpan={columns.length}>
                          {collapsedGroups[row.values[groupByIndex]] ? (
                            <>&#x25B8;</>
                          ) : (
                            <>&#x25BE;</>
                          )}{" "}
                          {row.values[groupByIndex]}
                        </Td>
                      </Tr>
                    ) : null}
                    {groupBy &&
                    i > 0 &&
                    normalizedData[i - 1].values[groupByIndex] !==
                      row.values[groupByIndex] ? (
                      <Tr
                        separator
                        onClick={() => onGroupClick(row.values[groupByIndex])}
                      >
                        <Td colSpan={columns.length}>
                          {collapsedGroups[row.values[groupByIndex]] ? (
                            <>&#x25B8;</>
                          ) : (
                            <>&#x25BE;</>
                          )}{" "}
                          {row.values[groupByIndex]}
                        </Td>
                      </Tr>
                    ) : null}
                    {groupBy &&
                    collapsedGroups[row.values[groupByIndex]] ? null : (
                      <Tr
                        key={`r${i}`}
                        onClick={() => {
                          const firstKey = Object.keys(originalData)[
                            rowIdentifier
                          ];
                          const dataKeys = Object.keys(data);
                          const firstKeyIndex = dataKeys.findIndex(
                            (x) => x === firstKey
                          );
                          onRowClick(row.values[firstKeyIndex]);
                        }}
                        highlight={selectedRows && selectedRows[row.values[0]]}
                      >
                        {customColumn && <Td>{customColumn}</Td>}
                        {row.values.map((field, j) => (
                          <Td
                            key={`${i}_${j}`}
                            collapsed={collapsedColumns[columns[j]]}
                            background={
                              colors?.[columns[j]]?.[row.originalIndex]
                            }
                          >
                            {field}
                          </Td>
                        ))}
                      </Tr>
                    )}
                  </React.Fragment>
                );
              })}
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
