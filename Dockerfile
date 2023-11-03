# Use an official Node.js runtime as a parent image
FROM node:18.17.0-alpine

# Defines the app environment
ENV APP_ENV prod

# apk = Package manager by Alpine Linux, a lightweight Linux distribution 
# to install or upgrade the bash package.
RUN apk add --no-cache --upgrade bash

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port that Slack Bolt app will run on
EXPOSE 3000

# Define the command to run Slack Bolt app
CMD [ "npm", "start" ]
