import { BrowserRouter as Rooter, Route, Routes } from "react-router-dom";

import Home from "./pages/home";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";

import './index.css';

import useAuthStore from './useAuthStore.js'
import { useEffect, useState } from "react";
import Modal from "./components/modal.jsx";
import SessionExpireWarning from "./components/sessionExpireWarning.jsx";




function App() {
  
  const { checkSession , isLoading , isConnected , logout , expiresAt } = useAuthStore()

  const [timerSession , setTimerSession] = useState(0)
  
  useEffect(()=>{
  
    checkSession()
  
  },[])

  function closeModal(){
      setShowSessionWarning(false)
   }


  const [showSessionWarning , setShowSessionWarning] = useState(false)

  useEffect(()=>{

    if(isConnected && expiresAt){

      const intervalID = setInterval(()=>{

        const secondsLeft = Math.round((expiresAt.getTime() - Date.now())/1000)

        if(secondsLeft >= 0) {
          setTimerSession(secondsLeft)
        }
        if(secondsLeft > 0 && secondsLeft <= 60) {
          setShowSessionWarning(true)
        }
        else if(secondsLeft <= 0){
          console.log('TEST')
          logout()
          closeModal()
        }

      },1000)

      return () => clearInterval(intervalID);

    }

  },[isConnected])

  if(!isLoading) {
    return (
      <>

      {showSessionWarning && (
        <Modal 
          isOpen={true} 
          onClose={closeModal} 
          canClosed={false} 
          children={
            <SessionExpireWarning onClose={closeModal} secondsLeft={timerSession}/>} 
          />
      )}

      <Rooter>

        <Routes>

          <Route path = "/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/dashboard" element={<Dashboard/>} />

        </Routes>

      </Rooter>
      </>
    )
  }
  
}

export default App
