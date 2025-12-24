import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Market from './pages/Market';
import Portfolio from './pages/Portfolio';
import History from './pages/History';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Settings from './pages/Settings';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          {/* Public routes */}
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />

          {/* Protected routes with Layout */}
          <Route path="/">
            <Layout>
              <Switch>
                <PrivateRoute exact path="/" component={Dashboard} />
                <PrivateRoute exact path="/market" component={Market} />
                <PrivateRoute exact path="/portfolio" component={Portfolio} />
                <PrivateRoute exact path="/history" component={History} />
                <PrivateRoute exact path="/settings" component={Settings} />
              </Switch>
            </Layout>
          </Route>
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default App;