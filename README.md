# Accountability Clock

[cloudflarebutton]

The Accountability Clock is a visually striking, single-page web application designed as a public-facing dashboard. It calculates and displays, in real-time, the accumulating salary of a public official on paid leave amidst controversy. The application's core purpose is to provide a stark, quantifiable measure of the cost to taxpayers, framed by the context of the official's alleged misconduct.

The design is intentionally dramatic and somber, using a dark theme with red accents to evoke a sense of urgency and seriousness. The central feature is a live counter that ticks up every second, creating a powerful and constant reminder of the financial implications. It is built to be a simple, impactful, and shareable tool for public awareness and advocacy.

## Key Features

-   **Real-Time Salary Counter:** A live, ticking counter showing the total salary accumulated since the leave period began.
-   **Dynamic Cost Breakdown:** Displays calculated hourly, daily, and yearly wage rates for context.
-   **Impactful Visual Design:** A dark, serious aesthetic with a somber color palette to emphasize the gravity of the subject.
-   **Contextual Information:** A dedicated section summarizing the controversy and reasons for the public official's leave.
-   **Single-Page Application:** All information is presented in a single, focused view for immediate impact and clarity.
-   **Responsive Design:** Flawless layout and readability across all device sizes, from mobile phones to desktops.

## Technology Stack

This project is built with a modern, full-stack TypeScript architecture leveraging the Cloudflare ecosystem.

-   **Frontend:**
    -   **Framework:** React (with Vite)
    -   **Styling:** Tailwind CSS
    -   **UI Components:** shadcn/ui
    -   **Icons:** Lucide React
    -   **Animation:** Framer Motion
    -   **State Management:** Zustand
    -   **Date/Time:** date-fns
-   **Backend:**
    -   **Runtime:** Cloudflare Workers
    -   **Framework:** Hono
    -   **State & Persistence:** Cloudflare Durable Objects
-   **Language:** TypeScript

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Bun](https://bun.sh/) installed on your machine.
-   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) for interacting with the Cloudflare platform.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/accountability_clock.git
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd accountability_clock
    ```
3.  **Install dependencies:**
    ```sh
    bun install
    ```

### Running in Development Mode

To start the local development server, which includes the Vite frontend and a local instance of the Cloudflare Worker, run:

```sh
bun run dev
```

This will start the application, typically available at `http://localhost:3000`. The frontend will hot-reload on changes, and the worker will restart automatically.

## Project Structure

The codebase is organized into three main directories:

-   `src/`: Contains the entire React frontend application, including pages, components, hooks, and styles.
-   `worker/`: Contains the Cloudflare Worker backend code, including the Hono server, API routes (`userRoutes.ts`), and the Durable Object logic (`durableObject.ts`).
-   `shared/`: Contains TypeScript types and interfaces that are shared between the frontend and backend to ensure type safety across the stack.

## Development

### Adding API Endpoints

New backend routes can be added in `worker/userRoutes.ts`. Follow the existing Hono patterns to define new endpoints that interact with the `GlobalDurableObject`.

### Modifying Durable Object Logic

The core stateful logic resides in the `GlobalDurableObject` class in `worker/durableObject.ts`. You can add new methods here to manage or retrieve data from the durable storage.

### Frontend Components

All UI components are located in `src/components`. The main application view is `src/pages/HomePage.tsx`, which should be modified to build out the user interface.

## Deployment

This application is designed for easy deployment to Cloudflare's global network.

1.  **Build the application:**
    First, build the frontend and worker assets.
    ```sh
    bun run build
    ```
2.  **Deploy with Wrangler:**
    Run the deploy command to publish your application.
    ```sh
    bun run deploy
    ```

Wrangler will handle the process of uploading your assets and deploying the worker.

Alternatively, deploy directly from your GitHub repository with a single click:

[cloudflarebutton]

## License

This project is licensed under the MIT License.