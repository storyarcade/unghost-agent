export interface ModelConfig {
  basic: string[];
  reasoning: string[];
}

export interface RagConfig {
  provider: string;
}

export interface UnghostAgentConfig {
  rag: RagConfig;
  models: ModelConfig;
}
