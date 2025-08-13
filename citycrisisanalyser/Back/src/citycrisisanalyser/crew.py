from crewai import Agent, Crew, Process, Task, LLM
from crewai.project import CrewBase, agent, crew, task
from crewai.agents.agent_builder.base_agent import BaseAgent
from typing import List
from crewai_tools import PDFSearchTool
import ollama
import yaml
import os

base_path = os.path.dirname(os.path.abspath(__file__))
pdf_path = os.path.join(base_path, '..', '..', 'knowledge', 'PLAN_DE_GESTION_DE_CRISE.pdf')
pdf_search_tool = PDFSearchTool(
pdf=pdf_path,
config=dict(
        llm=dict(
            provider="ollama",
            config=dict(
                model="mistral:7b",
            ),
        ),
        embedder=dict(
            provider="ollama",
            config=dict(
                model="nomic-embed-text",
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
            llm=LLM(model="ollama/llava:7b", base_url="http://localhost:11434", temperature=0.2),
        )

    @agent
    def situation_interpreter(self) -> Agent:
        return Agent(
            config=self.agents_config['situation_interpreter'],
            verbose=True,
            llm=LLM(model="ollama/llama3.2:3b", base_url="http://localhost:11434"),
        )

    @agent
    def protocol_mapper(self) -> Agent:
        return Agent(
            config=self.agents_config['protocol_mapper'],
            verbose=True,
            llm=LLM(model="ollama/mistral:7b", base_url="http://localhost:11434"),
            tools=[pdf_search_tool]
        )

    @agent
    def intervention_planner(self) -> Agent:
        return Agent(
            config=self.agents_config['intervention_planner'],
            verbose=True,
            llm=LLM(model="ollama/llama3.2:3b", base_url="http://localhost:11434"),
        )

    # To learn more about structured task outputs,
    # task dependencies, and task callbacks, check out the documentation:
    # https://docs.crewai.com/concepts/tasks#overview-of-a-task
    @task
    def vision_analyst_task(self, image_path: str = None) -> Task:
        # passer le chemin de l'image
        inputs = {'image_path': image_path} if image_path else {}
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

    # Méthode asynchrone pour exécuter la chaîne complète avec passage des résultats
    async def run_full_analysis(self):
        # 1. Vision analyst avec chemin image fixe
        vision_task = self.vision_analyst_task()
        vision_task.inputs = {'image_path': 'images/ma_crise.jpg'}
        vision_result = await vision_task.run()
        description_image = vision_result.output.get('description', '')  # adapte selon sortie

        # 2. Situation interpreter avec description de l'image en entrée
        situation_task = self.situation_interpreter_task()
        situation_task.inputs = {'image_analysis': description_image}
        situation_result = await situation_task.run()
        situation_summary = situation_result.output.get('summary', '')

        # 3. Protocol mapper avec résumé de situation
        protocol_task = self.protocol_mapper_task()
        protocol_task.inputs = {'query': situation_summary}
        protocol_result = await protocol_task.run()
        protocol_interventions = protocol_result.output.get('interventions', [])

        # 4. Intervention planner avec interventions trouvées
        intervention_task = self.intervention_planner_task()
        intervention_task.inputs = {'interventions': protocol_interventions}
        intervention_result = await intervention_task.run()
        intervention_plan = intervention_result.output.get('plan', [])

        # Résultat final
        return {
            'vision_analysis': description_image,
            'situation_summary': situation_summary,
            'protocol_interventions': protocol_interventions,
            'intervention_plan': intervention_plan,
        }

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
