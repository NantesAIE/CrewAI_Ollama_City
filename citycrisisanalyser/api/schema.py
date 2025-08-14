from pydantic import BaseModel
from typing import List

class AgentResponse(BaseModel):
    task_name: str
    output: str

class ImageInput(BaseModel):
    image_base64: str

class AnalysisOutput(BaseModel):
    vision_analysis: List[AgentResponse]
    situation_interpreter: List[AgentResponse]
    protocol_mapper: List[AgentResponse]
    intervention_planner: List[AgentResponse]
