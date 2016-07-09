from flask import Flask, render_template
import requests, json

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/radar', methods=['GET'])
def radar():
    resp = requests.get('http://192.168.1.17/admin/api.php')
    if resp.status_code != 200:
        print "goddamn"
    print resp.json()
    return 'OK'


@app.route('/hello/<name>')
def hello(name):
    return render_template('page.html', name=name)


if __name__ == '__main__':
    app.run('0.0.0.0')


