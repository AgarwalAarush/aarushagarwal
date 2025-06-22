---
title: "The AI Suite"
date: "2025-06-22"
excerpt: "Comprehensive hands-on review of AI development tools including Cursor, Windsurf, Claude Code, ChatGPT, and Gemini with practical recommendations for different use cases."
tags: ["AI", "Tools", "Development", "Productivity", "Review"]
readingTime: 8
published: true
author: "Aarush Agarwal"
---

Effectively selecting and integrating artificial intelligence (AI) tools can significantly streamline workflows. Yet, with new tools coming out every day, and old ones being updated frequently, it can often be hard to choose which one to go with. Hopefully, this article will provide you with the necessary information you need to go out and choose which tool is best for you.

## Programming

We begin with the largest use case of AI today - programming. 

Cursor features an excellent user interface with extensive context management, custom rule integration, and extensive model support - all of which are incredibly important: context management and custom rule integration helps tremendously with focusing the model on your vision for the project, and given the variations within all the published models, being able to choose a specific model for a task is extremely powerful. As we'll discuss later, the key to maximizing your productivity is using a model like Claude Sonnet 4 for charting out your project and coding a wide breadth of your foundational features, and GPT o3 for complex algorithmic design. 

Even more important than model choice, however, is the .globalrules file within Cursor. Copy pasting a modified version of OpenAI's GPT 4.1 prompt found here provided me with a larger performance upgrade than any other feature. Truly, organized prompting is the best way to maximize your return from LLMs.

Windsurf. My current thoughts? It's quite similar to Cursor, and I found no meaningful differences between the two. Yet, given its acquisition by OpenAI last month, further performance and feature enhancements are quasi-guaranteed. A better option than Cursor right now - probably not. In the future, probably.

Nevertheless, both IDEs excel at integrating AI tools directly into the coding process, significantly enhancing developer productivity. A developer cannot go wrong with either-students, however, should choose Cursor given that it is free for them for the next year.

Finally, Claude Code. A linux-using vim-fanatic's dream product, Claude Code noticeably outperforms both Cursor and Windsurf. Excelling in coding tasks, demonstrating superior precision, context, and code-generation capabilities, it is by far the best tool out on the market. 

However, the drawbacks are the following. 1) while it possesses an elegant user interface, it cannot completely replace the advanced integrations and functionalities offered by a dedicated IDE. Thus, it must be accompanied by your favorite text-editor or IDE. 2) It's advanced capabilities come at a higher cost, making it less economical for general-purpose use compared to Cursor or Windsurf. Especially given Cursor's recent change to a rate-limited pro-plan, meaning it comes with quasi-unlimited prompts per month for regular users, justifying the cost of Claude Code is difficult.

My solution? Use Cursor as a daily driver, and Claude Code as my ace in the hole for more complex tasks I expect Cursor will struggle with.

### Recommended Tool

There is no correct answer here, but as I mentioned above - I've chosen a combination of Cursor and Claude Code. There is a strong argument for Windsurf, given the new flow of funding and attention they've just received - for me, Cursor being free outweighs any marginal performance benefit from Windsurf.

## Subscription Models

### ChatGPT

ChatGPT demonstrates versatility, elegantly handling tasks including code generation, technical writing, image generation, and research. OpenAI's recent shopping, maps, and stocks integrations, amongst others, shows their commitment to democratizing its use in your everyday life. Trying to find the best Italian restaurant near your apartment in NYC? ChatGPT is not a bad place to start - Google Maps is still better though, for now.

Integrations with IDEs and Mac applications, such as Cursor or iTerm, make it extraordinarily useful to the programmer as well-and for the Notion-lover, effortlessly query ChatGPT using your open pages as context.

When compared to Gemini and Claude for algorithmic thinking and visual reasoning, it performed marginally better than Claude. I compared each AI Suite's performance by having its most powerful model use a Bayesian Network and calculate a conditional probability through variable elimination. Each model was given three attempts (none got it the first time through) - and while Claude was unable to get the correct answer, GPT o3 and Gemini 2.5-Pro both go the right answer the second time.

### Gemini

Gemini excels in versatility, just like ChatGPT, with both offering an incredibly similar suite of products- but where OpenAI integrates with Android, Google does with Android. 

That said, Gemini also excels with it's unique products like NotebookLM and Firebase Studio, the latter of which offering comprehensive capabilities for coding, debugging, and data exploration - think Cursor, but Gemini API-based. Moreover, with it's concept diagrams charting the chain of ideas and its ability to quickly and efficiently summarize large swaths of text, NotebookLM is a curious student or researcher's dream application. 

Given it's integration into Google's ecosystem, Gemini's strong cost-performance ratio positions it as a pragmatic choice for extensive practical use.

### Claude

While perhaps not as algorithmically powerful as the other two models, albeit barely, Claude shines in its MCP integrations, which allow it to interact with almost anything you can imagine. Your desktop, database, house - your imagination and dedication to writing an MCP is the limit. In my case, its desktop integrations allow me to effortlessly query repositories and generate mermaid.js diagrams to understand their internals. 

Given some universities have deals with Anthropic allowing students to get it for just $1/month, it is a viable contender for a student on a budget. For anyone who needs an AI that can interact with multiple sources of information, Claude's MCP tool-calling is likely perfect.

### Recommended Tool

Selecting an AI assistant primarily depends on personal preference and context. For Android users, Gemini is the clear-cut choice. It seamlessly integrates with the ecosystem and comes with too many advantages. For $20/month, you receive all of Google's AI tools along with 2 terabytes of storage. Moreover, it's free for students in select countries until the summer of 2026. 

For Apple users, there is no clear-cut answer. Depending on your requirements, there is an argument for ChatGPT, Claude, or Gemini. My advice, try each for a month - they're all $20-and see which one you like the most. Whether it's Gemini's versatility, Claude's MCPs, or ChatGPT's integrations that matter most to you, experiment and find out.

## Local and Edge Model Considerations

Of course, for those prioritizing local deployment, Ollama provides effective solutions. In my experience, the Phi-4 model and Mistral-Nemo models were two of the best performing that were reasonable to run. I ran the Phi-4 on a base M1 Mac Book Pro, and Mistral-Nemo on a M3 Mac Book Pro with 32GB of RAM. Experimentation is key here, as each laptop has it's own constraints.

Notably, the introduction of tool-calling capabilities has now enhanced Ollama's utility. For applications that need to be run locally due to offline or privacy concerns, Ollama is truly a perfect solution.

## Key Observations

Over the last couple of years, if there's anything I've learned from using AI, it's that human laziness is still a problem. LLMs still require two things. 1) Prompt Precision: your prompts should clear and specific. Doing so improves AI performance and reliability. 2) Human Oversight. As anyone who has ever coded with Claude Sonnet 4 or 3.7 on Cursor can attest to, if you ask it to generate a simple PRD (Project Requirements Document) and walk away, by the time you've come back it's generated half your code in an entirely incorrect manner.

## Conclusion

The AI tool landscape is rapidly evolving, but the fundamental principles for effective tool selection remain consistent: align capabilities with your specific needs, consider cost-performance trade-offs, and maintain human oversight throughout the process.

For developers, the combination approach proves most effective - using Cursor as your daily driver for its excellent integration and cost-effectiveness, while leveraging Claude Code for complex algorithmic challenges. Students should particularly note Cursor, as it's pro tier is currently free for them.

When it comes to AI assistants, ecosystem integration often outweighs marginal performance differences. Android users benefit most from Gemini's seamless integration, while Apple users should probably experiment with all three major players to find their preference. The $20/month investment for any of the models is worthwhile for the productivity gains. If you're a student, find which plans your university offers, as I guarantee at least one service, whether its one of these three, Perplexity, or Mistral, has a plan for you.

The emergence of local models through Ollama provides privacy-conscious users with viable alternatives, though they require more technical setup and hardware considerations. For most users, cloud-based solutions offer the best balance of performance and convenience.

Remember that regardless of your tool choice, success with AI still depends on two critical factors: precise prompting and active human oversight. These tools are amplifiers of human capability, not replacements for human judgment.

The key takeaway? Start with what's accessible and free, experiment systematically, and don't be afraid to use multiple tools for different purposes. The perfect AI suite is the one that works best for your specific workflow and constraints.

Most importantly, stay curious and keep experimenting - the AI landscape will continue evolving, and the best tool today might not be the best tool tomorrow.