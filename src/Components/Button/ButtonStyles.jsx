import styled from 'styled-components';

export const Container = styled.div`
`;

export const Button = styled.button`
  background-color: transparent;
  border: none;
  padding: ${props => props.hasIcon  ? '0' : '10px 15px' };

  width: ${props => props.hasIcon ? 
    props.type === 'simple' ? 'initial' : '46px' :
    'initial'
  };
  height: ${props => props.hasIcon ? 
    props.type === 'simple' ? 'initial' : '46px' :
    'initial'
  };  

  img {
    width: ${props => props.iconWidth ? `${props.iconWidth}px` : 'initial'};
    height: ${props => props.iconHeight ? `${props.iconHeight}px` : 'initial'};
  }

  &:hover img, &:active img {
    opacity: 0.85;
  }
`;
