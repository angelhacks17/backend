from googleapiclient.discovery import build
import pandas as pd
from urllib.request import urlopen
from bs4 import BeautifulSoup
from termcolor import colored
import requests
import urllib.request
from io import StringIO
from lxml import html
import numpy as np
import re

my_api_key = "AIzaSyD6xN70JSDmf6O2EU_00XIM3JBR5pH3GFk" 
my_cse_id = "013234493367067861201:oejooxesafw"

def google_search(search_term, api_key, cse_id, **kwargs):
    service = build("customsearch", "v1", developerKey=api_key)
    res = service.cse().list(q=search_term, cx=cse_id, **kwargs).execute()
    # print(res.get("items"))
    return res['items']

x = google_search("noodleosophy", my_api_key, my_cse_id, num=1)
url = x[0]["link"]

html = urlopen(url).read()
soup = BeautifulSoup(html, 'html.parser')
texts = soup.findAll(text=True)

def visible(element):
    if element.parent.name in ['style', 'script', '[document]', 'head', 'title']:
        return False
    elif re.match('<!--.*-->', str(element)):
        return False
    return True

visible_texts = filter(visible, texts)
print(visible_texts)