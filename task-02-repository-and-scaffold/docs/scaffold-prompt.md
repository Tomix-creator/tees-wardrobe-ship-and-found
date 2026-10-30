# Scaffolding Prompt Documentation

This document records the prompt engineering process for the initial scaffolding of **Tee’s Wardrobe** (Task Two). Per the assessment specification, it records the original human author's draft, the final revised prompt sent to the AI coding agent, and an explanation of the refinements made.

---

## 1. Original User Draft

*The original prompt draft, exactly as written by the user in the planning conversation:*

```text
thats Okay, so we want to make a scaffold, which is a basic frame for the app. I want you to read the project's background and documents, and read the design system first. Then once you've done that, you will now go ahead and explain what you understand. But you have to wait for my approval before building. Use this document as a source of truth. Everything in the document should be used as a reference point for what this project is and what it should look like visually. If the documents disagree, do not guess, just ask me. Use the design tokens, the colors, the color, the text styles, and other design choices, and don't try to style values directly onto the screen. Build only the basic project setup and a small home screen for now. Do not build the whole project yet. Then I need you to go ahead and list all the files you've created, every assumption you make. An assumption is something you think is true but is not confirmed. Check your own work against this instruction and tell me the results.
```

---

## 2. Revised Prompt Sent to the Agent

*The tightened prompt dispatched to Antigravity to initiate Task Two:*

```text
We want to make a scaffold: the basic frame for the Tee’s Wardrobe app.

First, read the project’s background documents and the design system.
Explain what you understand and give me your proposed plan. Wait for my
approval before creating or changing project files.

Use the project documents and design system as the source of truth for
what the project is and what it should look like. If the documents
disagree, ask me instead of guessing.

After I approve the plan, use the design tokens for colours, text styles
and other design choices. Do not use hardcoded styling values.

Build only the basic project setup and a small home screen for now. Do
not build the whole product yet.

List every file you create and every assumption you make. Then check your
work against these instructions and tell me the results.
```

---

## 3. Explanation of Changes and Rationale

### What Changed:
1. **Structural Segmentation**: The continuous conversational block was split into distinct paragraphs that follow a strict chronological sequence: research -> planning & explanation -> approval gate -> implementation constraints -> scope limit -> reporting & self-audit.
2. **Technical Phrasing**: The informal expression *"don't try to style values directly onto the screen"* was converted into the standard software engineering directive: *"Do not use hardcoded styling values."*
3. **Sequential Gating**: The conditional timing was made explicit: *"First, read... Explain what you understand and give me your proposed plan. Wait for my approval before creating or changing project files."* and *"After I approve the plan, use the design tokens..."*
4. **Pruning Conversational Filler**: Informal remarks (*"thats Okay, so we want to make..."*, duplicate *"the colors, the color"*, and dictionary-style explanations of what an assumption is) were eliminated.

### Why It Changed:
- **Preventing Premature Implementation**: AI agents frequently begin generating files immediately upon reading an objective. Explicit gating ensures the agent produces an architectural plan for human review and stops before altering workspace state.
- **Enforcing Token Consumption**: "Hardcoded styling values" is an unmistakable instruction to consume CSS custom properties and design token utility classes, preventing the insertion of raw hex values or arbitrary pixel margins.
- **Scope Containment**: Reinforcing *"Build only the basic project setup and a small home screen for now. Do not build the whole product yet"* ensures the agent does not invent unapproved database models, complex forms, or mock API routes during the foundational scaffolding phase.
