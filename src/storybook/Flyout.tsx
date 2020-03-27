import styled from 'styled-components';

import { COLORS } from './styles';

const Flyout = styled.div<{ state?: string; relatedWidth?: number }>`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  text-align: center;
  width: ${props =>
    props.relatedWidth !== undefined ? `${props.relatedWidth}px` : '250px'};
  height: 120px;
  padding: 20px;
  margin: 10px 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  background: ${COLORS.background};
  color: ${COLORS.text};
  opacity: 1;
  transition: opacity 0.2s linear;

  ${props =>
    props.state === 'exiting' || props.state === 'exited' ? 'opacity: 0;' : ''}
`;

export default Flyout;
