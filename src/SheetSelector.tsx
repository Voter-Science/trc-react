// Reusable SheetSelector  control for selecting a sheet. 

import * as React from "react";
import * as ReactDOM from "react-dom";
import { IMajorState } from "./SheetContainer";
import { Button } from "./common/Button";
import { DescriptionList } from "./common/DescriptionList";
import Modal from "./common/Modal";
import { SelectInput } from "./common/SelectInput";
import { Spinning } from "./common/Spinning";
import TRCContext from "./context/TRCContext";
import * as trcSheet from "trc-sheet/sheet";
import { SpinnerSmall } from "./common/SpinnerSmall";

interface IProps {
    openButtonText?: string; // text for the open button. 
    dialogTitle?: string; // title once we open the dialog

    // If provided, then a callback to determine if sheets are included in initial list. 
    // return true to include; false to exclude. 
    // Thisis a fast filter, to filter out based on name, sheetId (in an existing list),etc 
    onInclude?: (sheetId:string, sheetName:string) => boolean; 

    // Called on each item once it's selected. Has additional info details. 
    // This could check things like column schema, default plugin, etc. 
    //onInclude2?: (sheetId:string, info: trcSheet.ISheetInfoResult) => boolean; 

    // If true, can only select top-level sheets.
    onlyTopLevel? : boolean;

    // Invoked on close, when we select the given sheetId. 
    // $$$ we could provide sheetMetadata, graph, etc. 
    onSelect: (sheetId: string) => void;
}

interface IState {
    modelOpen: boolean;

    loading: boolean;

    sheetObjs?: IGraphObjectBase[];


    // Is there a current sheet to select; and is it valid?
    isValidSheet: boolean; 

    // Currently selected sheetId
    sheetId?: string;

    // Info about currently selected sheet
    sheetInfo?: trcSheet.ISheetInfoResult;
}


interface IGraphObjectBase {
    WebId: string; // sheetId
    // ActionUrl: string; // Url to jump to 
    Name: string; // Display Name 
}

interface ISegment<T> {
    Results: T[];
}

// More things to show Show create date  / last modified date
// - survey id
// - time ago control? in Descr list?

// Select a sheet. 
// Renders a <Button> that opens a modal dialog to display sheets the current user
// has access to. Select a sheet, click ok, and fires a callback on props. 
// 
// Must exist in <SheetContainer> so that it has access to context / sheet client
// Will fetch sheet list when dialog is opened (using graph API). 
// 
// Display sheet details when selected. 
export class SheetSelector extends React.Component<IProps, IState>
{
    static contextType = TRCContext;

    public constructor(props: IProps, context: IMajorState) {
        super(props, context);

        var state: IState = {
            modelOpen: false,
            loading: true,
            isValidSheet: false,
            sheetId: undefined,
            sheetObjs: undefined
        };
        this.state = state;
        this.onOpenDialog = this.onOpenDialog.bind(this);
        this.onOk = this.onOk.bind(this);
        this.onReportSelectorChange = this.onReportSelectorChange.bind(this);
    }

    // Helper to get sheet client from the context. 
    private getSheetClient(): trcSheet.SheetClient {
        var ctx: IMajorState = this.context;
        var sc = ctx.SheetClient;
        return sc;
    }

    // Get all surveys that the current user has permission to
    public async getGraphAllAsync(kind: string): Promise<IGraphObjectBase[]> {
        var http = this.getSheetClient()._http;
        var results = await http.getAsync<ISegment<IGraphObjectBase>>("/graph?kinds=" + kind);
        return results.Results;
    }

    //  Wrapper to catch exceptions and display. 
    // Particularly useful in top-level button click handlers.
    private async ErrorCheckAsync(func: () => Promise<void>): Promise<void> {
        try {
            await func();
        } catch (error) {
            var msg: string = error.Message;
            alert("Failed: " + msg);
            return;
        }
    }

    // componentDidMount() is called when the control is created, which can be on page load.
    // renamed to componentDidMount2() so that we can call explicitly - and defer until the 
    // dialog is opened.
    async componentDidMount2() {
        await this.ErrorCheckAsync(async () => {
            var sheets = await this.getGraphAllAsync("Sheet");

            sheets = sheets.filter((item : IGraphObjectBase ) =>  
                item.Name != "Voter Participation Tool");

            // Apply filter if provided. 
            var fp = this.props.onInclude;
            if (fp) {
                sheets = sheets.filter((item : IGraphObjectBase ) =>  fp(item.WebId, item.Name));
            }

            // Sort alphabetically by name. 
            sheets.sort((a, b) => a.Name.localeCompare(b.Name));

            this.setState({ sheetObjs: sheets, loading: false });
        });
    }

    public render() {
        return <>
            <Button onClick={() => this.onOpenDialog()}>Add Sheet+</Button>
            {this.state.modelOpen && (
                <Modal close={() => this.setState({ modelOpen: false })}>
                    {this.renderDialog()}
                </Modal>
            )}
        </>
    }

    private renderDialog() {
        var list = this.state.sheetObjs;
        var info = this.state.sheetInfo;

        if (this.state.loading) {
            return <SpinnerSmall />;
        }

        return <>
            <SelectInput
                // noBlank
                label={(this.props.dialogTitle ?? "Select sheet")}
                options={list.map(obj => obj.Name)} // string[] to display 
                values={list.map(obj => obj.WebId)} // string[] for values. 
                onChange={this.onReportSelectorChange}
            />

            {
                info && <DescriptionList
                    entries={[
                        ["Name", info.Name],
                        ["Parent", info.ParentName],
                        ["Count Records", info.CountRecords.toLocaleString()],
                        ["Version", info.LatestVersion],
                        // ["Version", info.SurveyId]
                        // Last modified date? (TimeAgo? control??)
                    ]} />
            }

            <Button disabled={!this.state.isValidSheet} onClick={() => this.onOk() }>
                {this.props.openButtonText ?? "Select Sheet"}
            </Button>
        </>
    }

    // Called when they change a sheet in dropdown. 
    // Can fetch current info. 
    private async onReportSelectorChange(
        e: React.ChangeEvent<HTMLSelectElement>
    ): Promise<void> {
        const sheetId = e.target.value;

        this.setState({ sheetId: sheetId, isValidSheet:false, sheetInfo: null });

        // Get some sheet stats 
        var client = this.getSheetClient().getSheetById(sheetId);
        var info = await client.getInfoAsync();

        var valid = true;
        if (this.props.onlyTopLevel) {
            var topLevel = !info.ParentId;  // will be true for: null, undefined, ""
            if (!topLevel) {
                valid = false;
            }
        }

        this.setState({ sheetInfo: info , isValidSheet: valid});

        // alert("Changed to: " + value);
    }

    private onOk(): void {
        this.setState({ modelOpen: false });

        if (this.state.sheetId) {
            this.props.onSelect(this.state.sheetId);
        }
    }

    private onOpenDialog(): void {
        this.setState({ modelOpen: true });

        // Defer the network call to fetch results until they open the dialog. 
        this.componentDidMount2();
    }
}