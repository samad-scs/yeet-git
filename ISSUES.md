# Auto-Commit (scom) Issues List

1. **Missing Configuration Prompt**
   - **Severity**: High
   - **Description**: The application immediately exits with an error if `GEMINI_API_KEY` is missing. It should minimally prompt the user to input it or provide instructions on how to get one, rather than just crashing/exiting.
   - **Location**: `src/core/config.js`, `bin/scom.js`

2. **Missing System Dependency Check (gh CLI)**
   - **Severity**: Medium
   - **Description**: The `PR` strategy relies on the `gh` CLI tool being installed. If it is not installed, the command will fail with an obscure error. The application should check for `gh` presence before attempting PR operations.
   - **Location**: `src/services/github.js`

3. **Dirty Working Directory Handling**
   - **Severity**: Medium
   - **Description**: When running merge pipelines (e.g., `sc --to-dev --merge`), the application switches branches (`git checkout`). If the working directory has uncommitted changes and the user did not specify `--c`, this might cause conflicts or failure. The app should check for a dirty state and either warn the user, stash changes, or abort.
   - **Location**: `src/commands/strategies.js` (MERGE strategy)

4. **Hardcoded AI Model**
   - **Severity**: Low
   - **Description**: The AI model name `gemini-2.0-flash-exp` is hardcoded in `src/core/config.js`. This should ideally be configurable via `.env` or have a fallback to a stable model if the experimental one is deprecated.
   - **Location**: `src/core/config.js`

5. **Missing Interactive Mode**
   - **Severity**: Low
   - **Description**: Running `sc` without arguments prints a message "Interactive mode not yet implemented". This is a placeholder that should eventually be addressed or improved.
   - **Location**: `bin/scom.js`
