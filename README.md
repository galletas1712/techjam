to build:

```
docker build . -t <username>/techjam-practice
```


to run:

```
docker run -p 8000:8000 -d <username>/techjam-practice
```

to post:

```
http POST localhost:8000/calc expression=kuay
```
