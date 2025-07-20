# Backend API Scripting Environment

This directory is set up as a Node.js environment to write and test scripts that interact with external APIs, such as TwelveLabs.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (which includes npm)

## Setup

1.  **Install Dependencies:**
    Navigate to the `backend` directory and install the required packages.

    ```bash
    cd backend
    npm install
    ```

2.  **Set Up Environment Variables:**
    This project uses a `.env` file to manage sensitive information like API keys.

    - Create a new file named `.env` in the `backend` directory.
    - Open the `.env` file and add the necessary environment variables. For the TwelveLabs script, you will need:
      ```
      TWELVE_LABS_API_KEY=your_twelvelabs_api_key_here
      ```
    - Replace `your_twelvelabs_api_key_here` with your actual API key.

    > **Note:** The `.env` file is included in `.gitignore` to prevent it from being committed to version control.

## Running a Script

The `package.json` file contains scripts to execute your test files. To run the sample TwelveLabs script, use the following command:

```bash
npm run dev
```

This command will execute the `src/twelveLabs.ts` file using `ts-node`.

## Writing a New API Script

To create a new script for a different API endpoint or service, follow these steps:

1.  **Create a New File:**
    Add a new TypeScript file inside the `src` directory (e.g., `src/myNewScript.ts`).

2.  **Write Your Script:**
    Use the existing `src/twelveLabs.ts` as a template. You can use `node-fetch` for making HTTP requests and `dotenv` to access your environment variables.

3.  **Add a New Run Command:**
    Open `package.json` and add a new entry to the `scripts` section to make it easy to run your new script.

    For example, if your new file is `src/myNewScript.ts`, you could add:

    ```json
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
      "dev": "ts-node src/twelveLabs.ts",
      "my-script": "ts-node src/myNewScript.ts"
    },
    ```

4.  **Run Your New Script:**
    You can now execute your new script from the `backend` directory with:
    ```bash
    npm run my-script
    ```
