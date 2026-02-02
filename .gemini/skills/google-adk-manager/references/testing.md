# Testing Agents

This guide details how to test your ADK agents locally using the CLI and Web UI.

## Interactive CLI

Use the `run` command to interact with your agent in the terminal.

```bash
adk run <path/to/agent_folder>
```

**Options:**
-   `--save_session`: Save the session to a JSON file on exit.
-   `--resume <file>`: Resume a session from a saved JSON file.
-   `--replay <file>`: Replay a session from an initial state file (no user interaction).
-   `--session_id <id>`: Specify a session ID for saving.
-   `--memory_service_uri`: Connect to external memory (e.g., `memory://` for in-memory).

## Web UI

Use the `web` command to start a local web server with a chat interface.

```bash
adk web [path/to/agents_dir] --port <port>
```

**Key Notes:**
-   Run this command from the **parent directory** containing your agent folder(s).
-   Default port is `8000`.
-   Access at `http://localhost:8000`.

**Options:**
-   `--port <int>`: Set the server port.
-   `--reload`: Enable auto-reload (good for development).
-   `--logo-text <text>`: Custom logo text.
-   `--logo-image-url <url>`: Custom logo image.
-   `--trace_to_cloud`: Enable Cloud Trace.

## Debugging

-   Use `--verbose` or `-v` for debug logging.
-   Check local logs if `trace_to_cloud` is not enabled.
