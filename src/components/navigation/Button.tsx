import * as React from 'react';
import styled, { StyledFunction } from 'styled-components'

interface ButtonProps {
    type?: string,
    onClick?: Function
}

const buttonBase: StyledFunction<ButtonProps & React.HTMLProps<JSX.Element>> = styled.button

const Button = buttonBase`
    color: #fff;
    background-color: #f90
`

Button.defaultProps = {
    type: 'button'
}

export { Button }
