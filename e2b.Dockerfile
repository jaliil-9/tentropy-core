FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install Python test dependencies
RUN pip install --no-cache-dir \
    pytest==8.0.0 \
    tenacity==8.2.3 \
    requests==2.31.0

# Set working directory
WORKDIR /home/user

# Create a non-root user
RUN useradd -m -u 1000 user && chown -R user:user /home/user
USER user
