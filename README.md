# RosterIQ
RosterIQ – Memory-Driven Provider Roster Intelligence Agent
Overview

RosterIQ is an AI-powered provider roster intelligence agent designed to analyze healthcare provider data and deliver context-aware, intelligent responses.

Traditional systems treat every query independently. RosterIQ improves on this by introducing a memory-driven architecture that allows the agent to remember previous interactions, understand context, and improve its responses over time.

The system uses two CSV datasets and three memory layers to simulate intelligent decision-making and adaptive learning.

Features

Intelligent provider search and filtering

Memory-driven query processing

Context-aware follow-up responses

Integration with structured CSV datasets

Modular and scalable architecture

Natural language interaction with the agent

System Architecture

The system consists of four major layers:

1. User Interaction Layer

Handles communication between the user and the AI agent.

Examples:

Command Line Interface

Chat Interface

API-based interaction

2. Agent & Reasoning Layer

This is the core intelligence of the system.

Responsibilities:

Understand user intent

Process natural language queries

Decide when to retrieve data

Generate structured responses

Main components include:

Query Processor

Reasoning Engine

Response Generator

3. Memory Architecture

RosterIQ uses three different memory systems to make the agent smarter over time.

Short-Term Memory

Stores the current session's conversation context.

Example:
If the user asks about a provider and then asks a follow-up question, the system remembers the previously referenced provider.

Contextual Memory

Maintains relationships between queries to understand follow-up questions.

Example:
User Query 1:
“Find cardiologists in Boston.”

User Query 2:
“Show the nearest one.”

The system understands that “nearest one” refers to the cardiologists found in Boston.

Long-Term Memory

Stores historical interaction patterns and user preferences.

Example:
If a user frequently searches for a specific specialty or location, the system prioritizes similar providers in future queries.

Data Sources

The system uses two CSV datasets:

1. Provider Dataset

Contains provider information such as:

Provider Name

Specialty

Location

Contact Information

2. Network Dataset

Contains network-related data such as:

Provider Network Status

Insurance Plan Information

These datasets allow the system to retrieve structured provider information efficiently.

Project Structure
rosteriq-agent/
│
├── data/
│   ├── providers.csv
│   └── network_data.csv
│
├── agent/
│   ├── query_processor.py
│   └── response_generator.py
│
├── memory/
│   ├── short_term_memory.py
│   ├── contextual_memory.py
│   └── long_term_memory.py
│
├── main.py
├── requirements.txt
└── README.md
Installation & Setup
1. Clone the Repository
git clone (https://github.com/34Ananya/RosterIQ.git)
cd rosteriq-agent
2. Create a Virtual Environment
python -m venv venv

Activate environment:

Mac/Linux

source venv/bin/activate

Windows

venv\Scripts\activate
3. Install Dependencies
pip install -r requirements.txt
4. Configure Environment Variables

Create a .env file in the project root.

OPENAI_API_KEY=your_api_key_here
5. Run the Application
python main.py

The AI agent will start and you can begin interacting with it using natural language queries.

Example Queries

You can test the agent using queries such as:

“Show details for Dr. Sarah Johnson.”

“Find cardiologists in New York.”

“Is Dr. Sarah Johnson in-network?”

“Show providers near the previous result.”

“Recommend similar providers.”

Agent Reasoning Workflow

The system follows this decision-making loop:

User Query
↓
Intent Detection
↓
Memory Check
↓
Data Retrieval (CSV datasets)
↓
Reasoning & Analysis
↓
Response Generation
↓
Memory Update

This continuous loop allows the system to learn from interactions and improve responses over time.

Key Design Decisions
Memory-First Approach

Instead of stateless query processing, the system prioritizes memory integration to support intelligent conversations.

Modular Architecture

Each component is separated into modules, making the system easier to maintain and extend.

Lightweight Data Storage

CSV datasets were chosen for simplicity and portability while demonstrating data-driven intelligence.

Future Improvements

Potential enhancements include:

Integration with real healthcare APIs

Vector databases for semantic memory storage

Advanced recommendation models

Web-based user interface

Scalable cloud deployment

Conclusion

RosterIQ demonstrates how memory-driven AI agents can significantly improve data exploration and decision-making.

By combining structured healthcare datasets with layered memory systems, the agent becomes context-aware, adaptive, and increasingly intelligent over time.
