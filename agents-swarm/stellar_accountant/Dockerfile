FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Run the web service on container startup.
# We will use the ADK's standard entry point or a simple Flask/Functions Framework wrapper.
# For now, I'll assume we are building a simple HTTP server to listen for requests.
# The `agent.py` will likely need to expose a `run` function.
# I will use functions-framework to serve the `agent_handler` function.

CMD exec functions-framework --target=agent_entry --signature-type=http
