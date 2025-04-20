FROM mcr.microsoft.com/devcontainers/base:ubuntu-24.04

# Install essential development tools
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install git curl wget build-essential \
    && apt-get clean -y && rm -rf /var/lib/apt/lists/*

# Install MongoDB
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install gnupg \
    && curl -fsSL https://pgp.mongodb.com/server-7.0.asc | gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor \
    && echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list \
    && apt-get update \
    && apt-get install -y mongodb-org \
    && apt-get clean -y && rm -rf /var/lib/apt/lists/* 