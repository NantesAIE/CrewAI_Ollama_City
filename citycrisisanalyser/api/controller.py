from fastapi import APIRouter, HTTPException
from api.schema import ImageInput, AnalysisOutput, AgentResponse
from citycrisisanalyser.crew import Citycrisisanalyser, run_gpt4o_vision
import base64
import os
import uuid
import traceback

router = APIRouter()


def get_output_by_task_name(tasks_output, task_name):
    for task in tasks_output:
        if task.name == task_name:
            return task.raw
    return "Aucune sortie trouvée"


@router.post("/analyze", response_model=AnalysisOutput)
async def analyze_crisis_image(input_data: ImageInput):
    temp_filename = f"temp_{uuid.uuid4().hex}.jpg"
    temp_path = os.path.join("images", temp_filename)

    try:
        # Sauvegarder l'image temporairement
        image_data = base64.b64decode(input_data.image_base64)
        with open(temp_path, "wb") as f:
            f.write(image_data)

        # Analyse avec Azure GPT-4o Vision
        prompt = "Décris ce que tu vois dans l'image."
        result = run_gpt4o_vision(prompt, temp_path)

        # Lancer l'équipe CrewAI
        crew_instance = Citycrisisanalyser()
        crew = crew_instance.crew()
        crew_output = crew.kickoff(inputs={
            "image_path": temp_path,
            "image_base64": input_data.image_base64,  
            "result": result
        })

        # Construire la réponse
        return AnalysisOutput(
            vision_analysis=[
                AgentResponse(
                    task_name="vision_analyst_task",
                    output=get_output_by_task_name(crew_output.tasks_output, "vision_analyst_task")
                )
            ],
            situation_interpreter=[
                AgentResponse(
                    task_name="situation_interpreter_task",
                    output=get_output_by_task_name(crew_output.tasks_output, "situation_interpreter_task")
                )
            ],
            protocol_mapper=[
                AgentResponse(
                    task_name="protocol_mapper_task",
                    output=get_output_by_task_name(crew_output.tasks_output, "protocol_mapper_task")
                )
            ],
            intervention_planner=[
                AgentResponse(
                    task_name="intervention_planner_task",
                    output=get_output_by_task_name(crew_output.tasks_output, "intervention_planner_task")
                )
            ],
        )

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Erreur interne: {str(e)}")

    finally:
        # Nettoyage même si une erreur survient
        if os.path.exists(temp_path):
            os.remove(temp_path)


@router.get("/analyze")
async def analyze_placeholder():
    return {"message": "Utilisez POST /api/analyze pour envoyer une image à analyser."}
