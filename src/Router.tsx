import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './pages/home';
import Trash from './pages/trash';
import Share from './pages/share';
import Signin from './pages/signin';
import Signup from './pages/signup';
import Download from './pages/download';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Signin />} />
        <Route path='/home' element={<Home />} />
        <Route path='/home/:type' element={<Home />} />
        <Route path='/trash' element={<Trash />} />
        <Route path='/share' element={<Share />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/download/:id' element={<Download />} />
      </Routes>
    </BrowserRouter>
  );
}
