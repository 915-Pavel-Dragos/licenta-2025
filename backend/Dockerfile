# Dockerfile

# Base image
FROM python:3.12.3

# Set working directory
WORKDIR /app_backend

# Install dependencies
COPY requirements.txt /app_backend/
RUN pip install -r requirements.txt

# Copy project files
COPY . /app_backend/

