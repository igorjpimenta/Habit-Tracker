# Habit Tracker Application

![License](https://img.shields.io/github/license/igorjpimenta/Habit-Tracker)
![Contributors](https://img.shields.io/github/contributors/igorjpimenta/Habit-Tracker)
![Issues](https://img.shields.io/github/issues/igorjpimenta/Habit-Tracker)
![Forks](https://img.shields.io/github/forks/igorjpimenta/Habit-Tracker)
![Stars](https://img.shields.io/github/stars/igorjpimenta/Habit-Tracker)

## Overview

**Habit Tracker** is an application designed to help you stay on track with your habits, abandon bad ones, set weekly goals, and monitor your progress over time.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [License](#license)
- [Acknowledgments](#acknowledgments)
- [Contact](#contact)

## Features

- **Set goals**: Set weekly goals for the habits that you want to build and for those ones that you want to stop doing.
- **Track your progress**: Track your weekly progress towards your goals.
- **Improve your performance**: View your performance and completion status across multiple weeks and enjoy your journey.

## Tech Stack

- **Backend**: Node.js (Fastify), TypeScript
- **Database**: Postgres (managed using Drizzle ORM and running in Docker)
- **Containerization**: Docker

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- [Docker](https://www.docker.com/get-started)
- [Node.js and npm](https://nodejs.org/)

### Installation

To run the project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/igorjpimenta/Habit-Tracker.git
   cd Habit-Tracker
    ```

2. **Set the environment variables**:
    ```bash
    echo 'DB_HOST="localhost"
    DB_PORT=5432
    DB_NAME="your-database-name"
    DB_USER="your-database-user"
    DB_PASSWORD="your-database-password"' > .env

3. **Install backend dependencies**:
    ```bash
    cd server
    npm install
    ```

4. **Build and run PostgreSQL in Docker:**:
    ```bash
    docker-compose --env-file ../.env up -d
    ```

5. **Run database migrations**:
    ```bash
    npm run migrate
    ```

6. **Run database seed (Optional)**:
    ```bash
    npm run seed
    ```

### Running the Application

1. **Run the backend server**:
    ```bash
    cd server
    npm run dev
    ```
    The backend server will start on `http://localhost:3333`.

## Contributing
We welcome contributions from the community! Here's how you can get involved:

1. Fork the repository: Click the "Fork" button at the top right of this page.

2. Clone your fork:
    ```bash
    git clone https://github.com/yourusername/Habit-Tracker.git
    ```

3. Create a branch:
    ```bash
    git checkout -b feature/your-feature-name
    ```

4. Make your changes: Write clear, concise commit messages.

5. Push to your fork:
    ```bash
    git push origin feature/your-feature-name
    ```

6. Submit a pull request: Describe your changes in the PR and link any relevant issues.

### Contribution Guidelines
- Follow the existing code style.
- Write tests for new features or bug fixes.
- Keep your pull requests small and focused on a single issue or feature.
- Provide clear documentation for new features.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
- Inspired by an event from Rocketseat, the main backend repo is available [here](https://github.com/rocketseat-education/nlw-pocket-js-node).

## Contact
May you have questions or suggestions, feel free to open an issue or contact the project maintainers.