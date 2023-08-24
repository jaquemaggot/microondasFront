import React from "react"
import {useState, useEffect} from 'react'
import { Link } from "react-router-dom"

function Home(){
    const [aquecimento, setAquecimento] = useState({ tempo: 0, potencia: 0, cancelado: false });
    const [programas, setProgramas] = useState([]);

    const [progresso, setProgresso] = useState("");

    const [tempoRestante, setTempoRestante] = useState(0);

    let intervalId;
    const [aquecimentoExecutando, setAquecimentoExecutando] = useState(null)
    const [aquecimentoPausado, setAquecimentoPausado] = useState(false)
    const [programa, setPrograma] = useState(0)
    
    useEffect(() => {
        BuscarProgramas()
    },[]);

    
    function Post(aquecimento){

        fetch('https://localhost:7046/api/Aquecimento', {
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(aquecimento),
        })
        .then((resp) => resp.json())
        .then((data) => {
            setAquecimentoExecutando(data.id)
            VerificarAquecimento(data.id)
        })
        .catch(err => console.log(err))    
    }

    function PostAcrescentar(id){

        fetch(`https://localhost:7046/api/Aquecimento/${id}`, {
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
        })
        .then((resp) => resp.json())
        .then((data) => {
        })
        .catch(err => console.log(err))    
    }
    
    const submit = (e) =>{
        e.preventDefault()
       
        var validacoes = Validacoes(aquecimento);

        if(validacoes){
            if(aquecimentoExecutando === null){

                Post(aquecimento)
            }
            else{
                PostAcrescentar(aquecimentoExecutando)
            }
            
            if(aquecimento.tempo > 60 && aquecimento.tempo < 100){

                aquecimento.tempo = '1:' + (aquecimento.tempo - 60).toString()

                setAquecimento({...aquecimento})
            }

            if (tempoRestante === 0 && !aquecimento.cancelado) {
                // Iniciar contagem regressiva do tempo
                setTempoRestante(aquecimento.tempo);
            }
        }
    }

   
    function handleChange(e){
        const newValue = e.target.value;
        const updatedAquecimento = {
        ...aquecimento,
        [e.target.name]: newValue,
        };

        if (e.target.name === "potencia" && newValue === "") {
            updatedAquecimento.potencia = 10;
        }
        if (e.target.name === "tempo" && newValue === "") {
            updatedAquecimento.tempo = 30;
        }

        setAquecimento(updatedAquecimento);
    }

    

    function handleOnChange(e){
        setPrograma(e.target.value)
        var prog = programas.filter((f) => f.id == e.target.value)
        if(prog){
            setAquecimento({...aquecimento,["tempo"]: prog[0].tempo,["potencia"]: prog[0].potencia})
        }
    }

    const pausarAquecimento = () => {
        if(aquecimentoExecutando === null || aquecimentoPausado){
            setAquecimento({ tempo: 0, potencia: 0, cancelado: false });
          setTempoRestante(0);
          setProgresso("");
          setAquecimentoPausado(false)
          setAquecimentoExecutando(null)
        }else{
           setAquecimentoPausado(true)
        }
        PostCancelar(aquecimentoExecutando)
        
    };

    function PostCancelar(id){

        fetch(`https://localhost:7046/api/Aquecimento/cancelar/${id}`, {
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
        })
        .then((resp) => resp.json())
        .then((data) => {
        })
        .catch(err => console.log(err))    
    }
   
    function Validacoes(aquecimento){
    
        if(aquecimento.tempo === 0 && aquecimento.potencia === 0){
           InicioRapido(aquecimento)
           return true
        }

        if((aquecimento.tempo > 120 || aquecimento.tempo < 1) && programa === 0){
            alert("O tempo deve ser menor que 2 minutos e maior que 1 segundo")
            return false
        }

        if((aquecimento.potencia > 10 || aquecimento.potencia < 0) && programa === 0){
            alert("A potência deve ser entre 0 e 10")
            return false
        }
        return true        
    }

    function InicioRapido(aquecimento){
        aquecimento.tempo = 30
        aquecimento.potencia = 10
    }

    function VerificarAquecimento(id){
            fetch(`https://localhost:7046/api/Aquecimento/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((resp) => resp.json())
                .then((data) => {
                setProgresso(data.stringDeAquecimento)
                
                if(!data.finalizado){

                    setTimeout(()=>VerificarAquecimento(id),1000) 
                }
                else{
                    setAquecimentoExecutando(null)
                }}
                )
            .catch(err => console.log(err))

    }

    function BuscarProgramas(){
        fetch(`https://localhost:7046/api/Aquecimento/programas`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((resp) => resp.json())
            .then((data) => {
                setProgramas(data)
            })
        .catch(err => console.log(err))

    }

    return (
        <section>
    <h1>Microondas</h1>
    <form onSubmit={submit}>
      <input
        type="number"
        text="Tempo"
        name="tempo"
        placeholder="Insira o tempo"
        value={aquecimento.tempo || ""}
        onChange={handleChange}
      />
      <input
        type="number"
        name="potencia"
        placeholder="Insira a potencia"
        value={aquecimento.potencia || ""}
        onChange={handleChange}
      />
      <input type="submit" value="Aquecer" />
      <br />
    </form>
    <select
        name="programas"
        id="programas"
        onChange={handleOnChange}
        value={programa || ''}
      >
        <option>Selecione uma opção</option>
        {programas.map((option) => (
          <option value={option.id} key={option.id}>
            {option.nomeDoPrograma}
          </option>
        ))}
      </select>
    <button onClick={pausarAquecimento}>Pausar/Cancelar</button>
    <Link to="/cadastro">Cadastrar Programa</Link>
    <h2>{progresso}</h2>
  </section>
    )
}

export default Home