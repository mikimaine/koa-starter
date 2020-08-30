FROM node:12.16.1
LABEL maintainer "ETM Software<info@etmsoftwareplc.com>"
# Set the working directory
WORKDIR /app
# Copy project specification and dependencies lock files
COPY package.json yarn.lock ./

RUN apt-get update -y

# RUN apt-get install python-software-properties -y

RUN apt-get install software-properties-common -y

RUN apt-get install imagemagick -y

RUN add-apt-repository ppa:rwky/graphicsmagick -y

RUN apt-get install graphicsmagick -y

RUN yarn

# Copy app sources
COPY . .
# Run linters and tests
RUN yarn lint

# Expose application port
EXPOSE 7100
# In production environment
RUN yarn build
ENV NODE_ENV production
# Run
CMD ["yarn", "start"]
