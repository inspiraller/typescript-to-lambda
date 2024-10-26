FROM amazonlinux:latest

# Install Node.js 18.x and required tools
RUN yum install -y tar gzip zip \
    && curl -sL https://rpm.nodesource.com/setup_18.x | bash - \
    && yum install -y nodejs

WORKDIR /app

# COPY create-lambda-zip.sh ./create-lambda-zip.sh
# RUN chmod +x ./create-lambda-zip.sh

ENTRYPOINT ["/bin/sh", "-c"]
# CMD ["./create-lambda-zip.sh"]
# CMD ["./create-lambda-zip.sh"]

# Sleep indefinitely
CMD ["trap 'echo Received SIGTERM; exit' SIGTERM; while true; do sleep 1; done"]
