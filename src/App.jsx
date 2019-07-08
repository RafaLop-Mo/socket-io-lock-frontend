import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import "./App.scss";
import { config } from "./config/config";
import { FormPage } from './pages'; 

class App extends Component {
  constructor() {
    super();
    this.state = {
      socket: undefined
    };
  }

  componentDidMount() {
    // Socket Setup
    const socket = socketIOClient(config.socket.endpoint);

    this.setState({ socket });
  }

  render() {
    const { socket } = this.state;
    return (
      <div className="container">
        <FormPage socket={socket}></FormPage>
      </div>
    );
  }
}
export default App;