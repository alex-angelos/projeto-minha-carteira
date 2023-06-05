import React, {useState} from "react";

import { Container , Logo , Form, FormTitle } from "./styles";
import LogoImg from '../../Assets/logo.svg';
import Input from "../../Components/Input";
import Button from "../../Components/Button";

import { useAuth } from "../../utils/Hooks/auth";

const Signin: React.FC = () => {
    const [ email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const { signIn } = useAuth();


    return(
        <Container>
            <Logo>
                <img src={LogoImg} alt="Minha Carteira" />
                <h2>Minha Carteira</h2>
            </Logo>
            <Form onSubmit={()=> signIn(email,password)}>
                <FormTitle>Entrar</FormTitle>
                <Input 
                    type="email"
                    placeholder="e-mail"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input 
                    type="password"
                    placeholder="senha"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button type="submit">Acessar</Button>
            </Form>
            
        </Container>
    );
}

export default Signin;