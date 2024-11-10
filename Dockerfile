FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy all files from the current directory to the /app directory in the container
COPY . /app

# Install dependencies (assuming package.json and package-lock.json are present)
RUN npm install

# Run the command to build the application
RUN npm run build

# Run the command to start the application
CMD ["npm", "run", "start"]