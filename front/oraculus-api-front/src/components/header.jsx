import { CircleUser, ExternalLink, LogIn, LogOut, Star } from "lucide-react"
import { useLocation } from 'react-router-dom';

import useAuthStore from '../useAuthStore'
import { useEffect, useState } from "react";
import ClickOutsideHandler from "./clickOutsideHandler";

function Header(){

   const { isConnected , user , logout } = useAuthStore()

   const location = useLocation();

   const [isUserMenuOpen,setisUserMenuOpen] = useState(false)

   return (
      <>
      <header className="contain-1440 flex justify-between items-center mx-auto px-10 py-5 border-2 rounded-lg">
         
         <a href="/"
         title="Accueil"
         className="text-3xl font-bold flex items-center gap-2">
         <Star className="text-blue-600" size={40}/> 
         Horoscope API</a>

         <nav className="flex gap-5 items-center relative h-[80px]">

            {
            isConnected && (
               <>
               <ClickOutsideHandler children={
                  <>
                  <a href="/"
                     title={`Connecté : ${user?.pseudo}`}
                     className="cursor-pointer"
                     onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setisUserMenuOpen(!isUserMenuOpen)
                     }}
                  ><CircleUser size={38}/></a>

                  {isUserMenuOpen && (
                     <div className="absolute top-[70px] right-0 border-2 opacity-100 rounded-lg px-5 py-1 grid gap-1 min-w-max z-10 bg-white">
                        <p>Utilisateur : {user?.pseudo}</p>
                        <p>Role : {user?.role}</p>
                        <p>Email : {user?.email}</p>
                        <a href="/" title="Se déconnecter"
                        onClick={(e) => {
                           e.preventDefault()
                           logout()
                        }} 
                        className="flex gap-1 items-center cursor-pointer">
                        <span className="rounded-full p-1 bg-black"><LogOut size={22} className="text-white"/></span>
                        Se déconnecter</a>
                     </div>
                  )}
                  </>
               }                     
                  onClickOutside={() => setisUserMenuOpen(false)}/>
               </>
            )}

            {(location.pathname !== '/login' && !isConnected) && (
               <>
               <a href="http://localhost:3000/api/horoscope" target="_blank"
               className="btn flex items-center gap-2 cursor-pointer border-2 border-gray-300 hover:bg-blue-600 hover:text-white hover:border-transparent"> 
               <ExternalLink size={22}/> 
               Voir le JSON actuel</a>

               <a href="/login"
               className="btn flex items-center gap-2 cursor-pointer border-2 border-transparent bg-black text-white hover:bg-blue-600"> 
               <LogIn size={22}/>
               Se Connecter</a>
               </>
            )}

            {(location.pathname === '/login' && !isConnected) && (
               <a href="/"
               className="btn cursor-pointer border-2 border-transparent bg-black text-white hover:bg-blue-600"> 
               Retour a l'accueil</a>
            )}

         </nav>
      </header>
      </>
   )
}

export default Header