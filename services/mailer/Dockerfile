FROM node:alpine

WORKDIR /opt/mailer.asmalltalk
COPY package.json .
RUN npm install

COPY . .

CMD ["npm", "run", "start"]
