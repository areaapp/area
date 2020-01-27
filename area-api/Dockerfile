FROM node:12

WORKDIR . /opt/area/server

COPY package*.json ./

RUN npm install
RUN npm i -g adonis-cli
RUN npm i -g apidoc

COPY . .

# Build documentation
RUN npm run doc
COPY doc /opt/area/docs/api

EXPOSE 5002

CMD [ "npm", "start" ]
