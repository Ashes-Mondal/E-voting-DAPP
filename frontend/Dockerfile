FROM node:16
WORKDIR /frontend
COPY ./ ./
RUN npm install
EXPOSE 5173
ENTRYPOINT ["npm","run","dev"]