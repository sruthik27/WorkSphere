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

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={ <AdminHome/> }/>
        <Route path='/AdminMain' element={ <AdminMain/> }/>
        <Route path='/coordinator' element={ <Coordinator/> }/>
        <Route path='/HeadPortal' element={ <NewCoordinator/> }/>
        <Route path='/AdminPortal' element={ <NewAdmin/> }/>
        <Route path='/NewTask' element={ <NewTask/> }/>
        <Route path='/WorkReport' element={ <WorkReport/> }/>
        <Route path='/ResetPassword/:id' element={ <ResetPassword/> }/>
      </Routes>
    </div>
    
  );
}

export default App;