FROM mcr.microsoft.com/devcontainers/javascript-node:20

# Install additional tools
RUN apt-get update && apt-get install -y \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /workspaces/franchisesgate

# Install global packages
RUN npm install -g vite npm-check-updates

EXPOSE 5173 3000
