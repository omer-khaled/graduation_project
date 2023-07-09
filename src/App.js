import { Route, Routes } from "react-router-dom";
import Contact from "./components/Contact";
import Info from "./components/Info";
import LandingPage from "./components/LandingPage";
import Home from "./components/Home";
import Navbar from "./components/Landingpage/Navbar";
import React from "react";
import './css/style.css';
import MainNavbar from "./components/Home/MainNavbar";
import Search from "./components/Search";
import Cover from "./components/Cover";
import AdminDashboard from "./components/AdminDashboard";
import VBChart from "./components/Admin/Charts/VBChart";
import Achart from "./components/Admin/Charts/Achart";
import HBChart from "./components/Admin/Charts/HBChart";
import AdminLogin from "./components/Admin/AdminLoginn";
import DashbordCustomer from './components/Admin/DashbordCustomer';
import DashbordWorker from './components/Admin/DashbordWorker';
import './logic/worker';
import Categories from "./components/Admin/Categories";
import Regions from "./components/Admin/Regions";
import Showworkerrequests from './components/Admin/Showworkerrequests';
import WorkerbyCategory from "./components/Home/WorkerbyCategory";
import ProfileWorker from './components/ProfileWorker';
import UserProfile from "./components/Profile";
import Contract from "./components/Home/Contract";
import ContractfoWorking from "./components/profile/ContractfoWorking";
import Reports from "./components/Admin/Reports";
import Notification from "./components/Admin/Notification";
import Chatworker from "./components/Chat/Chatworker";
import Chatcustomer from "./components/Chat/Chatcustomer";
import WorkerNavbar from "./components/Home/WorkerNavbar";
import CusChart from "./components/Admin/Charts/CusChart";
import ContractChart from "./components/Admin/Charts/ContractChart";
function App() {
  return (
    <div className="App d-flex justify-content-start align-items-center flex-column">
      <Routes>
        <Route path='/' element={
          <Cover>
            <Navbar />
            <LandingPage />
          </Cover>
        } />
        <Route path='/home' element={
            <MainNavbar Profile={true}/>
        }>
              <Route exact path='' element={<Home />} />
              <Route path='categories/:id' element={<WorkerbyCategory />} />
        </Route>
        <Route path='users/:id' element={
          <>
          <MainNavbar Profile={true}/>
          <Cover>
            <UserProfile />
          </Cover>
          </>
        } />
        <Route path='/admin' element={
              <AdminDashboard />
          } 
        >
          <Route path='customers' element={<DashbordCustomer />} />
          <Route path='workers' element={<DashbordWorker />} />
          <Route path='notification' element={<Notification />} />
          <Route path='showworkerrequests' element={<Showworkerrequests />} />
          <Route path='reports' element={<Reports />} />
          <Route path='categories' element={<Categories />} />
          <Route path='regions' element={<Regions />} />
          <Route path='barchart' element={<VBChart />} />
          <Route path='hbarchart' element={<HBChart />} />
          <Route path='Abarchart' element={<Achart />} />
          <Route path='customerchart' element={<CusChart />} />
          <Route path='contractchart' element={<ContractChart />} />
        </Route>
        <Route path="/contract" element={
          <React.Fragment>
              <MainNavbar Profile={true}/>
              <Contract role={'c'} />
          </React.Fragment>
        }/>
        <Route path="/contractWork" element={
          <React.Fragment>
              <ContractfoWorking />
          </React.Fragment>
        }>
            <Route exact path='' element={<Contract role={'w'} />} />
            <Route  path='Worker/:id' element={
              <Cover>
                <ProfileWorker owner={'n'}/>
              </Cover>
            }/>
        </Route>
        <Route  path='/ShowWorker/:id' element={
          <Cover>
            <MainNavbar Profile={true}/>
            <ProfileWorker owner={'w'}/>
          </Cover>
        }/>
        <Route path='adminlogin' element={<AdminLogin />} />
        <Route path='/search' element={
          <React.Fragment>
            <MainNavbar Profile={true}/>
            <Search />
          </React.Fragment>
        } />
        <Route path='/contactus' element={
          <Cover>
            <Navbar />
            <Contact />
          </Cover>
        } />
        <Route path='/info' element={
          <Cover>
            <Navbar />
            <Info />
          </Cover>
        } />
        <Route path='/chatuser/:id' element={
            <>
                <MainNavbar />
                <Chatcustomer role={'user'}/>
            </>
        } />
        <Route path='/chatworker/:id' element={
          <>
              <WorkerNavbar />
              <Chatworker role={'worker'}/>
          </>
      } />
      </Routes>
    </div>
  );
}


export default App;

// <Route path='Worker/:id' element={
//   <Cover>
//     <ProfileWorker />
//   </Cover>
// } />