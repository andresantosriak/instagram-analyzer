import { Request, Response } from 'express';
import Joi from 'joi';
import { OpenAI } from 'openai';

// Validação da API Key da OpenAI
export const validateApiKey = async (req: Request, res: Response) => {
  try {
    const schema = Joi.object({
      apiKey: Joi.string().required().min(20)
    });

    const { error, value } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ 
        success: false, 
        message: 'Chave API inválida', 
        details: error.details[0].message 
      });
    }

    // Tenta criar uma instância da OpenAI com a chave fornecida
    const openai = new OpenAI({
      apiKey: value.apiKey
    });

    // Tenta fazer uma chamada simples para verificar se a chave é válida
    try {
      const response = await openai.models.list();
      return res.status(200).json({ 
        success: true, 
        message: 'Chave API validada com sucesso' 
      });
    } catch (error: any) {
      return res.status(401).json({ 
        success: false, 
        message: 'Chave API inválida ou expirada',
        details: error.message
      });
    }
  } catch (error: any) {
    return res.status(500).json({ 
      success: false, 
      message: 'Erro ao validar a chave API',
      details: error.message
    });
  }
};
