import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Market from './pages/Market';
import Portfolio from './pages/Portfolio';
import PortfolioAnalysis from './pages/PortfolioAnalysis';
import History from './pages/History';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import SmartAlerts from './pages/SmartAlerts';

// Component wrapper to handle routing structure
const AppContent = () => {
  return (
    <Switch>
      {/* Public Routes */}
      <Route exact path="/" component={LandingPage} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/signup" component={Signup} />
      <Route exact path="/forgot-password" component={ForgotPassword} />
      <Route exact path="/reset-password/:token" component={ResetPassword} />

      {/* Private/Protected Routes wrapped in Layout */}
      <Route>
        <Layout>
          <Switch>
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
            <PrivateRoute exact path="/market" component={Market} />
            <PrivateRoute exact path="/portfolio" component={Portfolio} />
            <PrivateRoute exact path="/analysis" component={PortfolioAnalysis} />
            <PrivateRoute exact path="/history" component={History} />
            <PrivateRoute exact path="/settings" component={Settings} />
            <PrivateRoute exact path="/profile" component={Profile} />
            <PrivateRoute exact path="/alerts" component={SmartAlerts} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
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