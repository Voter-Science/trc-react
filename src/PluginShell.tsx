import React = require("react");

// Provides top-level common banner 
export class PluginShell extends React.Component<{
    title: string,
    details?: string
}, {
}>
{
    public constructor(props: any) {
        super(props);
    }
    public render() {
        return <div>
            <section>
            <div>
                <h1>{this.props.title}</h1>
                <h2>{this.props.details}</h2>
            </div>
        </section>
        {this.props.children}
        </div>

    }
}