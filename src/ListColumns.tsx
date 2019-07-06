import * as React from "react";
import * as ReactDOM from "react-dom";
import * as trcSheet from 'trc-sheet/sheet'
import { IMajorState } from "./SheetContainer";

declare var _trcGlobal: IMajorState;

// List column names. 
export class ListColumns extends React.Component<{
    Include?: (ci: trcSheet.IColumnInfo) => boolean;
}, {
}> {
    constructor(props: any) {
        if (!props.Include) {
            props.Include = (ci: any) => true;
        }
        super(props);
        this.state = {};
    }

    private getStr(ci : trcSheet.IColumnInfo) : string {
        var x = ci.Name;
        if (ci.PossibleValues && ci.PossibleValues.length >  0) {
            x += ":" + ci.PossibleValues.join(",");;
        }
        return x;
    }

    public render()  {
        var cis = _trcGlobal._info.Columns;
        return <div>
            <ul>
                {cis.map( (ci, idx) => this.props.Include(ci) && <li key={idx}>
                    {this.getStr(ci)}
                </li>)}                
            </ul>
        </div>
    }
}