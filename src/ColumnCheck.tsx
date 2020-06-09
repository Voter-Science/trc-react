
import * as React from "react";
import * as trcSheet from 'trc-sheet/sheet'

import TRCContext from "./context/TRCContext";

// Helper
// Renders Child if columnName is missing
// Renders 'OnFound' function if present
export class ColumnCheck extends React.Component<{
    columnName : string,
    OnFound? : (ci : trcSheet.IColumnInfo) => any
},{}>
{
    static contextType = TRCContext;

    public render() {
        if (!this.context._info) {
            return null; // not ready yet
        }
        var ci2 = this.context._info.Columns.find((ci: any) => ci.Name == this.props.columnName);
        if (!ci2) {
            return this.props.children;
        }

        if (!this.props.OnFound) { return null; }
        var child = this.props.OnFound(ci2);
        return child;
    }
}
