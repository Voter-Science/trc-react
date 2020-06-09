import * as React from "react";

import TRCContext from "./context/TRCContext";

import { IMajorState } from "./SheetContainer";

// Helper for creating hyperlink to another plugin (same sheet)
export class PluginLink extends React.Component<{
    id: string, // plugin id to display
    sheetId?: string // pull from global if missing
    url?: string // query or hash
}, {}>
{
    static contextType = TRCContext;

    private _url: string;

    public constructor(props: any, context: IMajorState) {
        super(props, context);


        // https://canvas.voter-science.com/plugin/47c41c7d5e2946bfb30d254f142d7000/audit
        //var url = window.location.href;
        // this._sheetId = url.substr(40, 32);

        var sheetId = this.props.sheetId;
        if (!sheetId) {
            sheetId = this.context.SheetId;
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
