# Step 1: Build the Next.js app
FROM node:18 AS builder

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the entire project
COPY . .

# Build the Next.js app
RUN npm run build

# Step 2: Run the Next.js app
FROM node:18

# Set the working directory
WORKDIR /app

# Install production dependencies
COPY package.json package-lock.json ./
RUN npm install --production

# Copy the built files from the builder stage
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public

# Expose the port Next.js will run on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]