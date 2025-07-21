# README.md

# SmartHelp.AI

SmartHelp.AI is an AI-powered FAQ chatbot that allows businesses to create a custom chatbot based on their website's FAQ or support content. Users can upload documents or paste text, and the chatbot will respond to user inquiries using the provided content.

## Features

1. **Upload FAQ/Docs**: Users can paste content or upload .txt/.pdf files.
2. **AI Chat Interface**: The chatbot responds using the uploaded content only, providing accurate answers.
3. **Context-Based Answering**: Utilizes OpenAI's API with a system prompt to limit the scope of responses.
4. **Embed Code Generator**: Generates simple `<iframe>` or script tags for easy integration into any website.
5. **Chat History**: Optionally saves chat history per user session for better user experience.

## Tech Stack

- **Frontend**: React, Tailwind CSS, Chat UI
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **AI**: OpenAI GPT API

## Getting Started

### Prerequisites

- Node.js
- MongoDB
- TypeScript

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/smarthelp-ai.git
   ```

2. Navigate to the backend directory:
   ```
   cd smarthelp-ai/smarthelp-ai-backend
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Set up environment variables:
   - Copy `.env.example` to `.env` and fill in the required values.

5. Start the server:
   ```
   npm run start
   ```

## Usage

- Access the API endpoints to upload FAQs, interact with the chatbot, and generate embed codes.
- Refer to the API documentation for detailed usage instructions.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.