import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ApiKeyConfig from './components/ApiKeyConfig';
import ProfileForm from './components/ProfileForm';
import AnalysisResults from './components/AnalysisResults';
import ReportViewer from './components/ReportViewer';
import './App.css';

function App() {
  const [apiKey, setApiKey] = React.useState<string>('');
  const [isApiKeyValid, setIsApiKeyValid] = React.useState<boolean>(false);
  const [analysisResults, setAnalysisResults] = React.useState<any>(null);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-indigo-600">Análise de Perfis de Instagram</h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={
              !isApiKeyValid ? (
                <ApiKeyConfig 
                  setApiKey={setApiKey} 
                  setIsApiKeyValid={setIsApiKeyValid} 
                />
              ) : (
                analysisResults ? (
                  <AnalysisResults 
                    results={analysisResults} 
                    resetAnalysis={() => setAnalysisResults(null)} 
                  />
                ) : (
                  <ProfileForm 
                    apiKey={apiKey} 
                    setAnalysisResults={setAnalysisResults} 
                  />
                )
              )
            } />
            <Route path="/reports/:reportId" element={
              <ReportViewer reportId={window.location.pathname.split('/').pop() || ''} />
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
