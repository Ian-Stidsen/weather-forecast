import 'bootstrap/dist/css/bootstrap.min.css'
import { Route, Routes } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import Weather from './pages/Weather'

function App() {

  return (
    <Container className='my-4'>
      <Routes>
        <Route path="/" element={<Weather />} />
      </Routes>
    </Container>
  )
}

export default App;
