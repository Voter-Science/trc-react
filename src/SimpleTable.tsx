import * as React from "react";

import { SheetContents, ISheetContents } from "trc-sheet/sheetContents";
import { DownloadCsv } from "./DownloadCsv";




// Render <Table> around a basic ISheetContents. 
// Readonly. 
export class SimpleTable extends React.Component<{
    data: ISheetContents,
    downloadIcon ? :boolean 
    // Could expand to include download icon? 
}, {
}>
{    
    constructor(props: any) {
        super(props);       
    }

    private parsedHeaders(): string[] {
        var x = this.props.data;
        var y = Object.keys(x);
        return y;
    }

    public render() {
        if (!this.props.data) {
            return <div>(Empty Table)</div>
        }
        var headers: string[] = this.parsedHeaders();
        //var numRows = this.state.data[headers[0]].length;
        var x = this.props.data;
        var col0 = x[headers[0]];

        // How to style table? Must apply to each cell. 
        // https://stackoverflow.com/questions/35234651/how-to-efficiently-style-a-table-inline-in-react
        var style = {
            border: "1px solid black"
        };

        return <div>            
            {this.props.downloadIcon && <DownloadCsv data={this.props.data}></DownloadCsv> }
            <table style={style}>
                <thead>
                    <tr>
                        {headers.map((header, key) => <td style={style} key={key}>{header}</td>)}
                    </tr>
                </thead>
                <tbody>
                    {col0.map((val, iRow) => <tr key={"r" + iRow}>
                        {headers.map((header, key) => <td style={style} key={iRow + "_" + key}>{x[header][iRow]}</td>)}
                    </tr>
                    )}
                    </tbody>
            </table>
        </div>
    }

}
