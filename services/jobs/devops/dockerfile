FROM node:alpine

WORKDIR /opt/jobupdator.asmalltalk
COPY package.json .
RUN npm install

COPY . .
COPY prod.config.json config.json

CMD ["npm", "run", "start"]
