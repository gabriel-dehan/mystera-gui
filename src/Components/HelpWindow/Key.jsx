import React from 'react';
import { 
  KeyIcon
} from './HelpWindowStyles.jsx'

import BlankKey from '../../Assets/Images/Icons/key_blank.png'
import BlankKeyLarge from '../../Assets/Images/Icons/key_blank_lg.png'
import KeyRight from '../../Assets/Images/Icons/key_right.png'
import KeyLeft from '../../Assets/Images/Icons/key_left.png'
import KeyUp from '../../Assets/Images/Icons/key_up.png'
import KeyDown from '../../Assets/Images/Icons/key_down.png'

const KEYS = {
  right: KeyRight,
  left: KeyLeft,
  up: KeyUp,
  down: KeyDown
}

export default (props) => {
  let bg = BlankKey;

  if (props.direction) {
    bg = KEYS[props.direction];
  }

  if (props.large) {
    bg = BlankKeyLarge;
  }

  return (
    <KeyIcon {...props} background={bg}>
      {props.char}
    </KeyIcon>
  )
 
};