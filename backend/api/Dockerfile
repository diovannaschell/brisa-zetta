FROM node:18.19.1

RUN mkdir /home/app

WORKDIR /home/app

# ADD package.json /home/app

ADD . /home/app

RUN npm install

EXPOSE 3030

CMD npm start