import React, { useState } from 'react';
import axios from 'axios';

interface ApiKeyConfigProps {
  setApiKey: (key: string) => void;
  setIsApiKeyValid: (isValid: boolean) => void;
}

const ApiKeyConfig: React.FC<ApiKeyConfigProps> = ({ setApiKey, setIsApiKeyValid }) => {
  const [inputKey, setInputKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      const response = await axios.post(`${API_URL}/api/auth/validate-key`, {
        apiKey: inputKey
      });

      if (response.data.success) {
        setApiKey(inputKey);
        setIsApiKeyValid(true);
      } else {
        setError('A chave API fornecida é inválida.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao validar a chave API.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Configuração da API Key da OpenAI</h2>
      <p className="mb-4 text-gray-600">
        Para utilizar o sistema de Análise de Perfis de Instagram, você precisa fornecer sua própria API Key da OpenAI.
        Esta chave será usada para acessar os serviços de IA que analisarão o perfil do Instagram.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
            API Key da OpenAI
          </label>
          <input
            type="password"
            id="apiKey"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="sk-..."
            required
          />
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={isLoading || !inputKey}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            isLoading || !inputKey
              ? 'bg-indigo-300 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          }`}
        >
          {isLoading ? 'Validando...' : 'Validar API Key'}
        </button>
      </form>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>Não tem uma API Key da OpenAI?</p>
        <a 
          href="https://platform.openai.com/account/api-keys" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-indigo-600 hover:text-indigo-800"
        >
          Obtenha uma aqui
        </a>
      </div>
    </div>
  );
};

export default ApiKeyConfig;
