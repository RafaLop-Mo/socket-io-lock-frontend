import React, { Component } from 'react';
import { Input } from '../../components';
import './FormPage.scss';
import { difference } from '../../utils/deepDiff';

export class FormPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialServerData: undefined,
      currentServerData: undefined,
      draftData: undefined,
      conficts: {}
    };
  }

  componentDidUpdate() {
    const { socket } = this.props;
    const { initialServerData } = this.state;
    if (socket) {
      socket.on('newData', (data) => {
        if (!initialServerData) this.setState({ initialServerData: data, currentServerData: data });
        else {
          this.setState({ currentServerData: data });
        }
      });
      socket.on('lock', (lockedData) => {
        this.setState({lockedData})
      });;
      socket.on('unlock', (lockedData) => {
        this.setState({lockedData: undefined})
      });
    }
  }

  onInputChange = (event) => {
    const { draftData } = this.state;
    const inputValue = event.currentTarget.value;
    const inputName = event.currentTarget.name;
    this.setState({
      draftData: {
        ...draftData,
        [`${inputName}`]: inputValue
      }
    });
  };

  onSubmit = () => {
    const { socket } = this.props;
    const {
      initialServerData,
      currentServerData,
      draftData
    } = this.state;

    const draftInitialDiff = difference(draftData, initialServerData);
    const initialCurrentDiff = difference(currentServerData, initialServerData);
    const conflicts = difference(initialCurrentDiff, draftInitialDiff);
    this.setState({conflicts});
    console.log('draftInitialDiff')
    console.log(draftInitialDiff)
    console.log('initialCurrentDiff')
    console.log(initialCurrentDiff)
    console.log('conflicts')
    console.log(conflicts)
    if (Object.entries(conflicts).length === 0){
      socket.emit('saveData', draftData)
      this.setState({draftData: undefined})
    }
    else {
      console.log('Conflictd', conflicts)
    }
  };

  render() {
    const { draftData, lockedData, currentServerData } = this.state;
    return (
      <>
        <Input
          name="name"
          label="Name"
          value={draftData && typeof draftData.name !== "undefined" ? draftData.name : (currentServerData && currentServerData.name)}
          onChange={this.onInputChange}
          lock={lockedData && !!lockedData.name}
        />
        <Input
          name="lastName"
          label="Last Name"
          value={draftData && typeof draftData.lastName !== "undefined" ? draftData.lastName : (currentServerData && currentServerData.lastName)}
          onChange={this.onInputChange}
          lock={lockedData && !!lockedData.lastName}
        />
        <Input
          name="country"
          label="Country"
          value={draftData && typeof draftData.country !== "undefined" ? draftData.country : (currentServerData && currentServerData.country)}
          onChange={this.onInputChange}
          lock={lockedData && !!lockedData.country }
        />
        <button onClick={this.onSubmit} disabled={false}>
          Save
        </button>
        <div className="textareaRow">
          <label htmlFor="difference">Data Difference</label>
          <textarea name="difference" rows={10} value={JSON.stringify({}, 2)} />
        </div>
      </>
    );
  }
}
