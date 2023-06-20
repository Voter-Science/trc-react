import * as React from "react";
import { TextInput } from "./TextInput";

interface IProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
}

interface IState {
  isValid: boolean;
}

export class EmailTextInput extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      isValid: true,
    };
    this.onChange = this.onChange.bind(this);
  }

  private onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const value = event.target.value;
    const isValid = this.validateEmail(value);

    this.setState({ isValid });

    this.props.onChange(value);
  }

  private validateEmail(email: string): boolean {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email.toLowerCase());
  }

  render() {
    const { label, value } = this.props;
    const { isValid } = this.state;
    const conditionalTextStyle = {
        padding: 0,
        margin: 0,
        color: 'red',
        fontStyle: 'italic',
        // position: 'relative',
        // zIndex: 1
        marginTop: '20px'
    };
    return (
        <div>
            <TextInput
              label={label}
              placeholder="email@voter-science.com"
              value={value}
              onChange={this.onChange}
              list="emails"
              />

            {!this.validateEmail(value)&&<p style={conditionalTextStyle}>Not a valid email</p>}
            
            <datalist id="emails">
                <option value="ethan@gmail.com" />
                <option value="ethan@voter-science.com" />
                <option value="mike@gmail.com" />
                <option value="bill@voter-science.com" />
                <option value="e@themeadowsschool.org" />
            </datalist>
        </div>
    );
  }
}