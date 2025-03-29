import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import { Layout } from 'antd';

// 组件导入
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PlanGenerator from './pages/PlanGenerator';
import PlanDetail from './pages/PlanDetail';
import ContentGenerator from './pages/ContentGenerator';
import ContentLibrary from './pages/ContentLibrary';
import ProgressTracker from './pages/ProgressTracker';
import FlippedClassroom from './pages/FlippedClassroom';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

const { Content } = Layout;

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <Layout style={{ minHeight: '100vh' }}>
              <Header />
              <Layout>
                <Sidebar />
                <Layout style={{ padding: '24px' }}>
                  <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" />} />
                      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                      <Route path="/generate-plan" element={<PrivateRoute><PlanGenerator /></PrivateRoute>} />
                      <Route path="/plans/:planId" element={<PrivateRoute><PlanDetail /></PrivateRoute>} />
                      <Route path="/generate-content" element={<PrivateRoute><ContentGenerator /></PrivateRoute>} />
                      <Route path="/content-library" element={<PrivateRoute><ContentLibrary /></PrivateRoute>} />
                      <Route path="/progress" element={<PrivateRoute><ProgressTracker /></PrivateRoute>} />
                      <Route path="/flipped-classroom" element={<PrivateRoute><FlippedClassroom /></PrivateRoute>} />
                    </Routes>
                  </Content>
                </Layout>
              </Layout>
            </Layout>
          } />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App; 