FROM node:12

WORKDIR . /opt/area/server

COPY package*.json ./

RUN npm install
RUN npm i -g adonis-cli

COPY . .

EXPOSE 5002

CMD [ "npm", "start" ]
