import { useState } from "react";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { FiUser } from "react-icons/fi";
import {db,storage} from '../../services/firebaseConnection'
import {addDoc, collection} from 'firebase/firestore'
import { toast } from "react-toastify";
export default function Custumers() {
  const [nome, setNome] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [endereco, setEndereco] = useState("");

async function handleRegister(e){
  e.preventDefault()
  if(nome !== '' && cnpj !== ''){
      await addDoc(collection(db, "custumers"), {
        nomeCliente: nome,
        cnpj: cnpj,
        endereco: endereco
      })
     .then(()=> {
      setNome("")
      setCnpj("")
      setEndereco("")
      toast.success("Cadastro realiado com sucesso!!!")
     })
  } else if(nome !== '' && cnpj === ''){
    await addDoc(collection(db, "custumers"), {
      nomeCliente: nome,
      cnpj: 'Não informado',
      endereco: endereco
    })
    .then(()=> {
      setNome("")
      setCnpj("")
      setEndereco("")
      toast.success("Cadastro realiado com sucesso!!!")
     })

     .catch((error) =>{
      toast.error("Falha ao cadastrar")
     })
  }
}

  return (
    <div>
      <Header />
      <div className="content">
        <Title name="Clientes">
          <FiUser color="#FFF" size={25} />
        </Title>
        <div className="container">
          <form className="form-profile" onSubmit={handleRegister}>
            <label>Nome</label>
            <input
              type="text"
              placeholder="Nome do Cliente"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <label>CNPJ</label>
            <input
              type="text"
              placeholder="CNPJ"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
            />
            <label>Endreço</label>
            <input
              type="text"
              placeholder="Endereço do Cliente"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
            />
            <button className="submit" type="submit">Salvar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
