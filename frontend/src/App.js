import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './components/WelcomePage';
import ChooseTable from './components/Customers/ChooseTable';
import MainMenu from './components/Customers/MainMenu';
import ProtectedRoute from './ProtectedRoute';
import Login from './components/Managers/Login';
import ManagerLogin from './components/Managers/ManagerLogin';
import ManagerPage from './components/Managers/ManagerPage';
import Cart from './components/Customers/Cart';
import CusBill from './components/Customers/CusBill';
import AddDishesPage from './components/Buttons/AddDishesPage';
import EditDishesPage from './components/Buttons/EditDishesPage';
import AddCatePage from './components/Buttons/AddCatePage';
import KitchenLogin from './components/Kitchens/KitchenLogin';
import KitchenPage from './components/Kitchens/KitchenPage';
import WaiterPage from './components/Waiters/WaiterPage';
import WaiterLogin from './components/Waiters/WaiterLogin';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/tablenumber" element={<ChooseTable />} />
        <Route path="/mainmenu" element={<MainMenu />} />
        <Route path="/loginpage" element={<Login/>} />
        <Route path="/managerloginpage" element={<ManagerLogin/>} />
        <Route path="/managerpage" element={<ProtectedRoute component={ManagerPage} roles={['Manager']} />} />
        <Route path="/cartpage" element={<Cart/>} />
        <Route path="/cusbill" element={<CusBill/>} />
        <Route path='/adddishespage' element={<ProtectedRoute component={AddDishesPage} roles={['Manager']} />} />
        <Route path='/editdishespage/:menuItemId' element={<ProtectedRoute component={EditDishesPage} roles={['Manager']} />} />
        <Route path='/addcatepage' element={<ProtectedRoute component={AddCatePage} roles={['Manager']} />} />
        <Route path="/kitchenloginpage" element={<KitchenLogin/>} />
        <Route path="/kitchenpage" element={<ProtectedRoute component={KitchenPage} roles={['Kitchen']} />} />
        <Route path="/waiterloginpage" element={<WaiterLogin/>} />
        <Route path="/waiterpage" element={<ProtectedRoute component={WaiterPage} roles={['Waiter']} />} />

      </Routes>
    </Router>
  );
}

export default App;
