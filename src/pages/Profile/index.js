import Header from '../../components/Header';
import Title from '../../components/Title';
import { FiSettings, FiUpload } from 'react-icons/fi';
import avatar from '../../assets/avatar.png'
import { useContext, useState } from 'react'
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage'
import {AuthContext} from '../../contexts/auth'
import './style.css'
import {db,storage} from '../../services/firebaseConnection'
import {doc, updateDoc} from 'firebase/firestore'
import { toast } from 'react-toastify';
export default function Profile(){
  const {user, storageUser, setUser, logout} = useContext(AuthContext)
  const [nome, setNome] = useState(user && user.nome)
  const [email, setEmail] = useState(user && user.email)
  const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl)
  const [imageAvatar, setImageAvatar] = useState(null)

function handleFile(e){
  if(e.target.files[0]){
    const image = e.target.files[0];
      if(image.type === 'image/jpeg' || image.type ==='image/png'){
        setImageAvatar(image)
        setAvatarUrl(URL.createObjectURL(image))
      }else{
        toast.warning("Envie uma imagem tipo PNG OU JPEG")
      }
  }
}

async function handleUpload(){
  const currentUid = user.uid;

  const uploadRed = ref(storage, `images/${currentUid}/${imageAvatar.name}`)

  const uploadtTask = uploadBytes(uploadRed, imageAvatar)
  .then((snapshot)=> {
    getDownloadURL(snapshot.ref).then( async (downloadURL)=>{
      let urlFoto = downloadURL;
      const docRef = doc(db, "users", user.uid)
      await updateDoc(docRef, {
        avatarUrl: urlFoto,
      })
      .then(()=> {
      let data = {
        ...user,
        avatarUrl: urlFoto,
      }
      setUser(data);
      storageUser(data);
      toast.success("Foto atualizada com sucesso")

      })
    })
   
  })

}

async function handleSubmit(e){
  e.preventDefault()

  if(imageAvatar !== null ){
    handleUpload()

  }
}

  return(
    <div> <Header/> 
    <div className='content'> 
    <Title name="Meu perfil">
<FiSettings color='#FFF' size={25}/>
    </Title>
<div className='container'>
  <form className='form-profile' onSubmit={handleSubmit}>
    <label className='label-avatar'>
      <span>
        <FiUpload color="#fff" size={25}/>
      </span>
      <input type='file' accept='image/*' onChange={handleFile}/> <br/> {avatarUrl === null ? (<img src={avatar} width={250} height={250} alt='foto'/>) : (
        <img src={avatarUrl} alt='foto' width={250} height={250}/>
      )}
    </label>
    <label>Nome</label>
    <input type='text' placeholder={nome} disabled={true} />
    <label>Email</label>
    <input type='text' placeholder={email} disabled={true} />
    <button type='submit' className='submit'>Salvar</button>
  </form>
 
</div>
<div className='container'>
    <button className='sair' onClick={()=> logout()}>Sair</button>
  </div>

    </div>
    </div>
  );
}