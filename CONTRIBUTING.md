# Contributing Guidelines

We process contributions through GitHub Pull Requests. Please review the following instructions to ensure a clean development and integration workflow.

---

## Development Workflow

### 1. Fork and Clone
Fork the repository on GitHub, then clone your fork locally:
```bash
git clone https://github.com/medhinibr/Nivarya_Setu.git
cd Nivarya_Setu
```

### 2. Configure Local Environment
Set up a Python virtual environment to isolate project dependencies:
```bash
python -m venv venv
```
Activate the environment:
*   **Windows (PowerShell)**:
    ```powershell
    .\venv\Scripts\Activate.ps1
    ```
*   **macOS/Linux**:
    ```bash
    source venv/bin/activate
    ```

Install the required backend packages:
```bash
pip install -r requirements.txt
```

### 3. Environment Secrets
Create a `.env` file in the root workspace directory with the following variables:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
ENFORCE_MARKET_HOURS=False
```

### 4. Running the Project
Start the local Flask development server:
```bash
python src/app.py
```
Open your browser and navigate to: `http://127.0.0.1:5000/`

---

## Coding Standards

### Code Style
*   **Frontend**: Follow clean React functional component design. Maintain the institutional dark-mode aesthetics using custom CSS variables (avoid embedding ad-hoc inline styles).
*   **Backend**: Adhere to clean Python structures. Follow standard concurrency rules when updating stateful resources.

### Commit Guidelines
*   All commits must utilize exactly a **two-word technical commit message** (e.g., `integrate auth`, `fix import`, `update readme`).
*   Ensure that all local tests pass and dependencies compile successfully before submitting a commit.

---

## Pull Request Process

1.  Create a feature branch from the main branch:
    ```bash
    git checkout -b feature/your-feature-name
    ```
2.  Stage and commit your changes:
    ```bash
    git add .
    git commit -m "technical message"
    ```
3.  Push to your fork:
    ```bash
    git push origin feature/your-feature-name
    ```
4.  Submit a Pull Request from your branch back to the upstream `main` branch.
