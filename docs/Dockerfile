FROM rust:latest

WORKDIR . /tmp/dev

COPY . .

#RUN cargo install mdbook

RUN wget "https://github.com/rust-lang/mdBook/releases/download/v0.3.5/mdbook-v0.3.5-x86_64-unknown-linux-gnu.tar.gz"

RUN tar -xf mdbook-v0.3.5-x86_64-unknown-linux-gnu.tar.gz

RUN ./mdbook build dev -d /opt/area/docs/dev
