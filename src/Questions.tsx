import * as React from "react";
import * as ReactDOM from "react-dom";
import * as trcSheet from 'trc-sheet/sheet'
import { IMajorState } from "./SheetContainer";

declare var _trcGlobal: IMajorState;

// Render multiple questions with a "submit" button. 
// Still assumed to be for a single RecId. 
// record is a map of QuestionName=Value 
export class AllQuestions extends React.Component<{
    columns: trcSheet.IColumnInfo[],
    onSubmit : (record : any) => void

}, {
    answers: any
}> {
    constructor(props: any) {
        super(props);
        this.state = {
            answers: {}
        };

        this.onSubmit = this.onSubmit.bind(this);
    }

    private onSubmit() {
        // alert(JSON.stringify(this.state.answers));
        this.props.onSubmit(this.state.answers);
    }

    private onChange(idx: any, newVal: string) {
        var ci = this.props.columns[idx];
        var a = this.state.answers;
        a[ci.Name] = newVal;
        this.setState({
            answers: a
        });
    }

    public render() {
        return <div>
            {this.props.columns.map((attr, idx) => !attr.IsReadOnly && <QuestionSelect
                key={idx}
                onChange={(val: string) => this.onChange(idx, val)}
                columnInfo={attr}>
            </QuestionSelect>)}

            <button onClick={this.onSubmit}>Submit</button>
        </div>
    }
}

// $$$ Initial values? 
// Render a single question. 
export interface IQuestionSelectProps {
    columnInfo: trcSheet.IColumnInfo;
    onChange: (val: string) => void;
}

export class QuestionSelect extends React.Component<IQuestionSelectProps, {}> {
    constructor(props: IQuestionSelectProps) {
        super(props);
    }

    private c1(val: string) {
        this.props.onChange(val);
    }

    public render() {
        var ci = this.props.columnInfo;
        if (ci.IsReadOnly) {
            return <div>{ci.Name}</div>
        }
        if (!ci.PossibleValues) {
            // Text box 
            return <div>{ci.Name}
                <input type="text" onChange={(e) => this.c1(e.target.value)}></input>
            </div>
        } else {
            // Selection 
            return <div>{ci.Name}
                <select onChange={(e) => this.c1(e.target.value)}>
                    <option key={-1}></option>
                    {ci.PossibleValues.map((val, idx) =>
                        <option key={idx}>
                            {val}
                        </option>)}
                </select>
            </div>
        }
    }
}