FROM node:alpine

WORKDIR /opt/matcher.asmalltalk
COPY package.json .
RUN npm install

COPY . .

CMD ["npm", "run", "start"]
