import * as React from "react";

import * as trcSheet from 'trc-sheet/sheet'

import { SheetContents, ISheetContents } from "trc-sheet/sheetContents";
import { IMajorState } from "./SheetContainer";

import { CsvInput } from "./CsvInput";
import { PluginLink } from "./PluginLink";

declare var _trcGlobal: IMajorState;

// take in a CSV, and match it to the current sheet. 
export class CsvMatchInput extends React.Component<{
}, {
    // Stage 0: inputing raw text 
    rawText: string;

    // Stage 1: after parsing & validation 
    data: ISheetContents;
    _recIdMatch?: number; // # of recIds that match. 
    _recIdTotal?: number; // total # of recIds in the data

    // Stage 2: after submit to posting 
    posting?: boolean; // after submit, before confirmation 

    // Stage 3: after successfully posted. Done. 
    posted?: string; // after confirmation
    postedVerNumber? : string; // after confirmation    
}>
{
    constructor(props: any) {
        super(props);
        this.state = {
            rawText: "",
            data: null
        };

        this.onValidate = this.onValidate.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    private onSubmit(data: ISheetContents) {
        // Post ot sheet contents. 
        this.setState({
            posting: true
        });


        _trcGlobal.SheetClient.postUpdateAsync(data).then((x) => {
            var msg = "Successfully posted to server. UpdateNumber starts at " + x.VersionTag;
            this.setState({
                postedVerNumber : x.VersionTag,
                posted: msg
            });
        })
    }
    private onValidate(data: ISheetContents) {
        var cis = _trcGlobal._info.Columns;

        // All rows in the sheet must match a column in 
        for (var colName in data) {
            var x = cis.find(ci => ci.Name == colName);
            if (!x) {
                throw "Column '" + colName + "' is not part of this sheet.";
            }

            // $$$ Normalize casing to Possible Values? 
            // All values in the column should match a possible value. 
            if (x.PossibleValues && x.PossibleValues.length > 0) {
                var possible : any = { };
                x.PossibleValues.forEach(val => possible[val] = true);
                possible[""] = true;
                possible["---"] = true; // sentinel value for delete.


                var input: string[] = data[colName];
                input.forEach((val,iRow) => {
                    if (!possible[val]) {
                        throw "Column '" + colName + "' has illegal value '" + val + "' at row " + iRow + ".";
                    }
                });
            }
        }

        // Must have RecId
        var recIds = data["RecId"];
        if (!recIds) {
            throw "Must have RecId column for primary keys";
        }

        var total = recIds.length
        var match: number = -1;

        // Get RecId match. (Only if contents are available)        
        if (_trcGlobal._contents) {
            var index = SheetContents.getSheetContentsIndex(_trcGlobal._contents);

            match = 0;

            recIds.forEach((recId => {
                if (index.lookupRecId(recId) >= 0) {
                    match++;
                }
            }));
        }


        this.setState({
            _recIdMatch: match,
            _recIdTotal: total,
            data: data
        });
    }

    private renderStats() {
        if (!this.state.data) {
            return null;
        }
        var s = this.state;

        if (s._recIdMatch >= 0) {
            var per = Math.floor(s._recIdMatch * 100 / s._recIdTotal) + "%";
            return <div>
                Input matches  {per} of recIds ({s._recIdMatch} of {s._recIdTotal} total).
        </div>
        }
        else {
            return <div>Input has {s._recIdTotal} total rows.</div>
        }
    }

    public render() {
        if (this.state.posted) {
            return <div>{this.state.posted}
            <PluginLink id="Audit" url={"#show=delta;ver=" + this.state.postedVerNumber}></PluginLink>
            </div>
        }
        if (this.state.posting) {
            return <div>Posting data to server...</div>
        }
        return <div>
            {this.renderStats()}
            <div>Enter CSV text:</div>
            <CsvInput onSubmit={this.onSubmit} onValidate={this.onValidate}></CsvInput>
        </div>
    }
}