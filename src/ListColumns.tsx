import * as React from 'react';
import * as trcSheet from 'trc-sheet/sheet';

import TRCContext from './context/TRCContext';

// List column names.

interface IProps {
  Include?: (ci: trcSheet.IColumnInfo) => boolean;
}

export class ListColumns extends React.Component<IProps, {}> {
  static contextType = TRCContext;

  constructor(props: any) {
    if (!props.Include) {
      props.Include = (ci: trcSheet.IColumnInfo) => true;
    }
    super(props);
    this.state = {};
  }

  private getStr(ci: trcSheet.IColumnInfo): string {
    var x = ci.Name;
    if (ci.PossibleValues && ci.PossibleValues.length > 0) {
      x += ": " + ci.PossibleValues.join(", ");
    }
    return x;
  }

  public render() {
    var cis = this.context._info.Columns;
    return (
      <ul>
        {cis.map(
          (ci: trcSheet.IColumnInfo, idx: number) =>
            this.props.Include(ci) && <li key={idx}>{this.getStr(ci)}</li>
        )}
      </ul>
    );
  }
}
