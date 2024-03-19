import React from 'react'
import Header from './components/Header'
import Login from './components/Login'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import './App.css'
import Fixtures from './components/Fixtures'
import MatchScoring from './components/MatchScoring'
import Teams from './components/Teams'

const App = () => {
  return (
    <BrowserRouter >
    <Routes>
        <Route path='/' element={<Header/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/Fixtures' element={<Fixtures/>}/>
        <Route path='/Teams' element={<Teams/>}/>
        <Route path='/MatchScore/:matchId' element={<MatchScoring/>}/>
    </Routes>
        
    </BrowserRouter>
  )
}

export default App