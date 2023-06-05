import React from 'react';
import { Container,ToogleLabel} from './style';
import { ToogleSelector } from './style';

interface IToggleProps{
    labelLeft: string;
    labelRight: string;
    checked: boolean;
    onChange() :void;
}


const Toogle: React.FC<IToggleProps> =({
    labelLeft,
    labelRight,
    checked,
    onChange,

}) =>(
    <Container>
        <ToogleLabel>{labelLeft}</ToogleLabel>
    <ToogleSelector
        checked = {checked}
        uncheckedIcon ={false}
        checkedIcon ={false}
        onChange ={onChange}
    />
        <ToogleLabel>{labelRight}</ToogleLabel>
    </Container>
)

export default Toogle;