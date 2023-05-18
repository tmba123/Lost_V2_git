import './App.css'
import { AppProvider } from './context/AppContext';
import { Routes, Route } from 'react-router-dom'
import { NavigationBar } from './components/Navigation_bar';
import { FooterBar } from './components/Footer_bar';
import { Home } from './pages/Home';
import { Publisher } from './pages/Publisher';
import { PublisherCreate } from './pages/PublisherCreate';
import { PublisherUpdate } from './pages/PublisherUpdate';
import { Games } from './pages/Games';
import { GameCreate } from './pages/GameCreate';

function App() {

  return (
<AppProvider>

    
    <>
      <NavigationBar />


      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/Publisher' element={<Publisher />} />
        <Route path='/PublisherCreate' element={<PublisherCreate />} />
        <Route path='/PublisherUpdate/:id' element={<PublisherUpdate />} />
        <Route path='/Games' element={<Games />} />
        <Route path='/GameCreate' element={<GameCreate />} />
        {/* 
<Route path='/Warehouse' element={<Warehouse />} />
<Route path='/Inventory' element={<Inventory />} />
<Route path='/Movement' element={<Movement />} />
<Route path='/About' element={<About />} />

 */}
      </Routes>

      <FooterBar />
    </>
    </AppProvider>
  )
}



export default App
