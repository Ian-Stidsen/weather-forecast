import 'bootstrap/dist/css/bootstrap.min.css'
import { Route, Routes } from 'react-router-dom'
import { Today } from './components/Today'
import { Container } from 'react-bootstrap'
import { Hourly } from './components/Hourly'
import { Search } from './components/Search'

function App() {

  return (
    <Container className='my-4'>
      <Routes>
        <Route path="/" element={<Search />} />
      </Routes>
    </Container>
  )
}

export default App;
