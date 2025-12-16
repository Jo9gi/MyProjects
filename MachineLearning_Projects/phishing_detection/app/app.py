from flask import Flask, request, render_template
from inference.predict import predict_url

app = Flask(__name__, template_folder="../templates")


@app.route("/", methods=["GET", "POST"])
def home():
    result = None

    if request.method == "POST":
        url = request.form.get("url")
        if url:
            result = predict_url(url)

    return render_template("index.html", result=result)

if __name__ == "__main__":
    app.run(debug=True)
