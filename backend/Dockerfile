FROM node:16
WORKDIR /backend
COPY ./ ./
COPY ./.env.example ./.env
RUN npm install 
EXPOSE 8000
ENTRYPOINT ["node", "server.js"]