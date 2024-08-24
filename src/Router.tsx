import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './pages/home';
import Trash from './pages/trash';
import Share from './pages/share';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/home/:type' element={<Home />} />
        <Route path='/trash' element={<Trash />} />
        <Route path='/share' element={<Share />} />
      </Routes>
    </BrowserRouter>
  );
}
