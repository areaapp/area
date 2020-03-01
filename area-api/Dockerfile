# Build api
FROM node:12.10.0

WORKDIR . /opt/area/server

COPY package*.json ./

RUN npm install
RUN npm i -g adonis-cli
RUN npm i -g apidoc

COPY . .

# Build documentation
RUN npm run doc
RUN mkdir -p /opt/area/docs/api
RUN cp -rf doc/* /opt/area/docs/api

EXPOSE 5002

CMD [ "npm", "start" ]
