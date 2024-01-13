FROM node
COPY . /tmp/app
RUN cd /tmp/app && npm install
WORKDIR /tmp/app
EXPOSE 8080
CMD node .
