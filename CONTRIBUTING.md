# Contributing to AI Prompts & Skills

First of all, thank you for considering contributing to this repository! It's people like you who make this a great resource for the AI community.

## Ways to Contribute

### 1. Adding Prompts
Share your best-performing prompts for any AI platform.
- **Images**: Midjourney, DALL-E 3, Stable Diffusion, etc.
- **Videos**: Veo, Runway, Pika, Sora, etc.
- **Audio**: Music, Voice, Sound Effects.
- **Text**: Creative writing, Technical, Marketing, etc.

Place your prompts in the appropriate sub-directory within `prompts/`. Each prompt should include:
- The exact prompt text.
- The model or tool it was tested with.
- The expected result or a sample output if possible.

### 2. Creating Skills
Help build reusable agent capabilities following the [Agent Skills Specification](https://agentskills.io/specification).
- Create a new directory in `skills/` (e.g., `skills/my-awesome-skill/`).
- Add a `SKILL.md` file with required YAML frontmatter:
  ```yaml
  ---
  name: my-awesome-skill
  description: A concise description of the skill and when to use it.
  license: MIT
  metadata:
    author: your-username
    version: "1.0"
  ---
  ```
- Use lowercase alphanumeric characters and hyphens for the skill name.
- Match the `name` field in the frontmatter with your directory name.

### 3. Improving Documentation
Enhance explanations, provide better examples, or fix typos in the README or existing skills.

## Pull Request Process

1. Fork the repository and create your branch from `main`.
2. If you've added a new skill, ensure it follows the directory structure:
   ```
   skills/
   └── your-skill/
       └── SKILL.md
   ```
3. Update the `README.md` to include your new prompt category or skill if necessary.
4. Ensure your changes align with the repository's goal of providing premium, high-quality AI foundations.
5. Submit a pull request with a clear description of your changes.

## Code of Conduct

Please be respectful and collaborative. We aim to keep this a welcoming space for all creators and developers.

## Questions?

If you have any questions, feel free to open an issue or join the discussion.

---
*Building the future of AI, one contribution at a time.*
