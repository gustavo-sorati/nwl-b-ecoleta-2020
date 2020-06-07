import React from 'react';

// FC - Functional Component, Um componente escrito em formato de função ele é um Generic (um tipo de typescript que pode receber um parametro)
// iterface forma de definir a tipagem de um objeto no javascript


interface HeaderProps {
    title?:string; // opcional
    // title:string; // obrigatorio
}

const  Header: React.FC<HeaderProps> = (props) => {
    return (
        <header>
            <h1>{props.title}</h1>
        </header>
    )
}

export default Header;