import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import Header from "../components/header"

import useAuthStore from '../useAuthStore'


function Dashboard(){

   const { isConnected , user , expiresAt } = useAuthStore()
   const navigate = useNavigate();

   useEffect(()=>{

      if(!isConnected){
         navigate('/')
      }

   },[isConnected])

   
   function verifyExpiresAt() {

      if(isConnected) {
         
         console.log('user : '+user)
         console.log('isConnected : '+isConnected)
         console.log('user expiresAt : '+new Date(user.expiresAt))
         console.log('expiresAt : '+expiresAt)

   }
}

   return (
      <>
      <Header/>
      <main>
         <div className="grid">
            <a href="#"
            className="mx-auto mt-10 pt-10 btn border-2"
            onClick={(e) => {
               e.preventDefault()
               verifyExpiresAt()
            }}
            >expiresAt</a>
         </div>
      </main>
      </>
   )

}

export default Dashboard