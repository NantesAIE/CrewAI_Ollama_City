from flask import Flask, render_template, request, jsonify
# from crewai_module.crew import Citycrisisanalyser
import os

try:
    from citycrisisanalyser.crew import Citycrisisanalyser
except Exception:
    class Citycrisisanalyser:
        def run_full_analysis(self):
            # Simule une réponse
            return {"message": "Mode démo : analyse simulée, Ollama non disponible."}

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if request.method == 'POST':
        files = request.files.getlist('files')
        for file in files:
            if file:
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))
        return jsonify({'message': 'Files uploaded successfully'})

@app.route('/run_analysis', methods=['POST'])
def run_analysis():
    analyser = Citycrisisanalyser()
    result = analyser.run_full_analysis()
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
