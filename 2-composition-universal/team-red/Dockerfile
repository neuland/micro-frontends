FROM node:12

# Create app directory
RUN mkdir -p /code
WORKDIR /code

# Install app dependencies
COPY package.json /code/
COPY package-lock.json /code/
RUN npm install

# Bundle app source
COPY ./src /code/src
COPY ./images /code/images

EXPOSE 3003
CMD [ "npm", "start" ]