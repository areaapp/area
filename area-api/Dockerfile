# Build api
FROM node:12.10.0

WORKDIR . /opt/area/server

COPY package*.json ./

RUN npm install
RUN npm i -g adonis-cli
RUN npm i -g apidoc

COPY . .

EXPOSE 5002

CMD apidoc -i start -f start/routes.js -o /opt/area/docs/api/ && npm start
