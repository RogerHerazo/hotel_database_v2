import requests
import os 
import random 
import string
import json
from pprint import pprint
import time

url = 'http://localhost:4000/hotels'
file = open('Hotels.json')
data = json.load(file)
file.close()
cont = 0

for i in data:
    cont = cont + 1
    hotel = []
    dataj = None
    for (k,v) in i.items():
        hotel.append(v)
        #response = requests.post(url, allow_redirects = False, 

    info = {'name': hotel[0],
            'address': hotel[1],
            'state': hotel[2],
            'phone': hotel[3],
            'fax': hotel[4],
            'email_id': hotel[5],
            'website': hotel[6],
            'type': hotel[7],
            'rooms': hotel[8]}

    response = requests.post(url, json = info)  

    print(response, "Hotel n°: ", cont, info.get("name",None))
    '''time.sleep(0.1)'''
print('Ended')