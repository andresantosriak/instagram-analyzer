import React, { useState } from 'react';
import axios from 'axios';
import { Tab } from '@headlessui/react';
import { ArrowDownTrayIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface AnalysisResultsProps {
  results: any;
  resetAnalysis: () => void;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ results, resetAnalysis }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [shareableLink, setShareableLink] = useState<string | null>(null);

  const handleExportReport = async () => {
    setIsExporting(true);
    setExportError(null);

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      const response = await axios.post(`${API_URL}/api/report/generate`, {
        reportData: results
      });

      if (response.data.success) {
        setShareableLink(response.data.data.shareableLink);
      } else {
        setExportError('Erro ao gerar relatório.');
      }
    } catch (err: any) {
      setExportError(err.response?.data?.message || 'Erro ao gerar relatório.');
    } finally {
      setIsExporting(false);
    }
  };

  const tabCategories = [
    { key: 'pontosFortes', name: 'Pontos Fortes' },
    { key: 'melhorias', name: 'Melhorias' },
    { key: 'acoesRecomendadas', name: 'Ações Recomendadas' },
    { key: 'conteudoEstrategico', name: 'Conteúdo Estratégico' },
    { key: 'analiseCompleta', name: 'Análise Completa' }
  ];

  // Função para renderizar o conteúdo baseado na categoria
  const renderTabContent = (category: string) => {
    switch (category) {
      case 'pontosFortes':
        return (
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-green-800">Perfil</h3>
              <p className="mt-2 text-green-700">{results.profileAnalysis}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-green-800">Biografia</h3>
              <p className="mt-2 text-green-700">{results.bioAnalysis}</p>
            </div>
            {results.linkAnalysis !== "Link não fornecido" && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-green-800">Link da Bio</h3>
                <p className="mt-2 text-green-700">{results.linkAnalysis}</p>
              </div>
            )}
            {results.feedAnalysis !== "Posts não fornecidos" && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-green-800">Feed</h3>
                <p className="mt-2 text-green-700">{results.feedAnalysis}</p>
              </div>
            )}
          </div>
        );
      case 'melhorias':
        return (
          <div className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-yellow-800">Perfil</h3>
              <p className="mt-2 text-yellow-700">{results.profileAnalysis}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-yellow-800">Biografia</h3>
              <p className="mt-2 text-yellow-700">{results.bioAnalysis}</p>
            </div>
            {results.linkAnalysis !== "Link não fornecido" && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-yellow-800">Link da Bio</h3>
                <p className="mt-2 text-yellow-700">{results.linkAnalysis}</p>
              </div>
            )}
            {results.feedAnalysis !== "Posts não fornecidos" && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-yellow-800">Feed</h3>
                <p className="mt-2 text-yellow-700">{results.feedAnalysis}</p>
              </div>
            )}
          </div>
        );
      case 'acoesRecomendadas':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-blue-800">Curto Prazo</h3>
              <p className="mt-2 text-blue-700">{results.profileAnalysis}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-blue-800">Médio Prazo</h3>
              <p className="mt-2 text-blue-700">{results.bioAnalysis}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-blue-800">Longo Prazo</h3>
              <p className="mt-2 text-blue-700">{results.contentSuggestions}</p>
            </div>
          </div>
        );
      case 'conteudoEstrategico':
        return (
          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-purple-800">Ideias de Conteúdo</h3>
              <p className="mt-2 text-purple-700 whitespace-pre-line">{results.contentSuggestions}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-purple-800">Sugestões de Copywriting</h3>
              <p className="mt-2 text-purple-700 whitespace-pre-line">{results.copySuggestions}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-purple-800">Conceitos de Imagens</h3>
              <p className="mt-2 text-purple-700 whitespace-pre-line">{results.imageSuggestions}</p>
            </div>
          </div>
        );
      case 'analiseCompleta':
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800">Análise de Perfil</h3>
              <p className="mt-2 text-gray-700 whitespace-pre-line">{results.profileAnalysis}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800">Análise de Biografia</h3>
              <p className="mt-2 text-gray-700 whitespace-pre-line">{results.bioAnalysis}</p>
            </div>
            {results.linkAnalysis !== "Link não fornecido" && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800">Análise de Link</h3>
                <p className="mt-2 text-gray-700 whitespace-pre-line">{results.linkAnalysis}</p>
              </div>
            )}
            {results.feedAnalysis !== "Posts não fornecidos" && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800">Análise de Feed</h3>
                <p className="mt-2 text-gray-700 whitespace-pre-line">{results.feedAnalysis}</p>
              </div>
            )}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800">Sugestões de Conteúdo</h3>
              <p className="mt-2 text-gray-700 whitespace-pre-line">{results.contentSuggestions}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800">Sugestões de Copywriting</h3>
              <p className="mt-2 text-gray-700 whitespace-pre-line">{results.copySuggestions}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-800">Conceitos de Imagens</h3>
              <p className="mt-2 text-gray-700 whitespace-pre-line">{results.imageSuggestions}</p>
            </div>
          </div>
        );
      default:
        return <p>Conteúdo não disponível</p>;
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Resultados da Análise</h2>
        <div className="flex space-x-2">
          <button
            onClick={resetAnalysis}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ArrowPathIcon className="-ml-0.5 mr-2 h-4 w-4" />
            Nova Análise
          </button>
          <button
            onClick={handleExportReport}
            disabled={isExporting}
            className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white ${
              isExporting
                ? 'bg-indigo-300 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            }`}
          >
            <ArrowDownTrayIcon className="-ml-0.5 mr-2 h-4 w-4" />
            {isExporting ? 'Exportando...' : 'Exportar Relatório'}
          </button>
        </div>
      </div>

      {/* Pontuação Geral */}
      <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-indigo-100 rounded-full p-3">
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-indigo-600 text-white text-xl font-bold">
              {results.overallScore?.score || 75}
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-indigo-800">Pontuação Geral</h3>
            <p className="text-sm text-indigo-600">
              {results.overallScore?.methodology || 
                "A pontuação é calculada com base na análise de perfil (30%), análise de bio (30%), análise de link (20%) e análise de feed (20%)."}
            </p>
          </div>
        </div>
      </div>

      {/* Link compartilhável */}
      {shareableLink && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg">
          <h3 className="text-lg font-medium text-green-800">Relatório Gerado com Sucesso!</h3>
          <p className="mt-2 text-green-700">
            Seu relatório está disponível no link abaixo:
          </p>
          <a
            href={shareableLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-indigo-600 hover:text-indigo-800 break-all"
          >
            {shareableLink}
          </a>
        </div>
      )}

      {/* Erro de exportação */}
      {exportError && (
        <div className="mb-6 p-4 bg-red-50 rounded-lg">
          <h3 className="text-lg font-medium text-red-800">Erro ao Exportar Relatório</h3>
          <p className="mt-2 text-red-700">{exportError}</p>
        </div>
      )}

      {/* Abas de resultados */}
      <Tab.Group>
        <Tab.List className="flex p-1 space-x-1 bg-indigo-50 rounded-xl">
          {tabCategories.map((category) => (
            <Tab
              key={category.key}
              className={({ selected }) =>
                classNames(
                  'w-full py-2.5 text-sm font-medium leading-5 rounded-lg',
                  'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-indigo-400 ring-white ring-opacity-60',
                  selected
                    ? 'bg-white shadow text-indigo-700'
                    : 'text-indigo-500 hover:bg-white/[0.12] hover:text-indigo-600'
                )
              }
            >
              {category.name}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {tabCategories.map((category) => (
            <Tab.Panel
              key={category.key}
              className={classNames(
                'bg-white rounded-xl p-3',
                'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-indigo-400 ring-white ring-opacity-60'
              )}
            >
              {renderTabContent(category.key)}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default AnalysisResults;
