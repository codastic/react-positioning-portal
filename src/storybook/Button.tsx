import styled from 'styled-components';

import { COLORS } from './styles';

const Button = styled.button`
  background-color: ${COLORS.primary};
  padding: 8px 16px;
  color: ${COLORS.textInvert};
  text-transform: uppercase;
  border-radius: 4px;
  letter-spacing: 0.03;
  outline: none;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s linear;
  font-size: 14px;

  &:hover,
  &:focus {
    background-color: ${COLORS.primaryActive};
  }
`;

export default Button;
