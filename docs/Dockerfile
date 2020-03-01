FROM debian:latest
WORKDIR . /opt/area/build-docs

COPY . /opt/area/build-docs

RUN apt-get upgrade -y
RUN apt-get update -y
RUN apt-get install wget -y

RUN wget "https://github.com/rust-lang/mdBook/releases/download/v0.3.5/mdbook-v0.3.5-x86_64-unknown-linux-gnu.tar.gz"

RUN tar -xf mdbook-v0.3.5-x86_64-unknown-linux-gnu.tar.gz

RUN mkdir -p /opt/area/docs/dev
RUN mkdir -p /opt/area/docs/user

CMD ./mdbook build /opt/area/build-docs/dev -d /opt/area/docs/dev && ./mdbook build /opt/area/build-docs/user -d /opt/area/docs/user
