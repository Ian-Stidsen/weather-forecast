import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Today } from './components/Today'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Today />} />
      </Routes>
    </>
  )
}

export default App;
