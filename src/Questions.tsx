import * as React from "react";
import * as ReactDOM from "react-dom";
import * as trcSheet from 'trc-sheet/sheet'
import { IMajorState } from "./SheetContainer";

import { Button } from "./common/Button";
import { Grid } from "./common/Grid";
import { HorizontalList } from "./common/HorizontalList";
import { SelectInput } from "./common/SelectInput";
import { TextInput } from "./common/TextInput";

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
        const inputs = this.props.columns.map((attr, idx) => !attr.IsReadOnly && (
            <QuestionSelect
                key={idx}
                onChange={(val: string) => this.onChange(idx, val)}
                columnInfo={attr}
            />
        )).filter(Boolean);

        return (
            <>
                <Grid>
                    {inputs}
                </Grid>
                <HorizontalList alignRight>
                    <Button onClick={this.onSubmit}>
                        Submit
                    </Button>
                </HorizontalList>
            </>
        )
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
            return (
                <TextInput
                    label={ci.Name}
                    type="text"
                    onChange={(e) => this.c1(e.target.value)}
                />
            )
        }

        // Selection
        return (
            <SelectInput
                label={ci.Name}
                options={ci.PossibleValues}
                onChange={(e) => this.c1(e.target.value)}
            />
        )
    }
}
