import * as React from "react";
import { parse } from "papaparse";

import { ISheetContents } from "trc-sheet/sheetContents";
import { SimpleTable } from "./SimpleTable";

import { Button } from "./common/Button";
import { HorizontalList } from "./common/HorizontalList";
import { TextareaInput } from "./common/TextareaInput";

// Generic control for accepting raw text input, parsing it, and rendering as a table.
// Caller hooks OnSubmit() to determine what to do with it.

interface IProps {
  onValidate?: (data: ISheetContents) => void; // Called after parse
  onSubmit?: (data: ISheetContents) => void;
}

interface IState {
  rawText: string;
  data: ISheetContents;
}

export class CsvInput extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      rawText: "",
      data: null,
    };

    this.onParse = this.onParse.bind(this);

    this.onBack = this.onBack.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.apply = this.apply.bind(this);

    this.handleChange = this.handleChange.bind(this);
  }

  static parseCsv(text: string): ISheetContents {
    const lines: any = parse(text.trim(), { delimitersToGuess: ["\t", ","] })
      .data;
    const names: string[] = lines[0];
    const cols: any[] = [];

    let x: ISheetContents = {};
    names.forEach((name) => {
      const col: string[] = [];
      cols.push(col);
      x[name.trim()] = col;
    });

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].length == 0) {
        continue;
      }
      const parts = lines[i];
      if (parts.length != names.length) {
        throw "Parser error at line " + i + ": " + lines[i];
      }

      for (let j = 0; j < names.length; j++) {
        const col = cols[j];
        col.push(parts[j].trim());
      }
    }

    return x;
  }

  // Parse the raw text.
  private onParse() {
    try {
      const x = CsvInput.parseCsv(this.state.rawText);

      if (this.props.onValidate) {
        this.props.onValidate(x);
      }

      this.setState({ data: x });
    } catch (err) {
      alert(err);
    }
  }

  // When displaying table, go back to raw text.
  private onBack() {
    this.setState({ data: null });
  }

  private apply() {
    console.log("apply");
    console.log(parse(this.state.rawText));
  }

  private onSubmit() {
    // alert("Submit!");
    var c = this.props.onSubmit;
    if (c) {
      c(this.state.data);
    }
  }

  // Updates in text Areas
  private handleChange(event: any) {
    this.setState({ rawText: event.target.value.replace(/\t/g, ",") });
  }

  public render() {
    if (!!this.state.data) {
      // Successfully parsed and validated.
      return (
        <>
          <SimpleTable data={this.state.data} disableQueryString />
          <HorizontalList alignRight>
            <Button onClick={this.onBack} secondary>
              Back
            </Button>
            <Button onClick={this.onSubmit}>Submit</Button>
          </HorizontalList>
        </>
      );
    }

    return (
      <>
        <TextareaInput
          label="Enter CSV text"
          onChange={this.handleChange}
          value={this.state.rawText}
        />
        <HorizontalList alignRight>
          <Button onClick={this.onParse}>Next</Button>
        </HorizontalList>
      </>
    );
  }
}
