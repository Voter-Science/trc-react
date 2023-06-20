import * as React from "react";
import { TextInput } from "./common/TextInput";

interface IState {
    isNorth: boolean,
    isEast: boolean,
    latitude: number,
    longitude: number,
    northPointer: string,
    eastPointer: string
}

export class Maps extends React.Component<{}, IState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            latitude: 47.6205,
            longitude: 122.3493,
            isNorth: true,
            isEast: false,
            northPointer: '',
            eastPointer: ',-'
        };
    }

    handleLatitudeChange(event: React.ChangeEvent<HTMLInputElement>) {
        var northPointer = ''
        if (this.state.isNorth){ northPointer = '' } else { northPointer = '-'}
        this.setState({
            latitude: event.target.valueAsNumber,
            northPointer: northPointer,
        });
    }

    handleLongitudeChange(event: React.ChangeEvent<HTMLInputElement>) {
        var eastPointer = ',-'
        if (this.state.isEast){ eastPointer = ',' } else { eastPointer = ',-'}
        this.setState({
            longitude: event.target.valueAsNumber,
            eastPointer: eastPointer
        });
    }

    handleLatitudeToggle() {
        var northPointer = ''
        if (!this.state.isNorth){ northPointer = '' } else { northPointer = '-'}
        this.setState((prevState) => ({
            isNorth: !prevState.isNorth,
            northPointer: northPointer,
        }));
    }   

    handleLongitudeToggle() {
        var eastPointer = ''
        if (!this.state.isEast){ eastPointer = ',' } else { eastPointer = ',-'}
        this.setState((prevState) => ({
            isEast: !prevState.isEast,
            eastPointer: eastPointer,
        }));
    }  
// TODO: have a separate lat lon box and just have a button for n s e w
    render() {
        if (this.state.isNorth){ const northPointer = '' } else { const northPonter = '-'}
        if (this.state.isEast){ const eastPointer = ',' } else { const eastPonter = ',-'}
        const baseUrl = 'https://www.google.com/maps?q='
        const endUrl = '&t=&z=15&ie=UTF8&iwloc=&output=embed'
        const imageUrl = `${baseUrl}${this.state.northPointer}${this.state.latitude}${this.state.eastPointer}${this.state.longitude}${endUrl}`;
        const switchLatitudeText = this.state.isNorth ? 'North' : 'South';
        const switchLongitudeText = this.state.isEast ? 'East' : 'West';
        // console.log(imageUrl)
        return (
            <div>
                <TextInput
                    type="number"
                    value={this.state.latitude}
                    onChange={this.handleLatitudeChange.bind(this)}
                />
                <button onClick={this.handleLatitudeToggle.bind(this)}>{switchLatitudeText}</button>
                <TextInput
                    type="number"
                    value={this.state.longitude}
                    onChange={this.handleLongitudeChange.bind(this)}
                />
                <button onClick={this.handleLongitudeToggle.bind(this)}>{switchLongitudeText}</button>
                <iframe 
                    width="835"
                    height="620"
                    src={imageUrl} />
            </div>
        );
    }
    }

export default Maps;
