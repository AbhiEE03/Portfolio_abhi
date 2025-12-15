from flask import Flask, render_template
app = Flask(__name__)


@app.route('/')
def hello_world():  # put application's code here
    return render_template('index.html')


@app.route('/blog')
def blog():
    return "Trying different routes"


@app.route('/<username>')
def about(username=None):
    return render_template('index.html', name=username)


@app.route('/blog/2020/dogs')
def blog2():
    return "Another route"


if __name__ == '__main__':
    app.run(debug=True)
