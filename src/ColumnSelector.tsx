import * as React from "react";
import * as ReactDOM from "react-dom";
import * as trcSheet from 'trc-sheet/sheet'

import TRCContext from "./context/TRCContext";


// Select a column name from the sheet.
export interface IColumnSelectorProps {
    // Optional predicate to restrict which columns are included
    Include? : (ci : trcSheet.IColumnInfo) => boolean;  // if missing, defaults to IncludeAll
    Value? : string | trcSheet.IColumnInfo; // Initial value

    OnChange : (ci : trcSheet.IColumnInfo) => void; // Called when a selection is made
}
export class ColumnSelector extends React.Component<IColumnSelectorProps, {}> {
    static contextType = TRCContext;

    constructor(props : any) {
        super(props);
        this.state = { };
        this.handleChange = this.handleChange.bind(this);
      }

      private include(ci : trcSheet.IColumnInfo) : boolean {
          if (this.props.Include) {
              return this.props.Include(ci);
          }
          return true;
      }

    private getValues() : string[] {
        var cs = this.context._info.Columns;
        return cs.map((c: any) => this.include(c) ? c.Name : null);
    }


    // Used for selecting the "props.Value" item.
    // value is an index into columnInfo array
    private getValue() : number {
        if (!this.props.Value) {
            return undefined;
        }

        // props may be the name or the columnInfo. Convert to name
        var x : any= this.props.Value;
        var name : string = (x.Name) ? x.Name : x;

        var cs = this.getValues();
        for(var i  =0; i < cs.length; i++) {
            var c = cs[i];
            if (c) { // skip nulls
                if (c == name) {
                    return i;
                }
            }
        }

        return undefined;
    }

    handleChange(event: any) {
        var idx = event.target.value;
        //alert("set: " + idx);
        // this.setState({value: event.target.value});
        var ci = this.context._info.Columns[idx];

        this.props.OnChange(ci);
      }


    // Hints on <select>: https://reactjs.org/docs/forms.html#the-select-tag
    render() {
        // <option> must have a 'key' property for React.
         return <select onChange={this.handleChange} value={this.getValue()}>
             {this.getValues().map((name,idx) =>
             name ?
             <option key={idx} value={idx}>{name}</option>
             : null
             )}
         </select>
    }
}
