
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as trcSheet from 'trc-sheet/sheet'
import { IMajorState } from "./SheetContainer";
declare var _trcGlobal : IMajorState;

// Helper 
// Renders Child if columnName is missing 
// Renders 'OnFound' function if present
export class ColumnCheck extends React.Component<{
    columnName : string,    
    OnFound? : (ci : trcSheet.IColumnInfo) => any
},{}>
{
    public constructor(props: any) {
        super(props);
    }
    public render() {
        if (!_trcGlobal._info) {
            return null; // not ready yet 
        }
        var ci2 = _trcGlobal._info.Columns.find( (ci) => ci.Name == this.props.columnName);
        if (!ci2) {
            return this.props.children;
        }
        
        if (!this.props.OnFound) { return null; }
        var child = this.props.OnFound(ci2);
        return child;
    }
}