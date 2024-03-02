import { config } from './config';

interface Message {
	role: string;
	content: string;
}

interface Completion {
	Content: string | null;
	TokenUsage: number | undefined;
}

interface ConnectorResponse {
	Completions: Completion[];
	ModelType: string;
}

interface ChatCompletion {
	output: string;
	stats: { model: string };
}

const mapToResponse = (outputs: ChatCompletion[]): ConnectorResponse => {
	return {
		Completions: outputs.map((output) => ({
			Content: output.output,
			TokenUsage: undefined, // Token usage is not provided in this simple echo connector
		})),
		ModelType: outputs[0].stats.model,
	};
};

// This is a mock function that simulates the behavior of an echo chat model
async function echoChatModel(model: string, message: string): Promise<string> {
	// Simply return the message as is, simulating an echo
	return message;
}

async function main(
	model: string,
	prompts: string[],
): Promise<ConnectorResponse> {
	const messageHistory: Message[] = [
		{ role: 'system', content: 'You are a helpful assistant.' },
	];

	const outputs: ChatCompletion[] = [];

	try {
		for (const prompt of prompts) {
			messageHistory.push({ role: 'user', content: prompt });

			// Using the echoChatModel instead of an external API
			const assistantResponse = await echoChatModel(model, prompt);

			messageHistory.push({ role: 'assistant', content: assistantResponse });

			outputs.push({ output: assistantResponse, stats: { model } });

			console.log(`Echo response to prompt: ${prompt}`, assistantResponse);
		}

		return mapToResponse(outputs);
	} catch (error) {
		console.error('Error in main function:', error);
		throw error;
	}
}

export { main, config };
