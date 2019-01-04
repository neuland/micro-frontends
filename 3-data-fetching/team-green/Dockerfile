FROM node:11

# Create app directory
RUN mkdir -p /code
WORKDIR /code

# Install app dependencies
COPY package.json /code/
RUN npm install
COPY webpack.config.js /code/

# Bundle app source
COPY ./src /code/src
COPY ./images /code/images

EXPOSE 3002
CMD [ "./node_modules/.bin/nodemon", "--watch", "./src", "--exec", "npm", "start" ]