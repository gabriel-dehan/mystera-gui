import React, { Component } from 'react';
import { 
  Container,
  Button,
} from './ButtonStyles.jsx'

class Btn extends Component {

  get isSimple() {
    return this.props.type === 'simple';
  }

  get isPrimary() {
    return this.props.type === 'primary';
  }

  get isSecondary() {
    return this.props.type === 'secondary';
  }

  render() {
    const { type, icon, iconSize, action, children, iconWidth, iconHeight } = this.props;
    let className = '';
    
    if (!this.isSimple) {
      className += 'rpgui-button'  ;
    }

    if (this.isPrimary) {
      className += ' primary';
    } else if (this.isSecondary) {
      className += ' grey';
    }

    return (
      <Container>
        <Button 
          hasIcon={!!icon}
          className={className}
          iconSize={iconSize}
          iconWidth={iconWidth}
          iconHeight={iconHeight}
          onClick={action}
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