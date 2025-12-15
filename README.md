# Release Check

**Release Check** is a Next.js application that helps developers and recruiters fact-check job descriptions by validating if required years of experience for specific technologies are realistically possible based on their release dates.

## Features

*   **JD Fact-Checker**: Instantly validate if an experience requirement (e.g., "React 10 years") is possible. Returns a Valid/Impossible verdict with sarcastic commentary.
*   **Technology Radar**: A categorized directory of technologies (Frontend, Backend, AI, Cloud, etc.) displaying their release years and current age.
*   **Bookmarks**: Save frequently checked technologies for quick access.
*   **Wall of Shame**: A gallery of anonymous, unrealistic job descriptions.
*   **JD Parser**: Automatically parse job descriptions to extract and validate experience requirements.

## Tech Stack

*   **Framework**: Next.js 16 (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS, Radix UI, Lucide Icons
*   **State Management**: React Hooks
*   **Key Libraries**: `canvas-confetti`, `sonner`, `react-hook-form`, `zod`

## Database

For the database, you can open an issue here: [https://github.com/Araise25/Release-Check-DB](https://github.com/Araise25/Release-Check-DB)
