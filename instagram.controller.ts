import { Request, Response } from 'express';
import { 
  ProfileAnalysisAgent,
  BioAnalysisAgent,
  LinkAnalysisAgent,
  FeedAnalysisAgent,
  ContentCreationAgent,
  CopywritingAgent,
  ImageConceptAgent
} from '../services/instagram-agents.service';

// Interface para os dados do perfil do Instagram
interface InstagramProfileData {
  username: string;
  followers: number;
  bio: string;
  bioLink?: string;
  profileImageUrl?: string;
  recentPosts?: string[];
}

// Controlador para os agentes de IA
export const analyzeProfile = async (req: Request, res: Response) => {
  try {
    const { apiKey, profileData } = req.body;

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        message: 'API Key da OpenAI não fornecida'
      });
    }

    if (!profileData || !profileData.username) {
      return res.status(400).json({
        success: false,
        message: 'Dados do perfil incompletos ou inválidos'
      });
    }

    // Inicializa os agentes com a API Key fornecida
    const profileAgent = new ProfileAnalysisAgent(apiKey);
    const bioAgent = new BioAnalysisAgent(apiKey);
    const linkAgent = new LinkAnalysisAgent(apiKey);
    const feedAgent = new FeedAnalysisAgent(apiKey);
    const contentAgent = new ContentCreationAgent(apiKey);
    const copyAgent = new CopywritingAgent(apiKey);
    const imageAgent = new ImageConceptAgent(apiKey);

    // Executa as análises em paralelo para otimizar o tempo
    const [
      profileAnalysis,
      bioAnalysis,
      linkAnalysis,
      feedAnalysis,
      contentSuggestions,
      copySuggestions,
      imageSuggestions
    ] = await Promise.all([
      profileAgent.analyze({
        username: profileData.username,
        followers: profileData.followers,
        bioLink: profileData.bioLink,
        profileImageUrl: profileData.profileImageUrl
      }),
      bioAgent.analyze({
        username: profileData.username,
        bio: profileData.bio
      }),
      profileData.bioLink ? linkAgent.analyze({
        username: profileData.username,
        bioLink: profileData.bioLink
      }) : Promise.resolve("Link não fornecido"),
      profileData.recentPosts && profileData.recentPosts.length > 0 ? 
        feedAgent.analyze({
          username: profileData.username,
          posts: profileData.recentPosts
        }) : Promise.resolve("Posts não fornecidos"),
      contentAgent.analyze({
        username: profileData.username,
        followers: profileData.followers,
        bio: profileData.bio,
        niche: "Será determinado com base na análise da bio"
      }),
      copyAgent.analyze({
        username: profileData.username,
        bio: profileData.bio,
        tone: "Será determinado com base na análise da bio"
      }),
      imageAgent.analyze({
        username: profileData.username,
        niche: "Será determinado com base na análise da bio"
      })
    ]);

    // Compila os resultados
    const analysisResults = {
      profileAnalysis,
      bioAnalysis,
      linkAnalysis,
      feedAnalysis,
      contentSuggestions,
      copySuggestions,
      imageSuggestions,
      overallScore: calculateOverallScore({
        profileAnalysis,
        bioAnalysis,
        linkAnalysis,
        feedAnalysis
      })
    };

    return res.status(200).json({
      success: true,
      data: analysisResults
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao analisar o perfil',
      details: error.message
    });
  }
};

// Função para calcular a pontuação geral
const calculateOverallScore = (analyses: any) => {
  // Implementação simplificada - em uma versão real, seria mais sofisticada
  // com pesos diferentes para cada componente e análise de texto para extrair pontuações
  return {
    score: 75, // Pontuação de exemplo
    methodology: "A pontuação é calculada com base na análise de perfil (30%), análise de bio (30%), análise de link (20%) e análise de feed (20%)."
  };
};
