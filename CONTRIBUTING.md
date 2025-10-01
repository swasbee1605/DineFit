# Contributing to DineFit

First off, thank you for considering contributing to **DineFit**!
Your help makes this project better for everyone.  

## How Can You Contribute?

### 🐛 Reporting Bugs
- Check the [issues](../../issues) to see if the bug has already been reported.  
- Open a new issue with:  
  - A clear description of the bug  
  - Steps to reproduce  
  - Expected vs actual behavior  
  - Screenshots/logs will be helpful  

### 💡 Suggesting Features
- Open an issue and label it as a **feature request**.  
- Clearly explain the problem the feature solves.  
- Suggest a possible implementation (if you have one).

### Project Setup Guide
1. **Fork the repository**
2. **Local Project Setup Guide**

    To run the project locally, you’ll need your own Appwrite and Spoonacular API setup:

    ### Appwrite Setup
    
    1.  **Sign up / Log in** at [Appwrite](https://appwrite.io/) and create a new project.
    2.  **Create a database and collections** as defined in the project (e.g., `profiles` collection, etc.).
    3.  **Copy your project ID and endpoint.**
    4.  **Copy your database and collection IDs.**
    
    ### Spoonacular API Setup
    
    1.  **Sign up** at [Spoonacular](https://spoonacular.com/food-api) and get one or more API keys.
    
    ### Environment Variables (`.env` file)
    
    Create a file named **`.env`** in the project root with the following variables. Replace the bracketed placeholders with your actual keys and IDs:
    
    ```env
    # Appwrite Configuration
    VITE_APPWRITE_PROJECT_ID=[YOUR_PROJECT_ID]
    VITE_APPWRITE_ENDPOINT=[YOUR_APPWRITE_ENDPOINT]
    VITE_APPWRITE_DATABASE_ID=[YOUR_DATABASE_ID]
    VITE_APPWRITE_PROFILE_COLLECTION_ID=[YOUR_PROFILE_COLLECTION_ID]
    
    # Spoonacular API Keys (Use a comma-separated list for multiple keys)
    VITE_SPOONACULAR_API_KEYS=[YOUR_API_KEY_1],[YOUR_API_KEY_2],...
    
3. **Create a feature branch**  
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes**  
   - Follow the project’s coding style.  
   - Write clear, self-explanatory commits.  

5. **Add tests (if applicable)**  

6. **Commit your changes**  
   ```bash
   git commit -m "Add feature: description"
   ```
7. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
8. **Open a Pull Request**
   - Describe what you changed and why.
   - Reference any related issues.
  
### Code Style
- Use clear and consistent naming conventions.
- Keep functions small and focused.
- Write comments where needed.

### ✅ Pull Request Checklist
- I updated relevant documentation (if needed)
- I linked the PR to any relevant issues
