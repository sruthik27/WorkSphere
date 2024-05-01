import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginPage from './screens/LoginPage';
import WorkPage from './screens/WorkPage';
import Coordinator from './components/Coordinator';
import NewTask from './components/NewTask';
import WorkReport from './components/WorkReport';
import ManagerPage from './screens/ManagerPage';
import ResetPassword from './components/ResetPassword';
import ReagistrationPage from './screens/RegistrationPage';
import NewAdmin from "./components/NewAdmin";
import { AuthContextProvider } from './context/AuthContext';
import Protected from './context/Protected';
import Protect from './context/Protect';

function App() {
  

  return (
    <div>
      <AuthContextProvider>
        <Routes>
          <Route path='/' element={ <LoginPage /> }/>
          <Route path='/coordinator' element={ <Coordinator/> }/>
          <Route path='/Work' element={ <Protected><WorkPage /></Protected> }/>
          <Route path='/ManagerPortal' element={ <Protected><ManagerPage/></Protected> }/>
          <Route path='/Registration' element={ <ReagistrationPage /> }/>
          <Route path='/AdminPortal' element={ <Protected><NewAdmin/></Protected> }/>
          <Route path='/NewTask' element={ <Protected><NewTask/> </Protected>}/>
          <Route path='/WorkReport' element={ <Protected><WorkReport/></Protected> }/>
          <Route path='/ResetPassword/:id' element={ <ResetPassword/> }/>

          {/* route for  */}
          <Route path='/Manager' element={ <Protect><ManagerPage/></Protect>}/>
          <Route path='/WorkPage' element={ <Protect><WorkPage /></Protect> }/>
        </Routes>
      </AuthContextProvider>
    </div>
    
  );
}

export default App;