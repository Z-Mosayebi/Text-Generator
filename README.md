# Text-Generation Interface with Next.js and ShadCN

## Project Overview
This project is a text-generation interface built using **Next.js** for the frontend and **ShadCN** for UI components. Users can set default preferences regarding their business type and target audience. Based on these inputs, the application generates text content for various use cases such as blog posts, ad copy, product descriptions, and social media captions.

## Features
- **User Preferences**: Users can specify their business type and target audience.
- **Prompt Input**: A text input field allows users to enter a prompt.
- **AI-Powered Content Generation**: The application generates relevant text content using OpenAI's API.
- **Markdown Formatting**: The generated content is displayed with proper formatting.

## Tech Stack
- **Next.js**: Framework for the frontend
- **ShadCN**: UI component library
- **OpenAI API**: AI-powered text generation
- **Tailwind CSS**: Styling framework

## Installation
### Prerequisites
Ensure you have **Node.js** and **npm/yarn** installed on your system.

### Clone the Repository
```sh
git clone https://github.com/your-username/text-generation-interface.git
cd text-generation-interface
```

### Install Dependencies
```sh
npm install  # or yarn install
```

## Running the Project
```sh
npm run dev  # or yarn dev
```
Open `http://localhost:3000` in your browser to access the app.

## API Configuration
1. Obtain an OpenAI API key from [OpenAI](https://openai.com/).
2. Create a `.env.local` file in the project root and add the following:
```env
NEXT_PUBLIC_OPENAI_API_KEY=your-api-key-here
```

## Project Structure
```
├── components/        # Reusable UI components
├── pages/             # Next.js pages
│   ├── index.tsx      # Homepage with input and result display
├── styles/            # Global styles
├── utils/             # Utility functions
└── public/            # Static assets
```

## Future Improvements
- Add more AI model options
- Improve UI/UX
- Implement authentication for user-specific preferences

## License
This project is licensed under the MIT License.

## Contact
For inquiries, reach out via [zhmosayebi@gmail.com](mailto:zhmosayebi@gmail.com).

