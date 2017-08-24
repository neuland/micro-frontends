# Example 3 - Data Fetching

Setup is identical to example 2, but now the recommendations (team green) are loaded asynchronously. The server rendered version will only show a skeleton instead of the content.

Starting nginx and all team containers

    docker-compose up --build

Once everything is build an running you can access the assembled product page via [http://127.0.0.1:3000/](http://127.0.0.1:3000/).

