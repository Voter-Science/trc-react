import * as React from "react";

import { SheetContents, ISheetContents } from "trc-sheet/sheetContents";

// Generic download button for a CSV

interface IProps {
  data: ISheetContents;
}

export class DownloadCsv extends React.Component<IProps, {}> {
  private _csv: string;
  private _error: string;

  constructor(props: any) {
    super(props);

    this.onClickDownload1 = this.onClickDownload1.bind(this);

    try {
      this._csv = SheetContents.toCsv(this.props.data);
    } catch (err) {
      this._error = err;
    }
  }

  private onClickDownload1(): void {
    var content = this._csv;
    window.navigator.msSaveBlob(
      new Blob([content], { type: "text/csv;charset=utf-8;" }),
      "data.csv"
    );
  }

  public render() {
    this._csv = SheetContents.toCsv(this.props.data);

    if (this._error) {
      return <div>Error: {this._error}</div>;
    }

    if (!this._csv) {
      return null;
    }

    var img =
      "https://trcanvasdata.blob.core.windows.net/publicimages/export-csv.png";

    if (window.navigator.msSaveBlob) {
      return <input type="image" src={img} onClick={this.onClickDownload1} />;
    } else {
      let uri = "data:text/csv;charset=utf-8," + encodeURIComponent(this._csv);

      return (
        <a href={uri} download="data.csv">
          <img src={img} />
        </a>
      );
    }
  }
}
