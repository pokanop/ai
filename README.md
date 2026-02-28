<div align="center">

<img src="assets/logo.svg" alt="AI Prompts Logo" width="200" height="200">

# AI Prompts & Skills

**The Ultimate Foundation for AI-Powered Creativity**

*A curated collection of expertly crafted prompts and skills for every AI use case*

<img src="assets/hero-banner.svg" alt="Hero Banner" width="100%">

[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![AI Prompts](https://img.shields.io/badge/AI-Prompts-blue.svg)](prompts/)
[![Skills](https://img.shields.io/badge/Agent-Skills-green.svg)](skills/)

</div>

---

## Why This Repository?

In the rapidly evolving world of AI, **the right prompt can unlock extraordinary results**. This repository serves as your definitive resource for:

- **High-quality prompts** tested across multiple AI platforms
- **Agent Skills** following the [skills.sh](https://skills.sh) specification
- **Best practices** distilled from real-world usage
- **Foundation patterns** applicable to any AI use case

Whether you're generating stunning visuals, crafting compelling videos, synthesizing audio, or building intelligent agents — this is your toolkit.

---

## What's Inside

<table>
<tr>
<td width="50%" valign="top">

### Image Generation

<img src="assets/features-icons.svg" alt="Images" width="80">

Prompts optimized for:
- **Nano Banana** - Quick, playful image generation
- **DALL-E 3** - Photorealistic & artistic outputs
- **Midjourney** - Stylized creative imagery
- **Stable Diffusion** - Fine-tuned control

[`prompts/images/`](prompts/images/)

</td>
<td width="50%" valign="top">

### Video Creation

<img src="assets/icon-video.svg" alt="Videos" width="80">

Master prompts for:
- **Veo** - Google's video AI
- **Runway Gen-3** - Cinematic sequences
- **Pika Labs** - Dynamic motion
- **Sora** - Long-form narratives

[`prompts/videos/`](prompts/videos/)

</td>
</tr>
<tr>
<td width="50%" valign="top">

### Audio & Voice

<img src="assets/icon-audio.svg" alt="Audio" width="80">

Prompts for:
- **Music generation** - Original compositions
- **Voice synthesis** - Natural speech patterns
- **Sound effects** - Immersive audio design
- **Podcast content** - Engaging scripts

[`prompts/audio/`](prompts/audio/)

</td>
<td width="50%" valign="top">

### Text & Content

<img src="assets/icon-code.svg" alt="Code" width="80">

Expert prompts for:
- **Creative writing** - Stories, poetry, scripts
- **Technical documentation** - Clear, concise guides
- **Marketing copy** - Conversion-focused content
- **Research synthesis** - Academic excellence

[`prompts/text/`](prompts/text/)

</td>
</tr>
</table>

---

## Agentic Skills

<div align="center">
<img src="assets/icon-agents.svg" alt="Agents" width="100">
</div>

Skills in this repository follow the **[Agent Skills Specification](https://skills.sh/docs)** — an open format for giving AI agents new capabilities and expertise.

### What are Agent Skills?

Agent Skills are folders containing instructions, scripts, and resources that agents can discover and use to perform tasks more accurately and efficiently. Each skill is a self-contained directory with a `SKILL.md` file.

### Skill Structure

```
skill-name/
├── SKILL.md           # Required: Main skill instructions
├── scripts/           # Optional: Executable code
├── references/        # Optional: Additional documentation
└── assets/            # Optional: Static resources
```

### SKILL.md Format

```yaml
---
slug: skill-name
name: Skill Name
version: 1.0.0
description: What this skill does and when to use it.
---

# Skill Instructions

Detailed instructions for the agent...
```

### Benefits

| For Skill Authors | For Compatible Agents | For Teams |
|-------------------|----------------------|-----------|
| Build once, deploy everywhere | Get new capabilities out of the box | Capture organizational knowledge |
| Portable across agent products | Support user-defined extensions | Version-controlled packages |
| Open standard specification | On-demand context loading | Consistent workflows |

### Adding Skills

To add a new skill:

1. Create a directory in `skills/` with your skill name (lowercase, hyphens only)
2. Add a `SKILL.md` file with YAML frontmatter and instructions
3. Optionally include `scripts/`, `references/`, or `assets/` directories

**Example skill directory:**
```
skills/
├── code-review/           # Automated code review skill
│   └── SKILL.md
├── api-design/            # REST API design patterns
│   ├── SKILL.md
│   └── references/
│       └── openapi-patterns.md
└── your-skill/            # Add your skills here
    └── SKILL.md
```

See the [Agent Skills Specification](https://skills.sh/docs) for complete details.

---

## Repository Structure

```
ai/
├── assets/                 # SVGs, images, and visual resources
│   ├── logo.svg
│   ├── hero-banner.svg
│   ├── features-icons.svg
│   ├── icon-video.svg
│   ├── icon-audio.svg
│   ├── icon-agents.svg
│   └── icon-code.svg
├── prompts/
│   ├── images/            # Image generation prompts
│   ├── videos/            # Video creation prompts
│   ├── audio/             # Audio generation prompts
│   └── text/              # Text & content prompts
├── skills/                # Agent Skills (skills.sh format)
│   └── [skill-name]/      # Each skill in its own directory
│       └── SKILL.md
└── README.md
```

---

## Quick Start

### Using Prompts

```bash
# Clone the repository
git clone https://github.com/your-org/ai.git

# Navigate to your use case
cd ai/prompts/images

# Use the prompt in your AI tool
```

### Using Skills

Skills are automatically discovered by [compatible agents](https://skills.sh). Simply place your skills in the `skills/` directory:

```
skills/
└── my-custom-skill/
    └── SKILL.md
```

Supported by: OpenCode, Cursor, Claude Code, GitHub Copilot, OpenHands, and more.

---

## The Possibilities

This repository is designed to be the **foundation for all AI use cases**:

### For Creators
- Generate consistent brand imagery
- Create video content at scale
- Produce original music and soundtracks
- Write engaging content effortlessly

### For Developers
- Build intelligent agents with specialized skills
- Automate repetitive coding tasks
- Create AI-powered workflows
- Integrate prompts into applications

### For Businesses
- Standardize AI interactions across teams
- Maintain brand voice consistency
- Scale content production
- Reduce AI iteration time

### For Researchers
- Study prompt engineering patterns
- Benchmark AI model performance
- Contribute to collective knowledge
- Share reproducible experiments

---

## Prompt Engineering Best Practices

### Structure of a Great Prompt

```
[CONTEXT] - Who/what is involved
[TASK] - What needs to be done
[CONSTRAINTS] - Limitations and requirements
[STYLE] - Tone, format, aesthetic
[EXAMPLES] - Reference outputs (optional)
```

### Tips by Category

| Category | Key Tips |
|----------|----------|
| **Images** | Be specific about style, lighting, composition |
| **Videos** | Describe motion, transitions, timing |
| **Audio** | Specify mood, tempo, instruments |
| **Text** | Define audience, tone, length |
| **Agents** | Set clear goals, constraints, success criteria |

---

## Contributing

We welcome contributions! Here's how to help:

1. **Add prompts** - Share your best-performing prompts
2. **Create skills** - Build reusable agent capabilities following the [specification](https://skills.sh/docs)
3. **Improve docs** - Enhance explanations and examples
4. **Report issues** - Found something that doesn't work? Let us know

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## Roadmap

- [ ] Interactive prompt playground
- [ ] Prompt effectiveness ratings
- [ ] Multi-language support
- [ ] AI model compatibility matrix
- [ ] Community prompt sharing
- [ ] Video tutorials

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

## Connect & Contribute

Made with care for the AI community

**Star this repo if you find it useful!**

[Report Bug](https://github.com/your-org/ai/issues) · [Request Feature](https://github.com/your-org/ai/issues) · [Join Discussion](https://github.com/your-org/ai/discussions)

<img src="assets/logo.svg" alt="AI Prompts" width="60" height="60">

*Building the future of AI, one prompt at a time*

</div>
