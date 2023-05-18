import * as React from "react";
import * as ReactDOM from "react-dom";

interface IProps {
    tooltipText: string;
}

interface IState {
    hover: boolean;
}


// Todo:
// - work on mobile, button press
// - better icon. 
// - better hover style, floating. 

export class ToolTip extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = { hover: false }
    }

    handleMouseIn() {
        this.setState({ hover: true })
    }

    handleMouseOut() {
        this.setState({ hover: false })
    }

    render() {
        // Use Span / Inline styles. 
        // For specifying styles with hyphens: https://github.com/facebook/create-react-app/issues/11155
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


        return (
            <span>
                <span style={tooltipStyle2} onMouseOver={this.handleMouseIn.bind(this)} onMouseOut={this.handleMouseOut.bind(this)}>
                   {' '}[?]{' '}
                    <span>
                        <span style={tooltipStyle}>{this.props.tooltipText}</span>
                    </span>
                </span>
            </span>
        );
    }
    
}
