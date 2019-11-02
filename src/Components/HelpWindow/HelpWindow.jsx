import React, { Component } from 'react';
import Key from './Key.jsx'
import { 
  Container,
  CloseButton,
  Content,
  Line,
  Action,
  Keys,
  KeysBlock
} from './HelpWindowStyles.jsx'

import Close from '../../Assets/Images/Icons/close.png'
import CloseHover from '../../Assets/Images/Icons/close_hover.png'

class HelpWindow extends Component {
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
      <Container ref={this.window} className="rpgui-container framed-golden">
        <CloseButton 
          src={this.state.hoverCloseButton ? CloseHover : Close} 
          alt="close" 
          className="rpgui-cursor-point"
          onClick={() => this.closeWindow()} 
          onMouseEnter={() => this.setState({ hoverCloseButton: true })} 
          onMouseLeave={() => this.setState({ hoverCloseButton: false })}
        />
        <Content>
          <Line>
            <Action>Move</Action>
            <Keys column>
              <KeysBlock>
                <Key direction="up" />
                <Key direction="down" />
                <Key direction="left" />
                <Key direction="right" />
              </KeysBlock>
              <KeysBlock>
                <Key char="W" />
                <Key char="S" />
                <Key char="A" />
                <Key char="D" />
              </KeysBlock>
            </Keys>
          </Line>
          <Line>
            <Action>Attack or Interact</Action>
            <Keys column>
              <KeysBlock column>
                <Key char="Space" large />
                (Hold for action)
              </KeysBlock>
            </Keys>
          </Line>
          <Line>
            <Action>Loot</Action>
            <Keys column>
              <KeysBlock column>
                <Key char="Shift" large />
              </KeysBlock>
            </Keys>
          </Line>
          <Line>
            <Action>Abilities hotkeys</Action>
            <Keys column>
              <KeysBlock>
                <Key char="q" />
                <Key char="e" />
                <Key char="r" />
                <Key char="t" />
                <Key char="f" />
              </KeysBlock>
            </Keys>
          </Line>
          <Line>
            <Action>Item hotkeys</Action>
            <Keys column>
              <KeysBlock>
                <Key char="1" /> -&nbsp;<Key char="9" />
              </KeysBlock>
            </Keys>
          </Line>
          <Line>
            <Action>Turn in place</Action>
            <Keys column>
              <KeysBlock column>
                <Key char="Ctrl" large />
                (Hold)
              </KeysBlock>
            </Keys>
          </Line>
          <Line>
            <Action>Use / Equip / Unequip</Action>
            <Keys column>
              <KeysBlock column>
                Left click and select use
              </KeysBlock>
            </Keys>
          </Line>
          <Line>
            <Action>Drop</Action>
            <Keys column>
              <KeysBlock column>
                Right click item
              </KeysBlock>
            </Keys>
          </Line>
          <Line>
            <Action>Build dialog</Action>
            <Keys column>
              <KeysBlock>
                <Key char="b" />
              </KeysBlock>
            </Keys>
          </Line>
          <Line>
            <Action>Toggle Inventory</Action>
            <Keys column>
              <KeysBlock>
                <Key char="tab" large />
              </KeysBlock>
            </Keys>
          </Line>
          <Line>
            <Action>Switch channel</Action>
            <Keys column>
              <KeysBlock>
                <Key char="c" />
              </KeysBlock>
            </Keys>
          </Line>
          <Line>
            <Action>Character stats</Action>
            <Keys column>
              <KeysBlock>
                <Key char="i" />
              </KeysBlock>
            </Keys>
          </Line>
          <Line>
            <Action>Skills</Action>
            <Keys column>
              <KeysBlock>
                <Key char="k" />
              </KeysBlock>
            </Keys>
          </Line>
          <Line>
            <Action>Upgrade</Action>
            <Keys column>
              <KeysBlock>
                <Key char="u" />
              </KeysBlock>
            </Keys>
          </Line>
        </Content>
      </Container>
    );
  }
}

export default HelpWindow;