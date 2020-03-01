FROM node:12.10.0

# Client build directory
RUN mkdir -p /opt/area/web
WORKDIR /opt/area/web

COPY . /opt/area/web

# Install and build
RUN npm install
RUN npm run build

ENV HOST 0.0.0.0
ENV PORT 5001

EXPOSE 5001

CMD [ "npm", "start" ]
