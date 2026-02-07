
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginPage from './components/LoginPage';
import ProductPage from './components/ProductPage';
import RawMaterialPage from './components/RawMaterialPage';
import AssociationPage from './components/AssociationPage';
import ProductionSuggestionPage from './components/ProductionSuggestionPage';
import './App.css';

const tabs = [
  { label: 'Products', component: <ProductPage /> },
  { label: 'Raw Materials', component: <RawMaterialPage /> },
  { label: 'Association', component: <AssociationPage /> },
  { label: 'Production Suggestion', component: <ProductionSuggestionPage /> },
];

function App() {
  const [activeTab, setActiveTab] = useState(0);
  const user = useSelector(state => state.user.user);

  if (!user) {
    return (
      <div className="container">
        <h1 className="main-title">Inventory Management</h1>
        <LoginPage />
      </div>
    );
  }

  return (
    <div className="container devui-bg">
      <h1 className="main-title devui-title">Inventory Management</h1>
      <div className="devui-tabs">
        {tabs.map((tab, idx) => (
          <div
            key={tab.label}
            className={`devui-tab${activeTab === idx ? ' active' : ''}`}
            onClick={() => setActiveTab(idx)}
          >
            {tab.label}
          </div>
        ))}
      </div>
      <div className="devui-card devui-content">
        {tabs[activeTab].component}
      </div>
      <footer className="footer-signature">DEV: Bruno de castro</footer>
      <ToastContainer 
        theme="dark" 
        limit={3}
        autoClose={3000}
        closeButton={true}
        newestOnTop={true}
        closeOnClick={true}
      />
    </div>
  );
}

export default App;
