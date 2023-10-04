FROM node:18
WORKDIR /ShoppingApp/backend
COPY . /ShoppingApp/backend
RUN npm install

# RUN echo "#!/bin/sh" > entrypoint.sh
# RUN echo "npm start &" >> entrypoint.sh
# RUN echo "npm test" >> entrypoint.sh
# RUN echo "npm start" >> entrypoint.sh
# RUN chmod +x entrypoint.sh

# CMD ["./entrypoint.sh"]

CMD npm start
EXPOSE 3000