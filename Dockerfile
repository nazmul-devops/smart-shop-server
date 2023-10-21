# Use an official Node.js runtime as the base image
FROM node:16.15.0

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of your application code to the working directory
COPY . .

# Expose a port that your app will listen on
EXPOSE 5000

# Define the command to start your Express application
CMD ["node", "index.js"]
