import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './components/pages/Home'
import Cadastro from './components/pages/Cadastro';

function App() {
  return (
    <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/cadastro" element={<Cadastro/>} />
        </Routes>
    </Router>
  )
}

export default App;
