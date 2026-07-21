# Industry-Recognized AI Agent Orchestration Patterns

## Executive Summary

Microsoft Agent Framework currently highlights five named orchestration patterns:

1. Sequential
2. Concurrent
3. Group Chat
4. Handoff
5. Magentic

The fifth term is **Magentic**, not “Magnetic.” It derives from the Magentic-One research architecture and describes an adaptive manager that plans, tracks progress, selects agents, and replans as work evolves.

These five patterns are useful, but they are not a complete vendor-neutral taxonomy. They also mix several different architectural dimensions:

- **Execution topology:** Sequential, Concurrent
- **Control ownership:** Handoff
- **Communication model:** Group Chat
- **Planning and coordination algorithm:** Magentic

Across Anthropic, OpenAI, Google ADK, LangChain/LangGraph, AWS Bedrock, CrewAI, AutoGen, and Microsoft, the most important additional patterns are:

1. **Router / Dispatcher / Triage**
2. **Supervisor / Manager–Worker / Hierarchical**
3. **Evaluator–Optimizer / Maker–Checker**
4. **Plan-and-Execute / Planner–Executor–Replanner**
5. **Conditional Graph / State Machine**

A stronger industry taxonomy should separate:

- Coordination topology
- Reasoning and quality protocols
- Control-flow composition

That avoids treating every combination of agents, loops, routers, and evaluators as a new fundamental pattern.

---

## 1. The Taxonomy Problem

There is no universally accepted flat list of mutually exclusive AI-agent orchestration patterns.

Most modern frameworks combine multiple architectural dimensions:

- Centralized versus decentralized control
- Deterministic versus model-directed routing
- Static versus dynamic task planning
- Shared conversation versus isolated context
- Cooperative versus adversarial interaction
- Fixed versus adaptive execution graphs
- Synchronous versus event-driven coordination
- Direct messaging versus shared-memory coordination

As a result, a system might simultaneously be:

- Supervisor–worker
- Parallel fan-out/fan-in
- Evaluator–optimizer
- Human-in-the-loop
- Conditional graph

Those are complementary properties, not competing names for the whole system.

---

# Core Patterns Missing from the Microsoft Five

## 2. Router / Dispatcher / Triage

A router performs an explicit classification or policy decision and dispatches a request to the appropriate agent, workflow, model, or set of agents.

```text
Request
   |
   v
Router / Classifier
   |-- Billing Agent
   |-- Technical Agent
   `-- General Support Agent
```

### Common Names

- Router
- Dispatcher
- Triage
- Intent Router
- Classifier–Router
- Capability Router
- Conditional Dispatch

### Why It Is Distinct from Handoff

| Router | Handoff |
|---|---|
| Usually makes an initial or per-request dispatch decision | Transfers ownership during an ongoing interaction |
| May be a deterministic rule, classifier, policy, or LLM | Usually initiated by an active agent |
| Often stateless | Often preserves conversational state |
| Does not need to be conversational | Usually occurs between conversational agents |
| May dispatch to one or many destinations | Usually transfers active control to another agent |

A router answers:

> “Which specialist or workflow should handle this input?”

A handoff answers:

> “Which agent should take over the interaction from here?”

### Adoption Evidence

Routing appears as a first-class pattern in:

- Anthropic agent workflow guidance
- LangChain and LangGraph
- Google Agent Development Kit
- AWS Bedrock multi-agent collaboration
- OpenAI triage and manager patterns
- Enterprise support and domain-specialist architectures

### Recommendation

Add **Router / Dispatcher** as a top-level orchestration pattern.

---

## 3. Supervisor / Manager–Worker / Hierarchical

A central supervisor retains control, delegates bounded tasks to specialists, receives their results, and synthesizes the final response.

```text
                   |-- Research Worker
User -> Supervisor |-- Analysis Worker
                   |-- Coding Worker
                   `-- Review Worker
                            |
                            v
                   Supervisor Synthesizes
```

### Common Names

- Supervisor–Worker
- Manager–Worker
- Orchestrator–Workers
- Hierarchical Agents
- Coordinator–Dispatcher
- Lead Agent with Subagents
- Agents as Tools
- Manager Pattern

### Defining Characteristics

The supervisor:

1. Maintains ownership of the user interaction.
2. Selects or invokes specialist agents.
3. Defines bounded tasks for workers.
4. Receives worker outputs.
5. Resolves conflicts or missing information.
6. Produces or approves the final response.

Worker agents may be isolated from the user and from one another.

### Adoption Evidence

The pattern appears across:

- OpenAI’s manager and agents-as-tools guidance
- Anthropic’s orchestrator–worker and lead-agent/subagent systems
- AWS Bedrock supervisor and collaborator agents
- LangChain supervisor and subagent architectures
- CrewAI hierarchical processes
- Google ADK coordinator and agent-tool patterns
- Microsoft multi-agent guidance

### Why It Is Broader Than Magentic

A generic supervisor may perform a simple delegation:

```text
Question is about tax
-> Invoke Tax Agent
-> Summarize result
```

A Magentic-style manager typically performs more sophisticated coordination:

```text
Develop a plan
-> Assign tasks
-> Track progress
-> Inspect results
-> Revise the plan
-> Reassign work
-> Synthesize the answer
```

Therefore:

> Magentic is a specialized adaptive supervisor implementation, not the general industry term for supervisor–worker orchestration.

### Recommendation

Add **Supervisor / Manager–Worker** as a top-level pattern and classify Magentic beneath it as an advanced adaptive-planning specialization.

---

## 4. Evaluator–Optimizer / Maker–Checker

One agent produces an artifact. Another evaluates it against explicit criteria. The producer then revises the artifact until it passes, reaches an iteration limit, or escalates.

```text
Generator -> Draft -> Evaluator
    ^                   |
    |------ Feedback ---|
```

### Common Names

- Evaluator–Optimizer
- Maker–Checker
- Generator–Critic
- Writer–Reviewer
- Generator–Verifier
- Reflection Loop
- Critic Loop
- Adversarial Review
- Review–Revise

### Defining Characteristics

1. **Asymmetric roles:** one produces, another evaluates.
2. **Explicit criteria:** quality, correctness, safety, completeness, tests, policy, or rubric.
3. **Directed feedback:** evaluation returns actionable revision guidance.
4. **Iteration:** the producer revises the output.
5. **Termination:** success criteria, iteration limit, timeout, or human escalation.

### Typical Use Cases

- Code generation and test repair
- Document drafting and review
- Policy or compliance validation
- Structured data extraction verification
- Contract analysis
- Security remediation
- Content quality improvement
- Research synthesis and fact checking

### Why It Deserves First-Class Status

It can be implemented with a sequential flow, loop, graph, or group chat, but its semantic purpose is distinct:

> Improve an artifact through explicit evaluation and revision.

That is different from open-ended discussion, consensus seeking, or simple sequential execution.

### Recommendation

Promote **Evaluator–Optimizer** out of the Group Chat umbrella and treat it as a first-class reasoning and quality-control pattern.

---

## 5. Plan-and-Execute / Planner–Executor–Replanner

A planner creates an explicit task plan. Executors carry out the work. The system may then replan based on intermediate results.

```text
Goal
 |
 v
Planner -> Task Plan
              |
              v
         Executor(s)
              |
              v
   Progress / Observations
              |
              v
          Replanner
```

### Common Names

- Plan-and-Execute
- Planner–Executor
- Planner–Worker
- Plan–Act–Replan
- Dynamic Task Decomposition
- DAG Planning and Execution
- Task-Ledger Orchestration
- Adaptive Planning

### Core Variants

```text
Plan-and-Execute
|-- Static plan, sequential execution
|-- Static plan, parallel execution
|-- DAG-based execution
|-- Plan with periodic replanning
|-- Planner plus specialist workers
`-- Magentic-style adaptive coordination
```

### Why It Is Distinct

A reactive agent decides one action at a time from the current context.

A planner–executor system separates:

- Strategic task decomposition
- Tactical task execution
- Progress evaluation
- Replanning

This distinction becomes important for:

- Long-horizon work
- Multi-step research
- Software engineering tasks
- Incident remediation
- Complex travel or logistics planning
- Work requiring parallel specialists
- Tasks with dependencies and changing state

### Relationship to Magentic

Magentic belongs inside the broader plan–execute–replan family.

Its distinctive characteristics include:

- A central adaptive manager
- Explicit task and progress tracking
- Dynamic agent selection
- Replanning based on intermediate results
- Shared task state or ledger
- Support for open-ended problem solving

### Recommendation

Either:

1. Add **Plan-and-Execute** as a top-level pattern and classify Magentic beneath it, or
2. Rename the broader category **Adaptive Planner / Supervisor**, with Magentic as Microsoft’s named implementation.

---

## 6. Conditional Graph / State Machine / Cyclic Workflow

This is not strictly an agent-interaction pattern. It is an orchestration substrate capable of composing agents, tools, deterministic code, loops, branches, checkpoints, and human decisions.

```text
              |-- Specialist A --|
Input -> Route                   |-> Validate -> Finish
              `-- Specialist B --'
                         ^              |
                         `---- Retry ---'
```

### Common Names

- Conditional Graph
- Agent Graph
- State Machine
- Cyclic Workflow
- Directed Graph Workflow
- Durable Workflow
- State-Oriented Orchestration

### Capabilities

- Conditional branches
- Joins
- Loops
- Retry and fallback
- Checkpoints
- Human approval interrupts
- Long-running state
- Suspend and resume
- Dynamic insertion of work
- Nested subgraphs
- Durable execution
- Error recovery

### Industry Adoption

This is the dominant control-flow model in:

- LangGraph
- Google ADK workflows
- Microsoft Agent Framework Workflows
- OpenAI workflow and agent graph guidance
- Durable Functions-style agent systems
- Event-driven enterprise orchestration

### Important Distinction

Sequential and concurrent are graph shapes.

A conditional graph or state machine is the more general composition model that can express:

- Sequential execution
- Concurrent execution
- Routing
- Handoff
- Supervisor–worker
- Evaluation loops
- Human approval
- Error recovery

### Recommendation

Include **Conditional Graph / State Machine** in an orchestration catalog, but label it a **composition model**, not a peer collaboration pattern.

---

# Patterns That Are Usually Variants of the Core Set

## 7. Fan-Out/Fan-In, Map-Reduce, Ensemble, and Voting

These are specializations of concurrent execution.

```text
                 |-- Worker A --|
Input -> Fan-Out |-- Worker B --| -> Aggregator -> Result
                 `-- Worker C --'
```

### Aggregation Methods

- Concatenation
- Summarization
- Ranking
- Majority vote
- Weighted vote
- Judge selection
- Quorum
- Reduce operation
- Consensus model
- Confidence-weighted fusion

### Recommended Classification

Rename **Concurrent** to:

> **Parallel Fan-Out/Fan-In**

This captures the aggregation stage, which is often more important than the parallel execution itself.

### Mixture of Agents

Mixture-of-Agents typically performs:

1. Parallel expert generation
2. One or more aggregation layers
3. Optional refinement

It is best classified as a layered fan-out/fan-in ensemble rather than an entirely new coordination primitive.

---

## 8. Debate, Consensus, and Adversarial Collaboration

These fit naturally beneath Group Chat.

### Variants

- Round-robin debate
- Judge-mediated debate
- Devil’s advocate
- Consensus seeking
- Negotiation
- Proposer–Opponent
- Multi-perspective deliberation
- Red-team / blue-team review
- Argument and rebuttal

### Recommended Classification

Treat debate and consensus as **Group Chat protocols**, not separate top-level orchestration patterns.

A caution is warranted: some research suggests that the benefits attributed to debate may come primarily from independent sampling, ensembling, and voting rather than the dialogue itself.

---

## 9. Swarm / Decentralized Peer Network

“Swarm” is widely used but inconsistently defined.

It usually describes some combination of:

- Peer agents handing control to one another
- No permanent central supervisor
- Dynamic specialist discovery
- Shared interaction state
- Agent spawning
- Distributed task ownership
- Local decision-making

### Recommended Classification

In most current enterprise and LLM-agent implementations:

> Swarm is a decentralized handoff topology, possibly with dynamic membership.

It is usually not necessary to treat it as a separate primitive unless the system adds meaningful distributed-systems behavior such as dynamic membership, asynchronous discovery, or emergent task allocation.

---

# Advanced or Emerging Patterns

## 10. Blackboard / Shared Workspace

Agents coordinate indirectly through a durable shared store rather than primarily through direct messages.

```text
Agent A --|
Agent B --|-> Shared Workspace / Blackboard
Agent C --|
```

### Shared Workspace Examples

- Task board
- Artifact repository
- Database
- Filesystem
- Event log
- Shared memory
- Knowledge graph
- Case record
- Incident timeline

### Advantages

- Supports asynchronous execution
- Avoids propagating full conversation transcripts
- Enables durable task state
- Supports large artifacts
- Decouples agents
- Makes progress externally observable
- Improves recoverability

### Classification

Blackboard is a valid and historically established multi-agent pattern, but current LLM-agent SDKs often expose it indirectly as shared state, memory, artifacts, or task ledgers rather than naming it explicitly.

---

## 11. Event-Driven / Message Bus

Agents subscribe to events, topics, or queues and react independently.

### Characteristics

- Asynchronous communication
- Loose coupling
- Publish/subscribe
- Queue-based work distribution
- Event replay
- Independent scaling
- Durable messaging
- Failure isolation

### Classification

Event-driven orchestration is primarily a **runtime and communication architecture**, not a reasoning protocol.

It can host nearly any of the other patterns:

- Router
- Supervisor–worker
- Blackboard
- Handoff
- Evaluator–optimizer
- Human approval

---

## 12. Contract-Net / Auction / Market-Based Allocation

Agents bid for work based on:

- Capability
- Cost
- Confidence
- Availability
- Latency
- Expected utility
- Resource ownership

### Classification

This is well established in traditional multi-agent systems, robotics, operations research, and distributed optimization.

It is not yet a mainstream named primitive in general-purpose enterprise LLM-agent frameworks, so it belongs in an advanced appendix rather than the core catalog.

---

## 13. Competitive and Coopetitive Systems

Agents may have:

- Opposing objectives
- Partially aligned incentives
- Negotiation requirements
- Selection pressure
- Challenge and defense roles
- Resource competition

These patterns are well recognized in multi-agent-system research but are less common in ordinary enterprise automation.

---

# Recommended Vendor-Neutral Taxonomy

## Layer 1: Coordination Topology

| Pattern | Core Control Model |
|---|---|
| **Sequential Pipeline** | Predetermined agent order |
| **Parallel Fan-Out/Fan-In** | Independent work followed by aggregation |
| **Router / Dispatcher** | Classify and select a specialist or workflow |
| **Supervisor / Manager–Worker** | Central agent invokes and coordinates specialists |
| **Handoff / Decentralized** | Active ownership transfers among peers |
| **Group Chat / Shared Conversation** | Agents contribute to a common discussion |
| **Blackboard / Shared Workspace** | Agents coordinate through durable shared state |

---

## Layer 2: Reasoning and Quality Protocol

| Pattern | Core Behavior |
|---|---|
| **Evaluator–Optimizer** | Generate, evaluate, and revise |
| **Debate / Consensus** | Exchange, challenge, and reconcile proposals |
| **Ensemble / Voting** | Produce independent answers and aggregate |
| **Plan-and-Execute** | Separate strategic planning from execution |
| **Adaptive Replanning** | Update the plan using execution feedback |
| **Magentic** | Adaptive manager with planning, progress tracking, and agent selection |

---

## Layer 3: Control-Flow Composition

| Pattern | Core Capability |
|---|---|
| **Conditional Graph** | Branch based on state or outputs |
| **Loop** | Repeat until a criterion or limit |
| **State Machine** | Explicit states and permitted transitions |
| **Human-in-the-Loop** | Approval, correction, escalation, or intervention |
| **Event-Driven** | React to messages or external events |
| **Durable Workflow** | Checkpoint, suspend, resume, and recover |

---

# Example of a Composite Architecture

A contract-review system might combine:

```text
Supervisor / Manager–Worker
+ Parallel Fan-Out/Fan-In
+ Evaluator–Optimizer
+ Human Approval
+ Conditional Graph
```

For example:

1. A router classifies the contract type.
2. A supervisor selects legal, compliance, financial, and privacy specialists.
3. Specialists analyze relevant sections concurrently.
4. An aggregator combines their findings.
5. An evaluator checks coverage against a review rubric.
6. Missing or weak sections are sent back for revision.
7. High-risk findings require human approval.
8. The graph checkpoints state throughout the process.

This is more precise than inventing a single name for the whole system.

---

# Recommended Core Industry List

The strongest vendor-neutral list is:

1. **Sequential Pipeline**
2. **Parallel Fan-Out/Fan-In**
3. **Router / Dispatcher**
4. **Supervisor / Manager–Worker**
5. **Handoff / Decentralized**
6. **Group Chat / Shared Conversation**
7. **Evaluator–Optimizer**
8. **Plan-and-Execute / Adaptive Replanning**
9. **Conditional Graph / State Machine**
10. **Blackboard / Shared Workspace**

Magentic should be represented as:

> A specialized adaptive planner and supervisor pattern, rather than a universal peer-level orchestration primitive.

---

# Key Conclusions

The largest gaps in the original Microsoft-oriented list are:

1. **Routing is not necessarily handoff.**
2. **Generic supervisor–worker orchestration is broader than Magentic.**
3. **Evaluator–optimizer is important enough to stand outside Group Chat.**
4. **Plan-and-execute is the broader family to which Magentic belongs.**
5. **Conditional graphs and state machines are composition substrates, not merely another agent interaction style.**
6. **Concurrent is more accurately described as parallel fan-out/fan-in.**
7. **Debate, voting, swarm, and Mixture-of-Agents are usually subpatterns or combinations of more fundamental primitives.**

---

# Source References

## Microsoft

- [Microsoft Agent Framework: Magentic Orchestration](https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/magentic)
- [Microsoft Azure Architecture Center: AI Agent Design Patterns](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/ai-agent-design-patterns)
- [Microsoft Agent Framework Workflows](https://learn.microsoft.com/en-us/agent-framework/journey/workflows)
- [AutoGen Documentation](https://microsoft.github.io/autogen/stable/)
- [AutoGen Mixture of Agents](https://microsoft.github.io/autogen/stable/user-guide/core-user-guide/design-patterns/mixture-of-agents.html)

## Anthropic

- [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents)

## OpenAI

- [A Practical Guide to Building AI Agents](https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/)

## LangChain and LangGraph

- [LangGraph Overview](https://docs.langchain.com/oss/python/langgraph/overview)
- [Plan-and-Execute Agents](https://www.langchain.com/blog/plan-and-execute-agents)

## Research

- [Multi-Agent Collaboration Mechanisms: A Survey of LLMs](https://arxiv.org/html/2501.06322v1)
- [Multi-Agent Debate Research](https://arxiv.org/html/2508.17536v1)

---

## Suggested Terminology Mapping

| Microsoft or Common Term | Vendor-Neutral Category |
|---|---|
| Sequential | Sequential Pipeline |
| Concurrent | Parallel Fan-Out/Fan-In |
| Group Chat | Shared Conversation |
| Handoff | Decentralized Control Transfer |
| Magentic | Adaptive Planner / Supervisor |
| Routing | Router / Dispatcher |
| Agents as Tools | Supervisor / Manager–Worker |
| Maker–Checker | Evaluator–Optimizer |
| Reflection | Evaluator–Optimizer |
| Debate | Group Chat Protocol |
| Voting | Ensemble Aggregation |
| Swarm | Decentralized Handoff |
| Mixture of Agents | Layered Ensemble / Fan-Out/Fan-In |
| Planner–Executor | Plan-and-Execute |
| LangGraph Workflow | Conditional Graph / State Machine |
