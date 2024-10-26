FROM amazonlinux:latest

# Install Node.js 18.x and required tools
RUN yum install -y tar gzip zip \
    && curl -sL https://rpm.nodesource.com/setup_18.x | bash - \
    && yum install -y nodejs

RUN mkdir /dist

COPY create-lambda-zip.sh ./create-lambda-zip.sh
RUN chmod +x ./create-lambda-zip.sh

CMD ["./create-lambda-zip.sh"]