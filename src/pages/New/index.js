import { useState, useEffect, useContext } from "react";
import Header from "../../components/Header";
import Title from "../../components/Title";
import "./styles.css";
import { useParams, useNavigate } from "react-router-dom";
import { FiPlusCircle } from "react-icons/fi";
import { AuthContext } from "../../contexts/auth";
import { db } from "../../services/firebaseConnection";
import { collection, getDocs, getDoc, doc, addDoc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const listRef = collection(db, "custumers");

export default function New() {
  const { user } = useContext(AuthContext);
const {id} = useParams();
const navigate = useNavigate()
  const [customers, setCustomers] = useState([])
  const [loadCustomer, setLoadCustomer] = useState(true);
  const [customerSelected, setCustomerSelected] = useState(0)
  const [idCostumer, setIdCostumer] = useState(false)
  const [complemento, setComplemento] = useState('')
  const [assunto, setAssunto] = useState('Suporte')
  const [status, setStatus] = useState('Aberto')

async function loadId(lista){
  const docRef = doc(db, "chamados", id)
  await getDoc(docRef)
  .then((snapshot)=>{
setAssunto(snapshot.data().assunto)
setStatus(snapshot.data().status)
setComplemento(snapshot.data().complemento)

let index = lista.findIndex(item => item.id === snapshot.data().clienteId)
setCustomerSelected(index)

setIdCostumer(true)

}).catch((error)=>{
      toast.warning("Registro não encontrado")
      setIdCostumer(false)
  })
}



  useEffect(() => {
    async function loadCustomers(){
      const querySnapshot = await getDocs(listRef)
      .then( (snapshot) => {
        let lista = [];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            nomeCliente: doc.data().nomeCliente
          })
        })

        if(snapshot.docs.size === 0){
         
          setLoadCustomer(false);
          return;
        }

        setCustomers(lista);
        setLoadCustomer(false);

        if(id){
          loadId(lista)
        }

      })
      .catch((error) => {
        console.log("ERRRO AO BUSCAR OS CLIENTES", error)
        setLoadCustomer(false);
      })
    }

    loadCustomers();    
  }, [id])


  function handleOptionChange(e){
    setStatus(e.target.value);
  }

  function handleChangeSelect(e){
    setAssunto(e.target.value)
  }

  function hnadleChangeCustomer(e){
    console.log(customers[e.target.value].nomeCliente);
  }

  async function handleRegister(e){
    e.preventDefault();

if(idCostumer){
const docRef = doc(db, "chamados", id)
await updateDoc(docRef,{
  cliente: customers[customerSelected].nomeCliente,
  clienteId: customers[customerSelected].id,
  assunto: assunto,
  complemento: complemento,
  status: status,
  userId: user.uid,
}).then(()=>{
  toast.info("Atualização realizada com sucesso!!!")
  setCustomerSelected(0)
  setComplemento("")
  navigate("/dashboard")
}).catch(()=>{
  toast.error("Falha na operação")
})

  return;
}


    //Registrar um chamado
    await addDoc(collection(db, "chamados"), {
      created: new Date(),
      cliente: customers[customerSelected].nomeCliente,
      clienteId: customers[customerSelected].id,
      assunto: assunto,
      complemento: complemento,
      status: status,
      userId: user.uid,
    })
    .then(() => {
      toast.success("Registrado!")
      setComplemento('')
      setCustomerSelected(0)
    })
    .catch((error) => {
      toast.error("Ops erro ao registrar!")
    })
  }

  return(
    <div>
      <Header/>

      <div className="content">
        <Title name="Novo chamado">
          <FiPlusCircle size={25}/>
        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={handleRegister}>

            <label>Clientes</label>
            {
              loadCustomer ? (
                <input type="text" disabled={true} value="Carregando..." />
              ) : (
                <select value={customerSelected} onChange={hnadleChangeCustomer}>
                  {customers.map((item, index) => {
                    return(
                      <option key={index} value={index}>
                        {item.nomeCliente}
                      </option>
                    )
                  })}
                </select>
              )
            }

            <label>Serviço</label>
            <select value={assunto} onChange={handleChangeSelect}>
              <option value="Suporte">Suporte</option>
              <option value="Visita Tecnica">Visita Tecnica</option>
              <option value="Financeiro">Financeiro</option>
              <option value="Limpeza">Limpeza</option>
              <option value="Atendimento">Atendimento</option>
              <option value="Envio de produto">Envio de produto</option>
            </select>

            <label>Status</label>
            <div className="status">
              <input
                type="radio"
                name="radio"
                value="Aberto"
                onChange={handleOptionChange}
                checked={ status === 'Aberto' }
              />
              <span>Em aberto</span>

              <input
                type="radio"
                name="radio"
                value="Progresso"
                onChange={handleOptionChange}
                checked={ status === 'Progresso' }
              />
              <span>Progresso</span>

              <input
                type="radio"
                name="radio"
                value="Concluido"
                onChange={handleOptionChange}
                checked={ status === 'Concluido' }
              />
              <span>Concluido</span>
            </div>


            <label>Complemento</label>
            <textarea
              type="text"
              placeholder="Descreva seu problema (opcional)."
              value={complemento}
              onChange={ (e) => setComplemento(e.target.value) }
            />

            <button type="submit">Registrar</button>

          </form>
        </div>
      </div>
    </div>
  )
}
