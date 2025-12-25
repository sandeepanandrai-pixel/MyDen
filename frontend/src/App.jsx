import React from 'react';
import { BrowserRouter as Router, Route, Switch, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Market from './pages/Market';
import Portfolio from './pages/Portfolio';
import PortfolioAnalysis from './pages/PortfolioAnalysis';
import History from './pages/History';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import SmartAlerts from './pages/SmartAlerts';

// Component wrapper to conditionally render Layout based on route
const AppContent = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  if (isAuthPage) {
    return (
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
      </Switch>
    );
  }

  return (
    <Layout>
      <Switch>
        <PrivateRoute exact path="/" component={Dashboard} />
        <PrivateRoute exact path="/market" component={Market} />
        <PrivateRoute exact path="/portfolio" component={Portfolio} />
        <PrivateRoute exact path="/analysis" component={PortfolioAnalysis} />
        <PrivateRoute exact path="/history" component={History} />
        <PrivateRoute exact path="/settings" component={Settings} />
        <PrivateRoute exact path="/profile" component={Profile} />
        <PrivateRoute exact path="/alerts" component={SmartAlerts} />
      </Switch>
    </Layout>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;