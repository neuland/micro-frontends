# Example 2 - Server Side Rendering

Starting nginx and all team containers

    docker-compose up --build

Once everything is build an running you can access the assembled product page via [http://127.0.0.1:3000/](http://127.0.0.1:3000/).

TODO: elaborate

Filtering and recoloring the docker compose log using [colout](https://github.com/nojhan/colout)

    docker-compose up --build | colout "team_green_1" green | colout "team_blue_1" cyan | colout "team_red_1" red | colout "nginx_1" white | grep -v "\.jpg"