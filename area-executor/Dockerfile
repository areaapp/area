FROM node:12.10.0

WORKDIR . /opt/area/executor

COPY . .

RUN npm i -g webpack webpack-cli
RUN npm i
RUN npm run build

CMD ["node", "./dist/executor"]
