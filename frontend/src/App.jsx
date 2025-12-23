import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
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
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route>
            <Layout>
              <Switch>
                <PrivateRoute path="/" exact component={Dashboard} />
                <PrivateRoute path="/market" component={Market} />
                <PrivateRoute path="/portfolio" component={Portfolio} />
                <PrivateRoute path="/history" component={History} />
                <PrivateRoute path="/settings" component={Settings} />
              </Switch>
            </Layout>
          </Route>
        </Switch>
      </Router>
    </AuthProvider>
  );
};


export default App;