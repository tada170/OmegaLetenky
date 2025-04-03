from flask import render_template

def index_route(app):
    @app.route('/')
    def home():
        return render_template('index.html')
