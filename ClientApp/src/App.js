import React from 'react';
import { Route, Routes, Link, Router } from 'react-router-dom';
import AdminHome from './components/AdminHome';
import AdminMain from './components/AdminMain';
import Coordinator from './components/Coordinator';
import NewTask from './components/NewTask';
import WorkReport from './components/WorkReport';
import NewCoordinator from './components/NewCoordinator';
import ResetPassword from './components/ResetPassword';
import NewAdmin from "./components/NewAdmin";
import { AuthContextProvider } from './context/AuthContext';
import Protected from './context/Protected';

function App() {
  return (
    <div>
      <AuthContextProvider>
        <Routes>
          <Route path='/' element={ <AdminHome/> }/>
          <Route path='/AdminMain' element={ <AdminMain/> }/>
          <Route path='/coordinator' element={ <Coordinator/> }/>
          <Route path='/ManagerPortal' element={ <Protected><NewCoordinator/></Protected> }/>
          <Route path='/AdminPortal' element={ <Protected><NewAdmin/></Protected> }/>
          <Route path='/NewTask' element={ <Protected><NewTask/> </Protected>}/>
          <Route path='/WorkReport' element={ <Protected><WorkReport/></Protected> }/>
          <Route path='/ResetPassword/:id' element={ <ResetPassword/> }/>
        </Routes>
      </AuthContextProvider>
    </div>
    
  );
}

export default App;