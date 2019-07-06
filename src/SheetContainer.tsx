// Wraps accessing a Sheet's info, contents, history, etc. 
// Exposes sheet info  to child elements. 
// Provides top-level UI for notifying loading state, missing requirements, etc. 
// Can enforce requirements like:
//  - required columns 
//  - Must be top-level

import * as React from "react";
import * as ReactDOM from "react-dom";

import * as XC from 'trc-httpshim/xclient'
import * as common from 'trc-httpshim/common'
import * as core from 'trc-core/core'
import * as trcSheet from 'trc-sheet/sheet'
import * as sheetContents from 'trc-sheet/sheetContents'

// https://www.leighhalliday.com/introducing-react-context-api
// const AppContext = React.createContext( {});

// Replace this with a react context? 
declare var _trcGlobal : IMajorState;


export interface IMajorProps {     
    // If set, then sheet must be a top-level to load
    requireTop? : boolean; 

    // IF set, fetch ISheetContents before loading 
    fetchContents? : boolean;
    
    // fetchRebase, fetchHistory, etc 
    // requireTopLevel, requireColumn
    onReady : () => any; // render body when ready 
}

// Cached state shared by all the components. 
export interface IMajorState {
    //AuthToken: string;
    SheetClient: trcSheet.SheetClient;
    SheetId: string;

    _updating? : boolean;

    _info?: trcSheet.ISheetInfoResult;
    _contents? : sheetContents.ISheetContents
    _errorRender? : () => any;
    // Sheet Contents?  Sheet History? 
}

export class SheetContainer extends React.Component<IMajorProps, IMajorState> {

    public constructor(props: any) {
        super(props);

        // Ordering:
        // - DOM has an html element 
        // - <SheetContainer> is rendered to that element. This sets the global
        // - Load complete.
        // - PluginMain() is called (after the OnLoad event). This reads the global
        //     to get <SheetContainer> and call setSheetRef();
        var x: any = window;
        x.mainMajor = this;
    }

    // Assumes _trcGlobal._info is set. 
    // Warn if you don't have permission. Else link. 
    renderRequireTopLevel() {
        var name = this.state._info ? this.state._info.ParentName : null;
        return <div>
            
            This plugin is only available for top-level sheets (see <b>{name}</b>).             
        </div>
    }

    render() {
        if (!this.state) {
            return <div>Loading...</div>
        } else {
            if (this.state._errorRender) {
                return this.state._errorRender();
            }
            if (this.state._updating) {
                return <div>Updating... please wait ...</div> 
            }
            if (!this.state._info) {
                return <div>Major! Not yet loaded: {this.state.SheetId}</div>;
            } else {
                // return <div>Major: {this.state._info.Name}</div>
                //return this.props.children;
                return this.props.onReady();
            }
        }
    }

    // Signal control will begin loading. 
    // Will disable entire frame. 
    public  beginLoad() : void {
        this.setState({
            _updating : true 
        });
        // state update will trigger a render. 
    }
    
    public checkManagedmentOp() : void {
        var adminClient = new trcSheet.SheetAdminClient(_trcGlobal.SheetClient);
        adminClient.WaitAsync().then( ()=> {
            // Management Operation could have changed everything. 
            // Reload to trigger rebuilding all teh caches. 
            location.reload(); 

            this.setState({
                _updating : false 
            });
        }).catch( (err) => {
            alert (JSON.stringify(err));

            this.setState({
                _updating : false 
            });
        });
    }
    
    // Called by PluginMain() once sheetId is available. 
    public setSheetRef(sheetRef: any): void {
        var httpClient = XC.XClient.New(sheetRef.Server, sheetRef.AuthToken, undefined);
        var sheetClient = new trcSheet.SheetClient(httpClient, sheetRef.SheetId);

        // Make async network call...
        this.setState({
            SheetId: sheetRef.SheetId,
            SheetClient: sheetClient
        }, () => {     
            _trcGlobal = { 
                SheetId : sheetRef.SheetId, 
                 SheetClient : sheetClient
            };

            // Possible things to get:
            // - Info (small)
            // - Contents 
            // - Deltas 
            // - RebaseLog
            
            // State is updated 

            if (this.props.fetchContents) {
                this.state.SheetClient.getSheetContentsAsync().then( (contents)=> 
                {
                    _trcGlobal._contents = contents;
                    this.checkDone();                    
                })
            }
            
            this.state.SheetClient.getInfoAsync().then((info) => {                
                _trcGlobal._info = info;               

                if (this.props.requireTop) {
                    if (!!info.ParentId) {
                        // Failure. 
                        // Find top-level; and if we have permission to it. 
                        this.setState({
                            _errorRender: ()=> this.renderRequireTopLevel()
                        });
                    }                    
                }
                this.checkDone();
            });
        });
    }

    private checkDone() : void {
        if (!_trcGlobal) {
            return;
        }
        if (this.props.fetchContents && !_trcGlobal._contents) {
            return;
        }
        if (!_trcGlobal._info){
            return;
        }

        // Done! Now update the state once with everything 
        this.setState({
            _info: _trcGlobal._info,
            _contents : _trcGlobal._contents
        });        
    }
}