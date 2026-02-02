# Evaluating Agents

This guide covers how to systematically evaluate your ADK agents using `eval` and `eval_set`.

## Running Evaluations

Evaluate an agent against a set of test cases.

```bash
adk eval <path/to/agent_module> <eval_set_path_or_id>
```

-   **`agent_module`**: Path to the `__init__.py` containing the `agent` module (e.g., `my_agent/__init__.py`).
-   **`eval_set_path_or_id`**: Path to a JSON file or an Eval Set ID.

**Running Specific Cases:**
Append `:case1,case2` to the eval set argument.
Example: `my_evals.json:test_greeting,test_fallback`

## Managing Eval Sets

Use `adk eval_set` to create and manage test cases.

-   **Create Eval Set:**
    ```bash
    adk eval_set create
    ```
-   **Add Cases:**
    ```bash
    adk eval_set add_eval_case --eval_set_id <id> ...
    ```

## Configuration

-   `--print_detailed_results`: Show full output in console.
-   `--eval_storage_uri gs://<bucket>`: Store results in GCS.
