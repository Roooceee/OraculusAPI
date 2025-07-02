import { ArrowLeftToLine, Shield } from "lucide-react"
import { useEffect, useState } from "react";

import { useNavigate } from 'react-router-dom';

import useAuthStore from '../useAuthStore.js'


function LoginForm() {

   const [userIdentifant, setUserIdentifant] = useState()
   const [userPassword, setUserPassword] = useState()

   const [connexionAttempt , setConnexionAttempt] = useState()

   const {login , isConnected } = useAuthStore()

   const navigate = useNavigate();

   useEffect(()=>{

      if(isConnected){
         navigate('/dashboard')
      }

   },[isConnected])

   return (
      <>

      <section className="grid mx-auto max-w-[500px] gap-5 mt-8 border-2 p-10 rounded-lg">

         <div className="pb-10">
            <h1 className="flex items-center justify-center gap-2 text-2xl font-bold"><Shield className="text-blue-600"/>Connexion sécurisée</h1>
         </div>

         <form className="grid gap-5" onSubmit={ async (e) => {
            e.preventDefault()
            const result = await login(userIdentifant,userPassword)
            console.log(result)         
            setConnexionAttempt(true)
         }}>
            <div className="grid">
               <label>Nom d'utilisateur ou email</label>
               <input type="text" id="identifiant" name="identifiant" autoComplete="username"
               className="border-2 rounded-lg py-2 px-2" placeholder={"Entrez votre nom d\'utilisateur ou votre email"} 
               onChange={(e) => {
                  setUserIdentifant(e.target.value)
               }}/>
            </div>
            <div className="grid">
               <label>Mot de passe</label>
               <input type="password" id="password" name="password" autoComplete="current-password" 
               className="border-2 rounded-lg py-2 px-2" placeholder={"Entrez votre mot de passe"} 
               onChange={(e) => {
                  setUserPassword(e.target.value)
               }}/>
            </div>

            {(connexionAttempt && !isConnected) && (
               <p className="text-red-600 text-sm bg-gray-100 rounded-lg py-5 px-2.5">Identifiants incorrects : pseudo/email ou mot de passe erroné. </p>
            )}

            <input type="submit" 
            className="py-2 rounded-lg cursor-pointer border-2 border-transparent bg-black text-white hover:bg-blue-600" 
            value={'Se connecter'}/>
         </form>

         <a href="/"
         className="flex items-center gap-1 justify-center pt-10 text-blue-600 hover:underline"
         ><ArrowLeftToLine size={18}/> Retour à la documentation</a>
      </section>

      
      </>
   )

}

export default LoginForm