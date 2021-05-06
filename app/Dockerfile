FROM node:14

WORKDIR /app

COPY /app/package.json .

RUN npm install
RUN npm install -g nodemon

COPY /app .

EXPOSE 3001

CMD [ "npm" , "start" ]