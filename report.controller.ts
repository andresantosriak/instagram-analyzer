import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import env from '../config/env';

// Interface para os dados do relatório
interface ReportData {
  profileAnalysis: string;
  bioAnalysis: string;
  linkAnalysis: string;
  feedAnalysis: string;
  contentSuggestions: string;
  copySuggestions: string;
  imageSuggestions: string;
  overallScore: {
    score: number;
    methodology: string;
  };
}

// Controlador para geração de relatórios
export const generateReport = async (req: Request, res: Response) => {
  try {
    const { reportData } = req.body;

    if (!reportData) {
      return res.status(400).json({
        success: false,
        message: 'Dados do relatório não fornecidos'
      });
    }

    // Estrutura o relatório em abas
    const structuredReport = structureReport(reportData);

    // Gera um ID único para o relatório
    const reportId = generateReportId();
    
    // Usa o diretório de relatórios configurado
    const reportsDir = path.resolve(process.cwd(), env.reportsDir);
    
    // Cria o diretório de relatórios se não existir
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    const reportPath = path.join(reportsDir, `${reportId}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(structuredReport, null, 2));

    // Determina a URL base com base no ambiente
    const baseUrl = env.nodeEnv === 'production' 
      ? `https://${req.get('host')}` 
      : `http://localhost:${env.port}`;

    // Gera link compartilhável
    const shareableLink = `${baseUrl}/api/report/view/${reportId}`;

    return res.status(200).json({
      success: true,
      data: {
        report: structuredReport,
        shareableLink,
        reportId
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao gerar relatório',
      details: error.message
    });
  }
};

// Controlador para visualizar um relatório específico
export const viewReport = async (req: Request, res: Response) => {
  try {
    const { reportId } = req.params;
    
    if (!reportId) {
      return res.status(400).json({
        success: false,
        message: 'ID do relatório não fornecido'
      });
    }
    
    const reportsDir = path.resolve(process.cwd(), env.reportsDir);
    const reportPath = path.join(reportsDir, `${reportId}.json`);
    
    if (!fs.existsSync(reportPath)) {
      return res.status(404).json({
        success: false,
        message: 'Relatório não encontrado'
      });
    }
    
    const reportData = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    
    return res.status(200).json({
      success: true,
      data: reportData
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao visualizar relatório',
      details: error.message
    });
  }
};

// Controlador para exportar relatório em PDF (simulado)
export const exportReportPdf = async (req: Request, res: Response) => {
  try {
    const { reportId } = req.params;
    
    if (!reportId) {
      return res.status(400).json({
        success: false,
        message: 'ID do relatório não fornecido'
      });
    }
    
    const reportsDir = path.resolve(process.cwd(), env.reportsDir);
    const reportPath = path.join(reportsDir, `${reportId}.json`);
    
    if (!fs.existsSync(reportPath)) {
      return res.status(404).json({
        success: false,
        message: 'Relatório não encontrado'
      });
    }
    
    // Em uma implementação real, aqui seria gerado um PDF
    // Para esta demonstração, apenas retornamos uma mensagem de sucesso
    
    // Determina a URL base com base no ambiente
    const baseUrl = env.nodeEnv === 'production' 
      ? `https://${req.get('host')}` 
      : `http://localhost:${env.port}`;
    
    return res.status(200).json({
      success: true,
      message: 'PDF gerado com sucesso',
      data: {
        pdfUrl: `${baseUrl}/api/report/download/${reportId}.pdf`
      }
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao exportar relatório para PDF',
      details: error.message
    });
  }
};

// Função para estruturar o relatório em abas
const structureReport = (reportData: ReportData) => {
  // Extrai pontos fortes e melhorias das análises
  // Em uma implementação real, isso seria feito com processamento de linguagem natural
  // mais sofisticado para extrair pontos específicos dos textos de análise
  
  return {
    overallScore: reportData.overallScore,
    tabs: {
      pontosFortes: extractStrengths(reportData),
      melhorias: extractImprovements(reportData),
      acoesRecomendadas: extractRecommendedActions(reportData),
      conteudoEstrategico: {
        contentSuggestions: reportData.contentSuggestions,
        copySuggestions: reportData.copySuggestions,
        imageSuggestions: reportData.imageSuggestions
      },
      analiseCompleta: {
        profileAnalysis: reportData.profileAnalysis,
        bioAnalysis: reportData.bioAnalysis,
        linkAnalysis: reportData.linkAnalysis,
        feedAnalysis: reportData.feedAnalysis
      }
    }
  };
};

// Funções auxiliares para extrair informações das análises
// Estas são implementações simplificadas
const extractStrengths = (reportData: ReportData) => {
  return {
    profile: "Pontos fortes do perfil seriam extraídos da análise",
    bio: "Pontos fortes da bio seriam extraídos da análise",
    link: "Pontos fortes do link seriam extraídos da análise",
    feed: "Pontos fortes do feed seriam extraídos da análise"
  };
};

const extractImprovements = (reportData: ReportData) => {
  return {
    profile: "Melhorias do perfil seriam extraídas da análise",
    bio: "Melhorias da bio seriam extraídas da análise",
    link: "Melhorias do link seriam extraídas da análise",
    feed: "Melhorias do feed seriam extraídas da análise"
  };
};

const extractRecommendedActions = (reportData: ReportData) => {
  return {
    shortTerm: "Ações de curto prazo seriam extraídas das análises",
    mediumTerm: "Ações de médio prazo seriam extraídas das análises",
    longTerm: "Ações de longo prazo seriam extraídas das análises"
  };
};

// Função para gerar ID único para o relatório
const generateReportId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};
