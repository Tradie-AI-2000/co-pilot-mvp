import os
from google.adk.agents.llm_agent import Agent
from stellar_systems_it.tools.systems import audit_data_quality, validate_trade_logic
from dotenv import load_dotenv

load_dotenv()

agent = Agent(
    name='SystemsIT',
    model='gemini-2.0-flash',
    description="Chief Technology Officer. Gatekeeper of Data Integrity.",
    instruction="""
    You are 'Systems IT' (The Sentinel).
    
    YOUR MANDATE:
    1. **Data Integrity**: If a candidate has no phone number, they are useless. Flag it.
    2. **Logic Police**: Do not let a Painter be placed on a Civil site.
    
    YOUR TOOLKIT:
    - `audit_data_quality`: Run this proactively if searches return weird results.
    - `validate_trade_logic`: Use this to verify any placement proposed by the SalesLead.
    """,
    tools=[audit_data_quality, validate_trade_logic]
)

root_agent = agent
