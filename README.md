to build:

```
docker build . -t <username>/techjam
```


to run:

```
docker run -p 8000:8000 -d <username>/techjam
```

to post:

```
http POST localhost:8000/calc expression=hello
```
