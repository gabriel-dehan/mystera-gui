import React, { Component } from 'react';

import { 
  Container,
  CloseButton,
} from './SettingsWindowStyles'

import Close from '../../Assets/Images/Icons/close.png'
import CloseHover from '../../Assets/Images/Icons/close_hover.png'

class SettingsWindow extends Component {
  constructor() {
    super();

    this.window = React.createRef();
  }

  state = {
    hoverCloseButton: false
  }

  componentDidMount() {
    document.addEventListener('mousedown', (e) => {
      if (this.window.current && !this.window.current.contains(e.target)) {
        this.closeWindow()
      }
    });

    // window.addEventListener('blur', () => this.closeWindow());
  }

  componentWillUnmount() {
    document.addEventListener('mousedown', (e) => {
      if (this.window.current && !this.window.current.contains(e.target)) {
        this.closeWindow()
      }
    });

    // window.removeEventListener('blur', () => this.closeWindow());
  }

  closeWindow() {
    this.props.onClose();
  }

  render() {
    return (
      <Container ref={this.window} className="rpgui-container framed-dark-black">
        <CloseButton 
          src={this.state.hoverCloseButton ? CloseHover : Close} 
          alt="close" 
          className="rpgui-cursor-point"
          onClick={() => this.closeWindow()} 
          onMouseEnter={() => this.setState({ hoverCloseButton: true })} 
          onMouseLeave={() => this.setState({ hoverCloseButton: false })}
        />
      </Container>
    );
  }
}

export default SettingsWindow;