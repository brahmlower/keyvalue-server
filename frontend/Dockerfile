# pull official base image
FROM node:13.12.0-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent

# add app
COPY . ./

# This is a pretty gross hack to change the proxy host in the container
# to the known hostname for the backend. In a prod setting this would be a
# static site that would have cors configured correctly and everything so
# we wouldn't need to do anything like this
RUN sed -i 's/localhost:3001/backend:3001/g' package.json

# start app
CMD ["npm", "start"]