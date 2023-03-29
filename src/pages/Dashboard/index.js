import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../contexts/auth";
import Header from "../../components/Header";
import Title from "../../components/Title";
import { collection, getDocs, orderBy, limit, startAfter, query } from "firebase/firestore";
import "./styles.css";
import { Link } from "react-router-dom";
import {AiOutlineFileSearch} from 'react-icons/ai'
import { FiPlus, FiMessageSquare, FiSearch, FiEdit3 } from "react-icons/fi";
import { db } from "../../services/firebaseConnection";
import { format } from 'date-fns'
import Modal from "../../components/Modal";

const listRef = collection(db, "chamados")

export default function Dashboard() {
  const { logout } = useContext(AuthContext);

  const [chamados, setChamados] = useState([])
  const [loading, setLoading] = useState(true);

  const [isEmpty, setIsEmpty] = useState(false)
  const [lastDocs, setLastDocs] = useState()
  const [loadingMore, setLoadingMore] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false)
  const [detail, setDetail] = useState()

  useEffect(() => {
    async function loadChamados(){
      const q = query(listRef, orderBy('created', 'desc'), limit(5));

      const querySnapshot = await getDocs(q)
      setChamados([]);

      await updateState(querySnapshot)

      setLoading(false);

    }

    loadChamados();


    return () => { }
  }, [])


  async function updateState(querySnapshot){
    const isCollectionEmpty = querySnapshot.size === 0;

    if(!isCollectionEmpty){
      let lista = [];

      querySnapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          assunto: doc.data().assunto,
          cliente: doc.data().cliente,
          clienteId: doc.data().clienteId,
          created: doc.data().created,
          createdFormat: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
          status: doc.data().status,
          complemento: doc.data().complemento,
        })
      })

      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1] // Pegando o ultimo item

      setChamados(chamados => [...chamados, ...lista])
      setLastDocs(lastDoc);

    }else{
      setIsEmpty(true);
    }

    setLoadingMore(false);

  }


  async function handleMore(){
    setLoadingMore(true);

    const q = query(listRef, orderBy('created', 'desc'), startAfter(lastDocs),  limit(5));
    const querySnapshot = await getDocs(q);
    await updateState(querySnapshot);

  }

  function toogleModal(item){
setShowPostModal(!showPostModal)
setDetail(item)
  }


  if(loading){
    return(
      <div>
        <Header/>

        <div className="content">
          <Title name="Tickets">
            <FiMessageSquare size={25} />
          </Title>

          <div className="container dashboard">
            <span>Buscando chamados...</span>
          </div>
        </div>
      </div>
    )
  }

  return(
    <div>
      <Header/>

      <div className="content">
        <Title name="Tickets">
          <FiMessageSquare size={25} />
        </Title>

        <>
          {chamados.length === 0 ? (
            <div className="container dashboard">
              <span>Nenhum chamado encontrado...</span>
              <Link to="/new" className="new">
                <FiPlus color="#FFF" size={25} />
                Novo chamado
              </Link>  
            </div>
          ) : (
            <>
              <Link to="/new" className="new">
                <FiPlus color="#FFF" size={25} />
                Novo chamado
              </Link>  

              <table>
                <thead>
                  <tr>
                    <th scope="col">Cliente</th>
                    <th scope="col">Serviço</th>
                    <th scope="col">Status</th>
                    <th scope="col">Data de registro</th>
                    <th scope="col">#</th>
                  </tr>
                </thead>
                <tbody>
                  {chamados.map((item, index) => {
                    return(
                      <tr key={index}>
                        <td data-label="Cliente">{item.cliente}</td>
                        <td data-label="Assunto">{item.assunto}</td>
                        <td data-label="Status">
                          <span className="badge" style={{ backgroundColor: item.status === 'Aberto' ? '#5cb85c' : '#999' }}>
                            {item.status}
                          </span>
                        </td>
                        <td data-label="Cadastrado">{item.createdFormat}</td>
                        <td data-label="#">
                          <button onClick={() => toogleModal(item)} className="action" style={{ backgroundColor: '#00acee' }}>
                            <AiOutlineFileSearch color='#FFF' size={20}/>
                          </button>
                          <Link to={`/new/${item.id}`} className="action" style={{ backgroundColor: '#f6a935' }}>
                            <FiEdit3 color='#FFF' size={17}/>
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>   
              {loadingMore && <h3>Buscando mais chamados...</h3>}    
              {!loadingMore && !isEmpty && <button className="btn-more" onClick={handleMore}>Buscar mais</button>  }  
            </>
          )}
        </>

      </div>
   {showPostModal && (
    <Modal conteudo={detail} close={()=> setShowPostModal(!showPostModal)}/>
   )}
    </div>
  )
}
