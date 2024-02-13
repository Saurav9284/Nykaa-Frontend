import React from 'react'
import {Routes,Route} from 'react-router-dom'
import Login from '../Component/Login'
import Signup from '../Component/Signup'
import Home from '../Component/Home'

const Allroutes = () => {
  return (
     <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
         <Route path='/login' element={<Login/>}/>
         <Route path='/register' element={<Signup/>}/>
      </Routes>
     </div>
  )
}

export default Allroutes
