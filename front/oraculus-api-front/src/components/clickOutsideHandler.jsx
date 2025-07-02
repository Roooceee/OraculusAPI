import { useEffect, useRef } from "react"


function ClickOutsideHandler({children , onClickOutside}) {


   const wrapperRef = useRef(null);

   useEffect(() => {
      const handleClick = (event) => {
         if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
         onClickOutside();
         }
      };

      document.addEventListener("mousedown", handleClick);
      return () => {
         document.removeEventListener("mousedown", handleClick);
      };
   }, [onClickOutside]);


   return (
      <>
         <div ref={wrapperRef}>{children}</div>
      </>
   )

}

export default ClickOutsideHandler