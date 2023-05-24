import { useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';

export function ErrorAlert(props: any) {

  const { fetchSuccess, setFetchSuccess, fetchError, setFetchError } = useContext(AppContext);

  useEffect(() => {
    //console.log("entrou " + "error:" + props.fetchError + "   succ:" + props.fetchSuccess)
  
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setFetchError("");
        setFetchSuccess("")
      }
    };

    const handleClick = (event: MouseEvent) => {
      if (!event.target) return;
      setFetchError("");
      setFetchSuccess("")
      //console.log("update error test")
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClick);
    };
  }, [props]);

  if (fetchError) {

    return (
      <>
      <br />
      <div className="alert alert-warning shadow-lg" role="alert" onClick={() => props.setFetchError("")}>
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{props.fetchError}</span>
        </div>
      </div>
      </>
    )
  }

  else if (fetchSuccess) {
    return (
      <>
      <br />
      <div className="alert alert-success shadow-lg" onClick={() => setFetchSuccess("")}>
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{props.fetchSuccess}</span>
        </div>
      </div>
      </>
    )
  }
  return null;
}


