import gradio as gr
import requests
from PIL import Image

# Fonction pour générer une description (simulée ici)
def simulate_image_description(image: Image.Image) -> str:
    # Ici tu peux remplacer par BLIP ou autre plus tard
    return "Ceci est une image montrant un incendie dans un bâtiment résidentiel."

# Fonction pour envoyer la requête à Ollama
def ask_ollama(image: Image.Image):
    description = simulate_image_description(image)
    prompt = f"L'image suivante est décrite comme : {description}. Quelles sont les procédures à suivre après un incendie de ce type ?"
    
    url = "http://localhost:11434/api/generate"
    data = {
        "model": "llama3.2",
        "prompt": prompt,
        "stream": False
    }
    
    response = requests.post(url, json=data)
    
    if response.status_code == 200:
        return response.json()["response"]
    else:
        return f"Erreur : {response.status_code} - {response.text}"

# Interface Gradio
gr.Interface(
    fn=ask_ollama,
    inputs=gr.Image(type="pil"),
    outputs="text",
    title="Analyse post-incendie via image + Ollama",
    description="Déposez une image d'incendie. Le système générera une description puis demandera à Ollama les procédures à suivre."
).launch()