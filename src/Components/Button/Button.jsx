import React, { Component } from 'react';
import { 
  Container,
  Button,
} from './ButtonStyles.jsx'

class Btn extends Component {

  get isTransparent() {
    return this.props.type === 'transparent';
  }

  render() {
    const { type, icon, iconSize, action, children } = this.props;

    return (
      <Container>
        <Button 
          className={`${this.isTransparent ? '' : 'rpgui-button'}`}
          onClick={action}
          iconSize={iconSize}
          type={type}
        >
          {icon ? (
            <img src={icon} alt='' />
          ) : (
            <span>{children}</span>
          )}
        </Button>
      </Container>
    );
  }
}

export default Btn;