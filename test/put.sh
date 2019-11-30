http PUT localhost:8000/robot/1/position \
    position:='{"x": 1, "y": 1}'

http POST localhost:8000/nearest \
    ref_position:='{"x": -1, "y": 1}' \
    k:=2
http PUT localhost:8000/robot/2/position \
    position:='{"x": 0, "y": 0}'
http POST localhost:8000/nearest \
    ref_position:='{"x": -1, "y": 1}'
http POST localhost:8000/nearest \
    ref_position:='{"x": -1, "y": 1}' \
    k:=2   
http POST localhost:8000/nearest \
    ref_position:='{"x": 1, "y": 0}' \
    k:=2   

