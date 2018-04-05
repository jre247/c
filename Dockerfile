FROM node:7.9.0-alpine

# Set a working directory
WORKDIR /app

# Copy application files
COPY ./build .
COPY ./deploy .

RUN yarn install

CMD ["npm", "start"]
