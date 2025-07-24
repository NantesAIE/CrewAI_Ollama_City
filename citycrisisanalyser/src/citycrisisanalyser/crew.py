from crewai import Agent, Crew, Process, Task, LLM
from crewai.project import CrewBase, agent, crew, task
from crewai.agents.agent_builder.base_agent import BaseAgent
from typing import List
from crewai_tools import PDFSearchTool
import ollama
import yaml
import os


pdf_search_tool = PDFSearchTool(
  pdf='knowledge/PLAN_DE_GESTION_DE_CRISE.pdf',
  config=dict(
        llm=dict(
            provider="ollama",
            config=dict(
                model="llama3.2:1b",
                
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


class Citycrisisanalyser():
    def __init__(self):
        # Chemin absolu vers le dossier src/citycrisisanalyser
        base_path = os.path.dirname(os.path.abspath(__file__))
        config_path = os.path.join(base_path, "config")

        # Chargement du fichier agents.yaml
        agents_file = os.path.join(config_path, 'agents.yaml')
        with open(agents_file, 'r', encoding='utf-8') as f:
            self.agents_config = yaml.safe_load(f)

        # Chargement du fichier tasks.yaml
        tasks_file = os.path.join(config_path, 'tasks.yaml')
        with open(tasks_file, 'r', encoding='utf-8') as f:
            self.tasks_config = yaml.safe_load(f)

        print("✅ Fichiers de configuration chargés.")
        print("🔑 Clés disponibles dans tasks_config :", self.tasks_config.keys())

    # méthode utilisant tasks_config
    def research_task(self):
        research_config = self.tasks_config.get('research_task')
        if research_config is None:
            raise KeyError("La clé 'research_task' est absente dans tasks.yaml")
        # continuer le traitement avec research_config
        print("Recherche en cours avec la config:", research_config)






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
            llm=LLM(model="ollama/llama3.2:1b", base_url="http://localhost:11434")
        )

    @agent
    def situation_interpreter(self) -> Agent:
        return Agent(
            config=self.agents_config['situation_interpreter'],
            verbose=True,
            llm=LLM(model="ollama/llama3.2:1b", base_url="http://localhost:11434")
        )

    @agent
    def protocol_mapper(self) -> Agent:
        return Agent(
            config=self.agents_config['protocol_mapper'],
            verbose=True,
            llm=LLM(model="ollama/llama3.2:1b", base_url="http://localhost:11434")
        )
    @agent
    def intervention_planner(self) -> Agent:
        return Agent(
            config=self.agents_config['intervention_planner'],
            verbose=True,
            llm=LLM(model="ollama/llama3.2:1b", base_url="http://localhost:11434")
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
