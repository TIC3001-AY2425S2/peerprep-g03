#FROM node:20-alpine AS development-dependencies-env
#COPY . /app
#WORKDIR /app
#RUN npm ci
#
#FROM node:20-alpine AS production-dependencies-env
#COPY ./package.json package-lock.json /app/
#WORKDIR /app
#RUN npm ci --omit=dev
#
#FROM node:20-alpine AS build-env
#COPY . /app/
#COPY --from=development-dependencies-env /app/node_modules /app/node_modules
#WORKDIR /app
#RUN npm run build
#
#FROM node:20-alpine
#COPY ./package.json package-lock.json /app/
#COPY --from=production-dependencies-env /app/node_modules /app/node_modules
#COPY --from=build-env /app/build /app/build
#WORKDIR /app
#CMD ["npm", "run", "start"]

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
