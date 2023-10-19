# Use the official Node.js runtime as a parent image
FROM node:16

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Copy all the application files to the container
COPY . .

# Make port 5001 available to the world outside this container
EXPOSE 5000

# Define the command to run your application
CMD ["node", "index.js"]
