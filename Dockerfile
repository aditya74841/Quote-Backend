# Use an official Node.js image
FROM node:18

# Set working directory inside container
WORKDIR /src

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Inside your Dockerfile
COPY .env .env
`
# Expose the port your app runs on (e.g., 3000)
EXPOSE 8080

# Command to run the app
CMD ["npm", "start"]
