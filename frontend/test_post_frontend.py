import urllib.request, json, time

time.sleep(2)
url = 'http://127.0.0.1:3001/api/chat'
req = urllib.request.Request(url, data=json.dumps({"message": "Hi, any advice for headache?"}).encode('utf-8'), headers={'Content-Type':'application/json'})
try:
    with urllib.request.urlopen(req, timeout=20) as resp:
        print(resp.read().decode('utf-8'))
except Exception as e:
    print('ERROR', str(e))
