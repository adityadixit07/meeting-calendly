import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { profile } from './redux/userSlice';
import { Route, Routes, BrowserRouter as Router, useLocation, Navigate } from 'react-router-dom';
import RegistrationPage from './component/RegistrationPage';

import Profile from './component/Profile';
import CreateEventFirst from './component/CreateEventFirst';
import ScheduledEventsPage from './component/ScheduledEventsPage';
import Navbar from './layout/Navbar';
import Footer from './layout/Footer';

import CalendarPage from './component/CalendarPage';
import BookEvent from './component/BookEvent';
import AuthComponent from './component/AuthComponent';
import AdminLogin from './component/AdminLogin';
import { getAdmin } from './redux/adminSlice';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import ClientRegistrationForm from './component/ClientRegistrationForm';
import ClientTable from './component/ClientTable';
import UserTable from './component/UserTable';
import { getClientProfile } from './redux/clientSlice';
import UserList from './component/UserList';
import ClientProtectedRoute from './ClientProtectedRoute';
import UserDetails from './component/UserDetails';
import ClientEventHistory from './component/ClientEventHistory';
import UserEventHistory from './component/UserEventHistory';
import AdminEventHistory from './component/AdminEventHistory';
import HolidayInput from './component/Holiday';
import ShowUserEvents from './component/ShowUserEvents';
import Register from './component/client/Register';
const NavbarWrapper = ({ children }) => {
  const location = useLocation();
  const { pathname } = location;



  // const excludeNavbarRoutes = ['/admin', '/user', '/', '/users', '/event/share/final'];
  const excludeNavbarRoutes = ['/admin/users', '/admin/clients', '/admin/new-client', '/admin/events', '/user/create-event', '/user/me', '/user/events', '/user/scheduledevents', '/user/detail', '/user/holiday'];

  const shouldShowNavbar = excludeNavbarRoutes.includes(pathname)

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      {children}

    </>
  );
};




function App() {
  const dispatch = useDispatch();
  const { isLogged, user } = useSelector((state) => state.auth);
  const { isAdmin } = useSelector((state) => state.admin);
  const { isClient } = useSelector((state) => state.client);
  useEffect(() => {
    dispatch(profile());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAdmin());
  }, [dispatch]);
  useEffect(() => {
    dispatch(getClientProfile());
  }, [dispatch]);




  return (
    <Router>
      <NavbarWrapper>
        <div className="min-h-screen py-2" style={{ backgroundImage: `url('/bg3.jpeg')`, backgroundSize: 'cover' }}>

          <Routes>
            <Route exact path="/" element={<AuthComponent />} />
            <Route exact path='/register' element={<Register />} />
            <Route exact path="/user" element={<RegistrationPage />} />

            <Route exact path="/:user" element={<ShowUserEvents />} />
            <Route exact path="/event/share/final" element={<BookEvent />} />
            <Route exact path="/:user/event/:eventId" element={<CalendarPage />} />

            <Route element={<ClientProtectedRoute isClient={isClient} />}>
              <Route exact path='/users' element={<UserList />} />
              <Route exact path='/client/events' element={<ClientEventHistory />} />
            </Route>

            <Route exact path="/user/detail" element={<UserDetails />} />
            <Route element={<ProtectedRoute isAuthenticated={isLogged} />}>
              <Route exact path="/user/me" element={<Profile />} />

              <Route exact path='/user/events' element={<UserEventHistory />} />
              <Route exact path='/user/holiday' element={<HolidayInput />} />

              <Route exact path="/user/create-event" element={<CreateEventFirst />} />

              <Route exact path="/user/scheduledevents" element={<ScheduledEventsPage />} />

            </Route>

            <Route element={<AdminRoute isAdmin={isAdmin} />}>

              <Route exact path='/admin/new-client' element={<ClientRegistrationForm />} />
              <Route exact path='/admin/clients' element={<ClientTable />} />
              <Route exact path='/admin/users' element={<UserTable />} />
              <Route exact path='/admin/events' element={<AdminEventHistory />} />
            </Route>

            <Route exact path="/admin" element={<AdminLogin />} />



          </Routes>
        </div>

      </NavbarWrapper>
    </Router>
  );
}

export default App;
