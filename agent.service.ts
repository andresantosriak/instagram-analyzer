import { Request, Response } from 'express';
import { OpenAI } from 'openai';

// Interface para os serviços de agentes de IA
export interface AgentService {
  analyze: (data: any) => Promise<any>;
}

// Classe base para todos os agentes de IA
export class BaseAgent implements AgentService {
  protected openai: OpenAI;
  protected systemPrompt: string;
  
  constructor(apiKey: string, systemPrompt: string) {
    this.openai = new OpenAI({
      apiKey: apiKey
    });
    this.systemPrompt = systemPrompt;
  }
  
  async analyze(data: any): Promise<any> {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: this.systemPrompt },
          { role: "user", content: JSON.stringify(data) }
        ],
        temperature: 0.7,
      });
      
      return response.choices[0].message.content;
    } catch (error: any) {
      throw new Error(`Erro na análise do agente: ${error.message}`);
    }
  }
}
