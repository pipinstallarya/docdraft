import OpenAI from 'openai';
import { storageService } from './storage';

// Discreet naming to avoid suspicion
export const contentService = {
  async generateSuggestions(prompt: string, options: {
    contextType?: string,  // Allows the user to specify a type of document
    outputFormat?: string, // Allows the user to specify a format
    tone?: string          // Allows the user to specify a tone
  } = {}): Promise<string> {
    try {
      const apiKey = await storageService.getApiKey();

      if (!apiKey) {
        throw new Error('API key not found. Please configure your account settings.');
      }

      const openai = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true // Allowing browser usage for this client-side app
      });

      // Format system message to guide the model response
      let systemMessage = 'You are a helpful assistant for generating document content.';

      // Add context type if provided
      if (options.contextType) {
        systemMessage += ` Generate content for a ${options.contextType}.`;
      }

      // Add tone if provided
      if (options.tone) {
        systemMessage += ` Use a ${options.tone} tone.`;
      }

      // Add format if provided
      if (options.outputFormat) {
        systemMessage += ` Format the response as ${options.outputFormat}.`;
      } else {
        systemMessage += ' Format the response in Markdown.';
      }

      const response = await openai.chat.completions.create({
        model: 'gpt-4.1', // Using the GPT-4o model
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 32768
      });

      return response.choices[0]?.message?.content || 'No suggestions generated.';
    } catch (error) {
      console.error('Error generating suggestions:', error);
      throw new Error('Failed to generate suggestions. Please try again later.');
    }
  },

  // A method for validating the API key
  async validateApiKey(apiKey: string): Promise<boolean> {
    try {
      const openai = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true
      });

      // Make a minimal API call to check if the key works
      await openai.models.list();
      return true;
    } catch (error) {
      console.error('API key validation error:', error);
      return false;
    }
  }
};
