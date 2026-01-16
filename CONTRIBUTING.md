# Contributing to Nivarya Setu

We handle code contributions through GitHub Pull Requests. Here is how you can get started.

## Getting Started

### 1. Fork the Repository
Click on the **Fork** button at the top right of the repository page.

### 2. Clone Your Fork
Clone your forked repository to your local machine:
```bash
git clone https://github.com/medhinibr/Binance-Trade-Bot.git
cd Binance-Trade-Bot
```

### 3. Create a Branch
Create a new branch for your feature or bug fix:
```bash
git checkout -b feature/your-feature-name
```

### 4. Configuration
1.  Create a `.env` file in the `src/` directory.
2.  Add your environment keys (e.g., `FIREBASE_API_KEY=your_key_here`).

### 5. Run the Project
This project uses a Flask backend and React frontend.

**Terminal:**
1.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
2.  Start the server:
    ```bash
    python src/app.py
    ```
3.  Open in browser:
    http://localhost:5000/

### 6. Make Your Changes
Implement your feature or fix. Ensure your code follows the project's style guide:
-   **Frontend:** Professional Institutional Dark Theme (Vanilla CSS).
-   **Backend:** Python (PEP 8 standards).

### 7. Commit and Push
```bash
git add .
git commit -m "index file" # Follow the naming convention: "filename file"
git push origin feature/your-feature-name
```

### 8. Create a Pull Request
1.  Navigate to the original repository.
2.  Click on **New Pull Request**.
3.  Select your feature branch and submit.

## Code Style
-   **HTML/CSS:** Maintain professional design consistency.
-   **JavaScript:** Use React functional components and ES6+ syntax.
-   **Python:** Follow PEP 8 guidelines.
-   **Commits:** Use short, descriptive commit messages followed by "file" as per project guidelines.
