import React, {useMemo , useState} from "react";
import { Container, Profile,Welcome,Username} from "./styles";
import emojis from "../../utils/emojis";
import Toogle from "../Toogle";

import { useTheme } from "../../utils/Hooks/theme";

const MainHeader: React.FC = () => {
    const { toggleTheme , theme} = useTheme();

    const [darkTheme , setDarkTheme] = useState(()=> theme.title === 'dark' ? true : false);

    const handleChangeTheme = () =>{
        setDarkTheme(!darkTheme);
        toggleTheme();
    }

    const emoji =useMemo(()=>{
        const indice = Math.floor(Math.random() * emojis.length);
        return emojis[indice];

    },[]);
    return(
        <>
            <Container>
                <Toogle
                    labelLeft="Light"
                    labelRight="Dark"
                    checked={darkTheme}
                    onChange={handleChangeTheme}
                />

                <Profile>
                    <Welcome>Olá,{emoji}</Welcome>
                    <Username>Alex Angelos</Username>
                </Profile>
            </Container>
        </>
        
    );
}

export default MainHeader;