import { ISheetContents } from "trc-sheet/sheetContents";

export default function reorderISheetColumns(
  data: ISheetContents,
  columnsOrdering: string[],
  hideUnspecifiedColumns: boolean
) {
  let sortedData: ISheetContents = {};
  if (columnsOrdering) {
    columnsOrdering.forEach((column) => {
      sortedData[column] = data[column];
    });
    if (hideUnspecifiedColumns) {
      return sortedData;
    }
    const keys = Object.keys(data);
    const filteredKeys = keys.filter((key) => !columnsOrdering.includes(key));
    filteredKeys.forEach((column) => {
      sortedData[column] = data[column];
    });
  }
  return sortedData;
}
