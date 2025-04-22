import React, { useState } from 'react';
import axios from 'axios';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface ReportViewerProps {
  reportId: string;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ reportId }) => {
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPdfExporting, setIsPdfExporting] = useState<boolean>(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  React.useEffect(() => {
    const fetchReport = async () => {
      try {
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
        const response = await axios.get(`${API_URL}/api/report/view/${reportId}`);
        if (response.data.success) {
          setReport(response.data.data);
        } else {
          setError('Erro ao carregar o relatório.');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Erro ao carregar o relatório.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [reportId]);

  const handleExportPdf = async () => {
    setIsPdfExporting(true);
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      const response = await axios.get(`${API_URL}/api/report/export/${reportId}/pdf`);
      if (response.data.success) {
        setPdfUrl(response.data.data.pdfUrl);
      } else {
        setError('Erro ao exportar o relatório para PDF.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao exportar o relatório para PDF.');
    } finally {
      setIsPdfExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-red-800">Erro</h3>
        <p className="mt-2 text-red-700">{error}</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium text-yellow-800">Relatório não encontrado</h3>
        <p className="mt-2 text-yellow-700">O relatório solicitado não está disponível.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Relatório de Análise de Perfil</h2>
        <button
          onClick={handleExportPdf}
          disabled={isPdfExporting}
          className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white ${
            isPdfExporting
              ? 'bg-indigo-300 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          }`}
        >
          <ArrowDownTrayIcon className="-ml-0.5 mr-2 h-4 w-4" />
          {isPdfExporting ? 'Exportando...' : 'Exportar PDF'}
        </button>
      </div>

      {pdfUrl && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg">
          <h3 className="text-lg font-medium text-green-800">PDF Gerado com Sucesso!</h3>
          <p className="mt-2 text-green-700">
            Seu PDF está disponível para download:
          </p>
          <a
            href={pdfUrl}
            download
            className="mt-2 inline-block text-indigo-600 hover:text-indigo-800"
          >
            Baixar PDF
          </a>
        </div>
      )}

      {/* Pontuação Geral */}
      <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-indigo-100 rounded-full p-3">
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-indigo-600 text-white text-xl font-bold">
              {report.overallScore?.score || 75}
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-indigo-800">Pontuação Geral</h3>
            <p className="text-sm text-indigo-600">
              {report.overallScore?.methodology || 
                "A pontuação é calculada com base na análise de perfil (30%), análise de bio (30%), análise de link (20%) e análise de feed (20%)."}
            </p>
          </div>
        </div>
      </div>

      {/* Conteúdo do Relatório */}
      <div className="space-y-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-green-800">Pontos Fortes</h3>
          <div className="mt-2 space-y-2">
            <div>
              <h4 className="font-medium text-green-700">Perfil</h4>
              <p className="text-green-600">{report.tabs.pontosFortes.profile}</p>
            </div>
            <div>
              <h4 className="font-medium text-green-700">Biografia</h4>
              <p className="text-green-600">{report.tabs.pontosFortes.bio}</p>
            </div>
            <div>
              <h4 className="font-medium text-green-700">Link</h4>
              <p className="text-green-600">{report.tabs.pontosFortes.link}</p>
            </div>
            <div>
              <h4 className="font-medium text-green-700">Feed</h4>
              <p className="text-green-600">{report.tabs.pontosFortes.feed}</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-yellow-800">Melhorias</h3>
          <div className="mt-2 space-y-2">
            <div>
              <h4 className="font-medium text-yellow-700">Perfil</h4>
              <p className="text-yellow-600">{report.tabs.melhorias.profile}</p>
            </div>
            <div>
              <h4 className="font-medium text-yellow-700">Biografia</h4>
              <p className="text-yellow-600">{report.tabs.melhorias.bio}</p>
            </div>
            <div>
              <h4 className="font-medium text-yellow-700">Link</h4>
              <p className="text-yellow-600">{report.tabs.melhorias.link}</p>
            </div>
            <div>
              <h4 className="font-medium text-yellow-700">Feed</h4>
              <p className="text-yellow-600">{report.tabs.melhorias.feed}</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-blue-800">Ações Recomendadas</h3>
          <div className="mt-2 space-y-2">
            <div>
              <h4 className="font-medium text-blue-700">Curto Prazo</h4>
              <p className="text-blue-600">{report.tabs.acoesRecomendadas.shortTerm}</p>
            </div>
            <div>
              <h4 className="font-medium text-blue-700">Médio Prazo</h4>
              <p className="text-blue-600">{report.tabs.acoesRecomendadas.mediumTerm}</p>
            </div>
            <div>
              <h4 className="font-medium text-blue-700">Longo Prazo</h4>
              <p className="text-blue-600">{report.tabs.acoesRecomendadas.longTerm}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportViewer;
