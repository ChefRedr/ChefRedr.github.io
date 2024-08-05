import Home from './Home.jsx';
import Background from './Background.jsx';
import CurrentEvents from './CurrentEvents.jsx';
import HowToHelp from './HowToHelp.jsx';
import Nav from './Nav.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <>
      <Nav></Nav>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />}></Route>
          <Route path="/background" element={<Background />}></Route>
          <Route path="/current-events" element={<CurrentEvents />}></Route>
          <Route path="/how-to-help" element={<HowToHelp />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );

}

export default App