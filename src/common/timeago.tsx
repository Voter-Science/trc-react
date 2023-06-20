import * as React from "react";
import * as ReactDOM from "react-dom";

interface IProps {
    timeStr: string;
}

interface IState {
    hover: boolean;
}

// $$$ Put in common library. 

// Control for displaying and formatting times.
// - parse string into a date
// - convert from UTC to locale.
// - display in "Ago" format, with tooltip for full time. 
export class TimeAgo extends React.Component<IProps, IState>
// extends React.Component
// <{
//     timeStr?: string
// },{}>
{
    public constructor(props:IProps)
    {
        super(props);
        this.state = { hover: false }
    }

    handleMouseIn() {
        this.setState({ hover: true })
    }

    handleMouseOut() {
        this.setState({ hover: false })
    }

    timeSince(d: Date) {
        var seconds = d.getTime() / 1000;
        var interval = seconds / 31536000;

        if (interval > 1) {
            var inter = Math.floor(interval);
            if (inter == 1){
                return inter + " year";
            }
            else{
                return inter + " years";
            }
        }
        interval = seconds / 2592000;
        if (interval > 1) {
            var inter = Math.floor(interval);
            if (inter == 1){
                return inter + " month";
            }
            else{
                return inter + " months";
            }
        }
        interval = seconds / 86400;
        if (interval > 1) {
            var inter = Math.floor(interval);
            if (inter == 1){
                return inter + " day";
            }
            else{
                return inter + " days";
            }
        }
        interval = seconds / 3600;
        if (interval > 1) {
            var inter = Math.floor(interval);
            if (inter == 1){
                return inter + " hour";
            }
            else{
                return inter + " hours";
            }
        }
        interval = seconds / 60;
        if (interval > 1) {
            var inter = Math.floor(interval);
            if (inter == 1){
                return inter + " minute";
            }
            else{
                return inter + " minutes";
            }
        }
        return Math.floor(seconds) + " seconds";
    }

    public render()
    {
        const tooltipStyle = {
            position: 'absolute',
            // transform: 'translate(5px, -60%)',
            display: this.state.hover ? 'inline-block' : 'none',
            ['background-color']: '#6C84F7',
            color: '#fff',
            width: '400px', //this is hardcoded right now because im not sure what it should be
            border: '2mm ridge black',
            fontFamily: "Georgia",
            borderRadius: "25px",
            paddingLeft: "7px",
            paddingRight: "3px",
            // zIndex: 9999,
        } as React.CSSProperties;
        
        const tooltipStyle2 = {
            position: 'static',
            display: 'inline-block',
            ['background-color']: '#e6f2ff',
            color: 'black',
            // zIndex: 0
        } as React.CSSProperties;



        //timestr is kinda like tooltiptext - d.toLocaleString() 
        
        var d = new Date(this.props.timeStr);
        return (
            <span>
                <span style={tooltipStyle2} onMouseOver={this.handleMouseIn.bind(this)} onMouseOut={this.handleMouseOut.bind(this)}>
                   {' '}{this.timeSince((new Date(Date.now()-d.valueOf())))}{' ago '}
                    <span>
                        <span style={tooltipStyle}>{d.toLocaleDateString()}{' at '}{d.toLocaleString("en-US", {hour: "2-digit", minute: "2-digit"})}</span>
                    </span>
                </span>
            </span>
        );

        // i wanna be able to hover over and give the date

        // return <>{d.toLocaleString()}</>
            // .toLocaleString()
    }

}