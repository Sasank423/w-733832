# ImageGenHub - Community Meme Generator & Voting Platform

## Overview

ImageGenHub is a dedicated platform for developers and tech enthusiasts to create, share, and vote on code-related memes. The application provides a comprehensive suite of tools for meme creation, community interaction, and content discovery.

## Features

### Meme Creation Studio
- **Template Gallery**: Choose from 30+ popular meme templates
- **Image Upload**: Upload your own images for customization
- **Text Captions**: Add and position text captions with drag-and-drop functionality
- **Styling Options**: Customize font size, color, family, and add text shadows
- **Draft System**: Save works-in-progress and continue editing later

### Community Interaction
- **Voting System**: Upvote or downvote memes (one vote per user)
- **Comments**: Engage in discussions with a comment section for each meme
- **Content Moderation**: Flag inappropriate content for review

### Content Discovery
- **Feed Filters**: Browse memes by New, Top 24h, Top Week, or All Time
- **Infinite Scroll**: Seamlessly load more content as you browse
- **Trending Content**: Discover the Meme of the Day and Weekly Champion

### User Dashboard
- **Creator Dashboard**: View your published memes with engagement statistics
- **Drafts Management**: Access and manage your saved drafts
- **Profile Page**: View your created and liked memes in one place

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Framer Motion for animations
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **Build Tool**: Vite

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Supabase account (for backend services)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/imagegenhub.git

# Navigate to project directory
cd imagegenhub

# Install dependencies
npm install

# Set up environment variables
# Create a .env file based on .env.example

# Start development server
npm run dev
```

### Supabase Setup

The project uses Supabase for backend functionality. The database schema migrations are included in the `supabase/migrations` directory.

1. Create a Supabase project
2. Run the migrations or import the SQL files
3. Configure authentication providers
4. Update your environment variables with Supabase credentials

## Project Structure

```
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI components
│   ├── hooks/          # Custom React hooks
│   ├── integrations/   # Third-party service integrations
│   ├── lib/            # Utility functions and helpers
│   ├── pages/          # Application pages/routes
│   ├── styles/         # Global styles
│   └── types/          # TypeScript type definitions
└── supabase/          # Supabase configuration and migrations
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

