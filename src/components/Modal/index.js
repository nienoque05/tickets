import { useState, useEffect, useContext } from "react";
import { FiX} from 'react-icons/fi'
import './styles.css'
export default function Modal({conteudo, close}){

  return(
    <div className="modal">
      <div className="container">
        <button className="close" onClick={close}>
          <FiX size={25} color="#FFF" />
          Voltar
        </button>

        <main>
          <h2>Detalhes do chamado</h2>

          <div className="row">
            <span>
              Cliente: <i>{conteudo.cliente}</i>
            </span>
          </div>

          <div className="row">
            <span>
            Serviço: <i>{conteudo.assunto}</i>
            </span>
            <span>
              Data de registro: <i>{conteudo.createdFormat}</i>
            </span>
          </div>

          <div className="row">
            <span>
              Status: <i style={{color: "#000", backgroundColor: conteudo.status === "Aberto" ? '#1ED760' : "gray"}}>{conteudo.status}</i>
            </span>
          </div>

          <>
            
            <p>
              {conteudo.complemento !== "" && (
                <>
                <h3>Complemento</h3>
                <p>{conteudo.complemento}</p>
                </>
              )}
            </p>
          </>

        </main>
      </div>
    </div>
  )
}