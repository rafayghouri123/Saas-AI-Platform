import { google } from '@ai-sdk/google';
import { embedMany } from 'ai';
import { RAG } from "@convex-dev/rag";
import { components } from '../../_generated/api';

const rag = new RAG(components.rag, {
  textEmbeddingModel: {
    provider: 'google',
    modelId: 'text-embedding-004',
    maxEmbeddingsPerCall: 100,
    supportsParallelCalls: true,
    doEmbed: async (options: { 
      values: string[]; 
      abortSignal?: AbortSignal; 
      providerOptions?: any; 
      headers?: Record<string, string>; 
    }) => {
      const result = await embedMany({
        model: google.textEmbeddingModel('text-embedding-004'),
        values: options.values,
        abortSignal: options.abortSignal,
        headers: options.headers,
      });
      return { 
        embeddings: result.embeddings,
        usage: result.usage
      };
    },
    specificationVersion: 'v2' as const,
  },
  embeddingDimension: 768,
});

export default rag;