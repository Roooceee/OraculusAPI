
import { useEffect, useState } from "react"
import useAuthStore from "../useAuthStore"

function SessionExpireWarning({onClose , secondsLeft}){

   const {logout , stayConnect } = useAuthStore()

   const handleStayConnected = async () => {
    stayConnect()
    onClose();
   };

  const handleLogout = () => {
    logout();
    onClose();
   };

   return (
      <>
      <div className="text-center">
         <h2>Votre Session expire bientot</h2>
         <p>Il vous reste : <span className="font-bold">{secondsLeft} seconde{secondsLeft > 1 ? 's' : ''}</span> avant la déconnexion</p>

         <div className="flex justify-center gap-10 pt-5">
            <a href="#" className="btn flex items-center gap-2 cursor-pointer border-2 border-gray-300 hover:bg-blue-600 hover:text-white hover:border-transparent" 
            onClick={(e) => {
               e.preventDefault()
               handleStayConnected()
            }}
            >Rester connecté</a>
            <a href="#" className="btn flex items-center gap-2 cursor-pointer border-2 border-gray-300 hover:bg-blue-600 hover:text-white hover:border-transparent"
            onClick={(e) => {
               e.preventDefault()
               handleLogout()
            }}
            >Se déconnecter</a>
         </div>

      </div>
      </>
   )


}

export default SessionExpireWarning