from fastapi import APIRouter, HTTPException, FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
# from api.schema import ImageInput, AnalysisOutput, AgentResponse
# from citycrisisanalyser.crew import Citycrisisanalyser, encode_image_base64, run_llava_ollama
import base64
import os
import uuid
import traceback 

def get_output_by_task_name(tasks_output, task_name):
    for task in tasks_output:
        if task.name == task_name:
            return task.raw
    return "Aucune sortie trouvée"

app = FastAPI()
router = APIRouter()

# @router.post("/analyze", response_model=AnalysisOutput)
# async def analyze_crisis_image(input_data: ImageInput):
#     try:
#         # Convertir base64 en image temporaire
#         image_data = base64.b64decode(input_data.image_base64)
#         temp_filename = f"temp_{uuid.uuid4().hex}.jpg"
#         temp_path = os.path.join("images", temp_filename)

#         with open(temp_path, "wb") as f:
#             f.write(image_data)

#         #  Encoder pour LLaVA
#         image_base64_encoded = encode_image_base64(temp_path)
#         prompt = "Décris ce que tu vois dans l'image."
#         result = run_llava_ollama(prompt, image_base64_encoded)

#         #  Lancer le crew
#         crew_instance = Citycrisisanalyser()
#         crew = crew_instance.crew()
#         crew_output = crew.kickoff(inputs={
#             "image_path": temp_path,
#             "image_base64": image_base64_encoded,
#             "result": result
#         })

        
#         os.remove(temp_path)

#         # Retourner les résultats des agents
#         return AnalysisOutput(
#             vision_analysis=[
#                 AgentResponse(
#                     task_name="vision_analyst_task",
#                     output=get_output_by_task_name(crew_output.tasks_output,"vision_analyst_task")
#                 )
#             ],
#             situation_interpreter=[
#                 AgentResponse(
#                     task_name="situation_interpreter_task",
#                     output=get_output_by_task_name(crew_output.tasks_output, "situation_interpreter_task")
#                 )
#             ],
#             protocol_mapper=[
#                 AgentResponse(
#                     task_name="protocol_mapper_task",
#                     output=get_output_by_task_name(crew_output.tasks_output,"protocol_mapper_task")
#                 )
#             ],
#             intervention_planner=[
#                 AgentResponse(
#                     task_name="intervention_planner_task",
#                     output=get_output_by_task_name(crew_output.tasks_output,"intervention_planner_task")
#                 )
#             ],
#         )

#     except Exception as e:
#         traceback.print_exc()  
#         raise HTTPException(status_code=500, detail=f"Erreur interne: {str(e)}")


@router.get("/analyze")
async def analyze_placeholder():
    return {"message": "Utilisez POST /api/analyze pour envoyer une image à analyser."}


@router.get("/")
async def serve_index():
    index_path = os.path.join(os.path.dirname(__file__), "front", "build", "index.html")
    index_path = os.path.abspath(index_path)
    if os.path.exists(index_path):
        return FileResponse(index_path)
    raise HTTPException(status_code=404, detail="Frontend non trouvé")

@router.get("/{full_path:path}", include_in_schema=False)
async def serve_react_app(full_path: str):
    path = os.path.join(frontend_dir, full_path)
    if os.path.exists(path) and os.path.isfile(path):
        return FileResponse(path)
    raise HTTPException(status_code=404, detail="Fichier non trouvé")

frontend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "front", "build"))
app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")