# base image - node:alpine
FROM node:alpine

# set the working directory to /app
WORKDIR /app

# install ganache-cli globally
RUN npm install -g ganache-cli

# set the command ganache-cli -h 0.0.0.0 
# for docker ganache-cli host on 0.0.0.0
ENTRYPOINT ["ganache-cli","-g","0","-h","0.0.0.0","--account","0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e,100000000000000000000"]