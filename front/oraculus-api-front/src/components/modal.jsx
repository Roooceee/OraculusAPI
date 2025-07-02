import ReactDOM from 'react-dom';

function Modal({ isOpen, onClose, canClosed , children }){

   if(!isOpen){
      return null
   }


   return ReactDOM.createPortal(
      <div className='fixed inset-0 bg-[var(--background-semi-transparent)] flex justify-center items-center z-50'>
               <div className='modal-content bg-white p-10 rounded-lg'>
                  {children}
               </div>
      </div>
      ,
      document.querySelector('#modal-root')
   )

}

export default Modal