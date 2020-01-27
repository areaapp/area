FROM node:12

WORKDIR . /opt/area/server

COPY package*.json ./

RUN npm install
RUN npm i -g adonis-cli
RUN npm i -g apidoc

RUN npm run doc

COPY docs /opt/area/docs/api

COPY . .

EXPOSE 5002

CMD [ "npm", "start" ]
