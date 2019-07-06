import * as React from "react";

import { SheetContents, ISheetContents } from "trc-sheet/sheetContents";

// Generic  Download button for a CSV 
export class DownloadCsv extends React.Component<{
    data: ISheetContents,
}, {
}>
{
    private _csv :string; 
    private _error : string;

    constructor(props: any) {
        super(props);       

        this.onClickDownload1 = this.onClickDownload1.bind(this);

        try
        {
            this._csv = SheetContents.toCsv(this.props.data);        
        }
        catch (err) {
            this._error = err;
        }
    }

    private onClickDownload1() : void {
        var content = this._csv;
        window.navigator.msSaveBlob(
            new Blob([content], 
                { type: "text/csv;charset=utf-8;" }), "data.csv");
    }   

    public render()  {
        if (this._error) {
            return <div>Error: {this._error}</div>
        }
        if (!this._csv) {
            return <div></div>
        }
        var img = "https://trcanvasdata.blob.core.windows.net/publicimages/export-csv.png";

        if (window.navigator.msSaveBlob) {
            return <input type="image" src={img} onClick={this.onClickDownload1}></input>
        }
        else {
            let uri = "data:text/csv;charset=utf-8," + encodeURIComponent(this._csv);                

            return <a 
                href={uri}
                download = "data.csv"
            >
                <img src={img}></img>
            </a>
        }
    }
}
