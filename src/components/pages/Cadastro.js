import React from "react"
import {useState, useEffect} from 'react'
import styles from './Cadastro.module.css'

function Cadastro(){
    const [programa, setPrograma] = useState([]);

    function Post(programa){

        fetch('https://localhost:7046/api/Aquecimento/programa', {
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(programa),
        })
        .then((resp) => resp.json())
        .then((data) => {})
        .catch(err => console.log(err))    
    }

    const submit = (e) =>{
        e.preventDefault()    
        
        if (
            !programa.nomeDoPrograma ||
            !programa.alimento ||
            !programa.stringDeAquecimento ||
            programa.tempo === null || programa.tempo === undefined ||
            programa.potencia === null || programa.potencia === undefined
        ) {
            alert("Preencha todos os campos obrigatórios!");
            return;
        }
        
        Post(programa)   
        
    }

    function handleChange(e){
        setPrograma({...programa, [e.target.name]: e.target.value})
    }


    return(
       <div>
        <form onSubmit={submit} className={styles.form}>
        <label>Nome do Programa: </label>
        <input
            type="text"
            text="Nome do Programa"
            name="nomeDoPrograma"
            placeholder="Nome do Programa"
            value={programa.nomeDoPrograma || ""}
            onChange={handleChange}
        />
        <br/>
        <label>Alimento: </label>
        <input
            type="text"
            text="Alimento"
            name="alimento"
            placeholder="Alimento"
            value={programa.alimento || ""}
            onChange={handleChange}
        />
        <br/>
        <label>String de Aquecimento: </label>
        <input
            type="text"
            text="String de Aquecimento"
            name="stringDeAquecimento"
            placeholder="StringDeAquecimento"
            value={programa.stringDeAquecimento || ""}
            onChange={handleChange}
        />
        <br/>
        <label>Instruções Complementares: </label>
        <input
            type="text"
            text="Instruções Complementares"
            name="instrucoesComplementares"
            placeholder="InstruçõesComplementares"
            value={programa.instrucoesComplementares || ""}
            onChange={handleChange}
        />
        <br/>
        <label>Aquecimento: </label>
        <input
            type="text"
            text="Aquecimento"
            name="aquecimento"
            placeholder="Aquecimento"
            value={programa.aquecimento || ""}
            onChange={handleChange}
        />
        <br/>
        <label>Tempo: </label>
        <input
            type="number"
            text="Tempo"
            name="tempo"
            placeholder="Insira o tempo"
            value={programa.tempo || ""}
            onChange={handleChange}
        />
        <br/>
        <label>Potência: </label>
        <input
            type="number"
            name="potencia"
            text="Potência"
            placeholder="Insira a potência"
            value={programa.potencia || ""}
            onChange={handleChange}
        />
        <input type="submit" value="Aquecer" />
        <br />
        </form>
        </div>
    )

}

export default Cadastro