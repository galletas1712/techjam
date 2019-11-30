FROM node:12.13-buster
WORKDIR /app
COPY . /app
RUN npm install
EXPOSE 8000
CMD ["node", "server.js"]
