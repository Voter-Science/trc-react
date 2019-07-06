import * as React from "react";

import { IMajorState } from "./SheetContainer";

declare var _trcGlobal: IMajorState;

// Helper for creating hyperlink to another plugin (same sheet)
export class PluginLink extends React.Component<{
    id: string, // plugin id to display 
    sheetId?: string // pull from global if missing
    url?: string // query or hash
}, {}>
{
    private _url: string;

    public constructor(props: any) {
        super(props);


        // https://canvas.voter-science.com/plugin/47c41c7d5e2946bfb30d254f142d7000/audit
        //var url = window.location.href;
        // this._sheetId = url.substr(40, 32);

        var sheetId = this.props.sheetId;
        if (!sheetId) {
            sheetId = _trcGlobal.SheetId;
        }

        this._url = "https://canvas.voter-science.com/plugin/" +
            sheetId + "/" + this.props.id + "/index.html";

        if (props.url) {
            this._url += props.url;
        }
    }

    public render() {
        return <a
            target="_blank"
            href={this._url}>
            <b>
                {this.props.id}
            </b>
        </a>
    }
}