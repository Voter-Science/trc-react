import { ISheetContents } from "trc-sheet/sheetContents";

export default function reorderISheetColumns(
  data: ISheetContents,
  columnsOrdering: string[]
) {
  let sortedData: ISheetContents = {};
  if (columnsOrdering) {
    columnsOrdering.forEach((column) => {
      sortedData[column] = data[column];
    });
    const keys = Object.keys(data);
    const filteredKeys = keys.filter((key) => !columnsOrdering.includes(key));
    filteredKeys.forEach((column) => {
      sortedData[column] = data[column];
    });
  }
  return sortedData;
}
