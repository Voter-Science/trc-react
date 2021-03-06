import * as React from "react";

import * as sheetContents from "trc-sheet/sheetContents";

import { Button } from "./common/Button";
import { Grid } from "./common/Grid";
import { HorizontalList } from "./common/HorizontalList";
import { TextInput } from "./common/TextInput";

// Generic control for collecting some input fields.

interface IProps {
  data: sheetContents.ISheetContents; // data is used to generate autocomplete suggestions
  Names: string[]; // Can be custom names, and will be used to set labels and input names
  Keys: string[]; // Must conform to ISheetContents keys
  initialValues?: { [dynamic: string]: string };
  onSubmit?: (record: any) => void;
  onClear?: () => void;
  onChange?: (key: string, value: string) => void;
  submitLabel?: string;
}

interface IState {
  Vals: any; // keys are from Names
  activeInputKey: string;
  dataListItems: string[];
}

export class FieldInputs extends React.Component<IProps, IState> {
  public constructor(props: any) {
    super(props);

    var vals: any = {};
    props.Names.forEach((name: string) => {
      vals[name] = "";
    });

    if (props.initialValues) {
      Object.keys(props.initialValues).forEach((key) => {
        if (vals[key] === "") {
          vals[key] = props.initialValues[key];
        }
      });
    }

    this.state = {
      Vals: vals,
      activeInputKey: null,
      dataListItems: [],
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }

  handleClear() {
    var vals: any = {};
    this.props.Names.forEach((name: string) => {
      vals[name] = "";
    });
    this.setState({ Vals: vals });

    if (this.props.onClear) {
      this.props.onClear();
    }
  }

  handleSubmit(event: any) {
    event.preventDefault();

    // Normalize data. Convert "" to undefined.
    var x: any = {};
    for (var key in this.state.Vals) {
      var val = this.state.Vals[key];
      if (val && val.length > 0) {
        x[key] = val;
      }
    }

    var c = this.props.onSubmit;

    if (c) {
      c(x);
    }
  }

  private updateFieldState(name: string, val: string, key: string): void {
    var vals = this.state.Vals;
    vals[name] = val;

    const uniqueValues = [...new Set(this.props.data[key])] as string[];
    const filteredDataList = uniqueValues
      .filter((x: string) => {
        const a = x.toLowerCase();
        const b = val.toLowerCase();
        if (a === b) return false;
        return a.indexOf(b) !== -1;
      })
      .slice(0, 8);

    this.setState({
      Vals: vals,
      activeInputKey: key,
      dataListItems: filteredDataList,
    });

    if (this.props.onChange) {
      this.props.onChange(name, val);
    }
  }

  render() {
    const { Keys, Names } = this.props;

    const inputs = Names.map((name: string, i) => (
      <TextInput
        key={name}
        type="text"
        placeholder={"(" + name + ")"}
        value={this.state.Vals[name]}
        onChange={(x) => this.updateFieldState(name, x.target.value, Keys[i])}
        label={name}
        list={`datalist-${Keys[i]}`}
      />
    ));

    return (
      <form onSubmit={this.handleSubmit}>
        <Grid>{inputs}</Grid>

        {this.state.dataListItems.length > 0 && (
          <datalist id={`datalist-${this.state.activeInputKey}`}>
            {this.state.dataListItems.map((value: string) => (
              <option key={value} value={value} />
            ))}
          </datalist>
        )}

        <HorizontalList alignRight>
          <Button onClick={this.handleClear} secondary type="button">
            Clear
          </Button>
          <Button type="submit">{this.props.submitLabel || "Search"}</Button>
        </HorizontalList>
      </form>
    );
  }
}
