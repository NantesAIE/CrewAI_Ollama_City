import base64
import os
import yaml
from dotenv import load_dotenv

from crewai import Agent, Crew, Process, Task, LLM
from crewai.project import CrewBase, agent, crew, task
from crewai.agents.agent_builder.base_agent import BaseAgent
from crewai_tools import PDFSearchTool



load_dotenv()

AZURE_API_KEY = os.getenv("AZURE_API_KEY")
AZURE_API_BASE = os.getenv("AZURE_API_BASE") 
AZURE_API_VERSION = os.getenv("AZURE_API_VERSION", "2025-01-01-preview")
AZURE_DEPLOYMENT_NAME = os.getenv("AZURE_DEPLOYMENT_NAME", "gpt-4o")


llm = LLM(
    model="azure/gpt-4o",
    api_version=AZURE_API_VERSION
)




def run_gpt4o_vision(prompt, image_path):
    from openai import AzureOpenAI

    client = AzureOpenAI(
        api_key=AZURE_API_KEY,
        api_version=AZURE_API_VERSION,
        azure_endpoint=AZURE_API_BASE
    )

    with open(image_path, "rb") as image_file:
        image_data = image_file.read()
    image_base64 = base64.b64encode(image_data).decode("utf-8")

    response = client.chat.completions.create(
        model=AZURE_DEPLOYMENT_NAME,
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{image_base64}"
                        },
                    },
                ],
            }
        ],
        temperature=0.2
    )

    return response.choices[0].message.content



base_path = os.path.dirname(os.path.abspath(__file__))
pdf_path = os.path.join(base_path, '..', '..', 'knowledge', 'PLAN_DE_GESTION_DE_CRISE.pdf')
print(f"Using PDF knowledge source at: {pdf_path}")

pdf_search_tool = PDFSearchTool(
    pdf=pdf_path,
    config=dict( 
        llm=dict(
            config=dict(
                model=f"azure/gpt-4o", 
                api_key=AZURE_API_KEY,
                base_url=AZURE_API_BASE, 
            ), 
        ),
        embedder=dict( 
            config=dict(
                model="azure/text-embedding-ada-002", 
                api_key =AZURE_API_KEY, 
                api_base=AZURE_API_BASE 
            ),
        ),
    )
)



# If you want to run a snippet of code before or after the crew starts,
# you can use the @before_kickoff and @after_kickoff decorators
# https://docs.crewai.com/concepts/crews#example-crew-class-with-decorators

@CrewBase
class Citycrisisanalyser:
    def __init__(self):
        base_path = os.path.dirname(os.path.abspath(__file__))
        config_path = os.path.join(base_path, "config")

        with open(os.path.join(config_path, 'agents.yaml'), 'r', encoding='utf-8') as f:
            self.agents_config = yaml.safe_load(f)

        with open(os.path.join(config_path, 'tasks.yaml'), 'r', encoding='utf-8') as f:
            self.tasks_config = yaml.safe_load(f)

        print("✅ Fichiers de configuration chargés.")
        print("🔑 Clés disponibles dans tasks_config :", self.tasks_config.keys())

  # Learn more about YAML configuration files here:
    # Agents: https://docs.crewai.com/concepts/agents#yaml-configuration-recommended
    # Tasks: https://docs.crewai.com/concepts/tasks#yaml-configuration-recommended
    
    # If you would like to add tools to your agents, you can learn more about it here:
    # https://docs.crewai.com/concepts/agents#agent-tools
    @agent
    def vision_analyst(self) -> Agent:
        return Agent(
            config=self.agents_config['vision_analyst'],
            verbose=True,
            llm=llm


        )       

    @agent
    def situation_interpreter(self) -> Agent:
        return Agent(
            config=self.agents_config['situation_interpreter'],
            verbose=True,
            llm=llm

        )

    @agent
    def protocol_mapper(self) -> Agent:
        return Agent(
            config=self.agents_config['protocol_mapper'],
            verbose=True,
            llm=llm, 
            tools=[pdf_search_tool]
        )

    @agent
    def intervention_planner(self) -> Agent:
        return Agent(
            config=self.agents_config['intervention_planner'],
            verbose=True,
            llm=llm

        )

    # To learn more about structured task outputs,
    # task dependencies, and task callbacks, check out the documentation:
    # https://docs.crewai.com/concepts/tasks#overview-of-a-task
    @task
    def vision_analyst_task(self, image_base64: str = None) -> Task:
        # passer le chemin de l'image
        inputs = {'image_base64': image_base64} if image_base64 else {}
        return Task(
            config=self.tasks_config['vision_analyst_task'], 
            inputs=inputs
        )

    @task
    def situation_interpreter_task(self) -> Task:
        return Task(
            config=self.tasks_config['situation_interpreter_task'],
        )

    @task
    def protocol_mapper_task(self) -> Task:
        return Task(
            config=self.tasks_config['protocol_mapper_task'],
        )

    @task
    def intervention_planner_task(self) -> Task:
        return Task(
            config=self.tasks_config['intervention_planner_task'],
        )


    @crew
    def crew(self) -> Crew:
        """Creates the Citycrisisanalyser crew"""
        # To learn how to add knowledge sources to your crew, check out the documentation:
        # https://docs.crewai.com/concepts/knowledge#what-is-knowledge

        return Crew(
            agents=self.agents, # Automatically created by the @agent decorator
            tasks=self.tasks, # Automatically created by the @task decorator
            process=Process.sequential,
            verbose=True,
            # process=Process.hierarchical, # In case you wanna use that instead https://docs.crewai.com/how-to/Hierarchical/
        )