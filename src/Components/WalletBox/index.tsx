import React , {useMemo} from "react";
import CountUp from "react-countup";
import { Container } from "./styles";

import dollarImg from '../../Assets/dollar.svg';
import arrowUpImg from '../../Assets/arrow-up.svg';
import arrowDownImg from '../../Assets/arrow-down.svg';

interface IWalletBoxProps{
    title: string;
    amount: number;
    footerlabel: string;
    icon: 'dollar' | 'arrowUp' | 'arrowDown';
    color: string;
}

const WalletBox: React.FC<IWalletBoxProps> = ({
    title,
    amount,
    footerlabel,
    icon,
    color
}) => {

    const iconSelected = useMemo(() =>{
        switch (icon){
            case 'dollar':
                return dollarImg;
            case 'arrowUp':
                return arrowUpImg;
            case 'arrowDown':
                return arrowDownImg;
            default:
                return undefined;
        }
    }, [icon]);

    return(
            <Container color={color}>
                <span>{title}</span>
                <h1><CountUp 
                    end={amount}
                    prefix={"R$ "}
                    separator="."
                    decimal=","
                    decimals={2}
                />
                </h1>
                <small>{footerlabel}</small>
               <img src={iconSelected} alt={title}/>
                
            </Container>

        
    );
}

export default WalletBox;