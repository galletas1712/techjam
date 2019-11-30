for ((i = 1; i <= 500; ++i)); do http POST localhost:8000/distance < test.json; echo $i; done;
