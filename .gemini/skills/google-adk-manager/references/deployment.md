# Deploying Agents

This guide covers deploying ADK agents to supported Google Cloud environments.

## Cloud Run

Deploy your agent as a scalable containerized service.

```bash
adk deploy cloud_run <path/to/agent_folder> --project <project_id> --region <region>
```

**Options:**
-   `--service_name <name>`: Custom Cloud Run service name.
-   `--with_ui`: Deploy the Web UI alongside the API server.
-   `--no-allow-unauthenticated`: Restrict access (recommended for production).
-   `--min-instances <int>`: Set minimum instances to avoid cold starts.
-   `--env_vars_file <file>`: Load environment variables from a file.

**Prerequisites:**
-   `gcloud` CLI installed and authenticated.
-   Billing enabled on the GCP project.
-   Cloud Run API enabled.

## Agent Engine (Vertex AI)

Deploy to Vertex AI Agent Engine for managed reasoning.

```bash
adk deploy agent_engine <path/to/agent_folder>
```

**Configuration:**
-   **Express Mode (API Key):**
    ```bash
    adk deploy agent_engine --api_key <key> <path/to/agent_folder>
    ```
-   **Standard Mode (IAM):**
    ```bash
    adk deploy agent_engine --project <project> --region <region> --display_name <name> <path/to/agent_folder>
    ```

**Options:**
-   `--agent_engine_id <id>`: Update an existing instance.
-   `--description <text>`: Set description.
-   `--adk_app <file>`: Specify app definition file (default `agent_engine_app.py`).

## Google Kubernetes Engine (GKE)

Deploy to a Kubernetes cluster.

```bash
adk deploy gke <path/to/agent_folder>
```

**Note:** Requires `kubectl` configured with cluster access.

---

## Co-Pilot Specific Configuration

### Handling Secrets (Supabase)
For Co-Pilot agents, you **MUST** securely inject the Supabase credentials.

**Method 1: Using .env file (Simplest for Dev/Staging)**
Create a `.env.production` file with your secrets:
```bash
SUPABASE_URL=https://xyz.supabase.co
SUPABASE_SERVICE_ROLE_KEY=ey...
GOOGLE_API_KEY=AI...
```
Then deploy using:
```bash
adk deploy cloud_run my_agent --env_vars_file .env.production
```

**Method 2: Secret Manager (Production Best Practice)**
1.  Create secrets in Google Secret Manager.
2.  Update your `agent.py` or deployment config to mount these secrets.
3.  (Currently `adk deploy` requires manual Cloud Run revision updates to attach secrets if not supported natively by flags. Check `gcloud run services update` after deployment).