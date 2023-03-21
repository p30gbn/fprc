FROM node:16-alpine
WORKDIR /usr/src/app
COPY package.json ./
COPY yarn.lock ./
RUN yarn
COPY . .
EXPOSE 3000
RUN yarn install
CMD [ "yarn", "start" ]
