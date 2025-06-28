import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { authenticate } from './store/session';
import ProtectedRoute from './components/auth/ProtectedRoute';

import NavBar from './components/NavBar';
import SplashPage from './components/SplashPage';
import LoginForm from './components/auth/LoginForm';
import SignUpForm from './components/auth/SignUpForm';
import Dashboard from './components/Dashboard/Dashboard';
import AllExpenses from './components/AllExpenses';
import UsersList from './components/UsersList';
import User from './components/User';
import FriendSideBar from './components/friends/SideBar';
import FriendDetail from './components/friends/FriendDetail';
import DeleteWarning from './components/friends/DeleteWarning';
import GroupsSidebar from './components/Groups/GroupsSidebar';
import GroupDetails from './components/Groups/GroupDetails';
import CreateGroupForm from './components/Groups/CreateGroupForm';
import AddGroupMemberForm from './components/Groups/AddGroupMemberForm';
import EditGroupForm from './components/Groups/EditGroupForm';
import Template from './components/Template/Template';

function App() {
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
  (async () => {
    await dispatch(authenticate());
    setLoaded(true);
  })();
}, [dispatch]);
  
  if (!isLoaded) return null; // prevents render flickering before auth

  return (
    <BrowserRouter>
      <NavBar />
      <Switch>
        <Route path="/" exact>
          <SplashPage />
        </Route>
        <Route path="/login" exact>
          <LoginForm />
        </Route>
        <Route path="/sign-up" exact>
          <SignUpForm />
        </Route>
        <Route path="/template" exact>
          <Template />
        </Route>

        <ProtectedRoute path="/dashboard" exact>
          <Dashboard />
        </ProtectedRoute>
        <ProtectedRoute path="/expenses/all" exact>
          <AllExpenses />
        </ProtectedRoute>

        <ProtectedRoute path="/users" exact>
          <UsersList />
        </ProtectedRoute>
        <ProtectedRoute path="/users/:userId" exact>
          <User />
        </ProtectedRoute>

        <ProtectedRoute path="/friends/current" exact>
          <FriendSideBar />
        </ProtectedRoute>
        <ProtectedRoute path="/friends/delete" exact>
          <DeleteWarning />
        </ProtectedRoute>
        <ProtectedRoute path="/friends/:friendId" exact>
          <FriendDetail />
        </ProtectedRoute>

        <ProtectedRoute path="/groups/current" exact>
          <GroupsSidebar />
        </ProtectedRoute>
        <ProtectedRoute path="/groups/new" exact>
          <CreateGroupForm />
        </ProtectedRoute>
        <ProtectedRoute path="/groups/:groupId/edit" exact>
          <EditGroupForm />
        </ProtectedRoute>
        <ProtectedRoute path="/groups/:groupId/members/add" exact>
          <AddGroupMemberForm />
        </ProtectedRoute>
        <ProtectedRoute path="/groups/:groupId" exact>
          <GroupDetails />
        </ProtectedRoute>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
