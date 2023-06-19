// Text input for email addresses. 
// - validates as email. 
// - handle display name format.


import * as React from "react";
import { TextInput } from "./TextInput";


interface IProps {
    //defaultValue? : string;  
    label?: string;
    onChange: (value: string) => void;
}

interface IState {

    value: string;
    isValid: boolean;
}

export class EmailTextInput extends React.Component<IProps, IState>
{
    public constructor(props: IProps) {
        super(props);

        var state: IState = {
            value: "",
            isValid: true
        };

        this.state = state;

        this.onChange = this.onChange.bind(this);
    }

    public render() {
        return <>
            <TextInput
                label={this.props.label}
                placeholder="email@contoso.com"
                onChange={(e) => this.onChange(e.target.value)}
                error={this.state.isValid ? "" : "Must be a valid email"}
            />
        </>
    }

    private onChange(value: string): void {

        var isValid = true;
        if (value && value.length > 0) {
            isValid = this.validateEmail(value);
        }

        this.setState({ value: value, isValid: isValid });

        var fp = this.props.onChange;
        if (fp) {
            if (isValid)
            {
                fp(value);
            }
            else {
                fp(undefined);
            }
        }
    }

    // https://stackoverflow.com/a/46181/534514
    private validateEmail(email: string): boolean {
        var x = String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
        return !!x;
    };
}