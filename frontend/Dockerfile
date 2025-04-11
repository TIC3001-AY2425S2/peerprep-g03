# Base image
FROM node:22.14

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy application source code
COPY . .

# Runtime configuration
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
