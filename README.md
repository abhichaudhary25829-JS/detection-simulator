# Deadlock Detection & Banker's Algorithm Simulator

An interactive, browser-based educational tool that demonstrates two core
Operating Systems concepts for handling resource deadlocks: the
**Banker's Algorithm** (deadlock avoidance) and the **Deadlock Detection
Algorithm** (deadlock discovery). Built with React, Vite, and React Flow.

---

## 1. Project Description

Modern operating systems must manage finite resources (CPU, memory, I/O
devices, etc.) shared among many competing processes. Poor resource
management can lead to **deadlock** — a state where a set of processes are
permanently blocked, each waiting for a resource held by another process
in the same set.

This simulator lets a user enter Allocation, Maximum, and Available data
for a hypothetical system and see, step by step, exactly how the operating
system decides whether the system is safe (Banker's Algorithm) or whether
a deadlock currently exists (Deadlock Detection Algorithm). Every result is
computed live from the numbers the user enters — nothing is hard-coded.

## 2. Problem Statement

Given a fixed number of processes and resource types, along with each
process's current resource allocation and maximum future demand, determine:

1. Whether the system can guarantee that every process will eventually
   finish (a **safe state**), and if so, in what order (**safe sequence**).
2. Given a snapshot of allocation and outstanding requests, whether any
   subset of processes is currently stuck in a **deadlock**.

## 3. Objectives

- Provide a hands-on, visual way to learn the Banker's Algorithm and
  Deadlock Detection Algorithm.
- Dynamically calculate the Need matrix, safe sequences, and deadlock sets
  from arbitrary user input.
- Visualize resource allocation and requests as a graph.
- Offer a step-by-step execution mode so learners can see each decision
  the algorithm makes, not just the final answer.

## 4. Features

- **Dashboard** — live system stats (process/resource counts, last
  algorithm run, current status) and quick navigation.
- **Banker's Algorithm page** — editable Allocation/Maximum matrices and
  Available vector, auto-computed Need matrix, full safety-check trace,
  and SAFE/UNSAFE verdict with safe sequence.
- **Deadlock Detection page** — editable Allocation/Request matrices and
  Available vector, full detection trace, and a clear list of completed
  vs. deadlocked processes.
- **Step-by-Step Simulation** — Previous/Next/Play/Pause/Reset controls
  to walk through each process check one at a time, with the Work vector,
  Need vector, and explanation shown at every step.
- **Resource Allocation Graph** — a live React Flow diagram showing
  Allocation edges (resource → process) and Request edges
  (process → resource), rebuilt automatically whenever the matrices change.
- **Sample cases** — one safe case, one unsafe case, and one general case
  for the Banker's Algorithm; one no-deadlock and one deadlock case for
  Deadlock Detection — loadable with one click.
- **Input validation** — rejects empty, negative, non-numeric values, and
  allocation that exceeds maximum, with clear inline error messages.
- **Dark, presentation-ready UI** with color-coded status badges
  (safe = green, unsafe/deadlock = red, waiting = yellow, completed = blue),
  each paired with text/icons so meaning never depends on color alone.

## 5. Operating Systems Concepts Used

- Resource allocation and the Allocation / Maximum / Need / Available model
- Safe state vs. unsafe state
- Safe sequence construction
- Deadlock necessary conditions (mutual exclusion, hold-and-wait, no
  preemption, circular wait) as reflected in the Resource Allocation Graph
- Deadlock avoidance (Banker's Algorithm) vs. deadlock detection
  (Detection Algorithm) as two distinct strategies

## 6. Technologies Used

| Technology | Purpose |
|---|---|
| React 19 | UI components and state |
| Vite | Build tool / dev server |
| React Router (HashRouter) | Client-side page navigation |
| React Flow (`reactflow`) | Resource Allocation Graph visualization |
| lucide-react | Icons |
| Plain CSS | Dark theme styling (no UI framework dependency) |

No database and no authentication are used — all computation happens
locally in the browser.

## 7. Algorithm Explanation

### Banker's Algorithm (Safety Algorithm)

1. `Need[i][j] = Maximum[i][j] - Allocation[i][j]`
2. `Work = Available`, `Finish[i] = false` for all processes.
3. Find a process `i` such that `Finish[i] == false` and `Need[i] <= Work`.
4. If found: `Work = Work + Allocation[i]`, `Finish[i] = true`, append `i`
   to the safe sequence, and repeat from step 3.
5. If no such process exists but some `Finish[i] == false` remain, the
   system is **UNSAFE**.
6. If all `Finish[i] == true`, the system is **SAFE** and the recorded
   order is a valid safe sequence.

### 8. Banker's Algorithm — Pseudocode

```
Need[i][j] = Maximum[i][j] - Allocation[i][j]
Work = Available.copy()
Finish = [false] * n

repeat:
    found = false
    for i in 0..n-1:
        if not Finish[i] and Need[i] <= Work:
            Work = Work + Allocation[i]
            Finish[i] = true
            SafeSequence.append(i)
            found = true
until not found or all Finish[i] == true

if all Finish[i] == true:
    return SAFE, SafeSequence
else:
    return UNSAFE
```

### 9. Deadlock Detection — Explanation

Deadlock Detection is used **after** resources have already been granted,
to check the current state of the system (rather than a hypothetical future
request, as the Banker's Algorithm does).

```
Work = Available.copy()
Finish[i] = false for all i with pending Allocation/Request

repeat:
    found = false
    for i in 0..n-1:
        if not Finish[i] and Request[i] <= Work:
            Work = Work + Allocation[i]
            Finish[i] = true
            found = true
until not found or all Finish[i] == true

Deadlocked processes = { i : Finish[i] == false }
if Deadlocked processes is empty: NO_DEADLOCK
else: DEADLOCK_DETECTED
```

## 10. Project Structure

```
deadlock-simulator/
├── src/
│   ├── algorithms/
│   │   ├── bankersAlgorithm.js      # Safety algorithm logic
│   │   ├── deadlockDetection.js     # Detection algorithm logic
│   │   └── validation.js            # Shared input validation
│   ├── components/
│   │   ├── Card.jsx
│   │   ├── Header.jsx
│   │   ├── MatrixInput.jsx
│   │   ├── ProcessStatusTable.jsx
│   │   ├── SampleCaseSelector.jsx
│   │   ├── Sidebar.jsx
│   │   ├── StatusBadge.jsx
│   │   ├── StepControls.jsx
│   │   └── VectorInput.jsx
│   ├── data/
│   │   └── sampleCases.js           # Sample safe/unsafe/general test cases
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── BankersAlgorithm.jsx
│   │   ├── DeadlockDetection.jsx
│   │   ├── StepSimulation.jsx
│   │   └── ResourceGraph.jsx
│   ├── utils/
│   │   └── AppContext.jsx           # Shared app state (React Context)
│   ├── App.jsx / App.css
│   └── main.jsx / index.css
├── index.html
├── package.json
└── README.md
```

## 11. Installation Instructions

Requires Node.js 18+ and npm.

```bash
cd deadlock-simulator
npm install
```

## 12. How to Run

```bash
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`) in a
browser.

To produce a production build:

```bash
npm run build
npm run preview
```

## 13. How to Use

1. Open the **Dashboard** to see an overview and navigate to any module.
2. On the **Banker's Algorithm** page, either set the number of processes
   and resources and click **Generate Matrices**, or click
   **Load Sample Case** to instantly populate a ready-made example.
3. Edit the Allocation, Maximum, and Available values as needed, then click
   **Run Banker's Algorithm** to see the Need matrix, the full process
   check trace, and the final SAFE/UNSAFE verdict.
4. Visit **Step-by-Step Simulation** to replay the same run one decision
   at a time using Previous / Next / Play / Reset.
5. Visit **Resource Allocation Graph** to see the same data rendered as a
   graph of processes, resources, and allocation/request edges.
6. On the **Deadlock Detection** page, enter or load a case with an
   Allocation and Request matrix to check for an existing deadlock.

## 14. Test Cases

- **Safe Case** (5 processes, 3 resources) — the classic Silberschatz
  textbook example; expected result: SAFE, safe sequence exists.
- **Unsafe Case** (4 processes, 3 resources) — no process can ever obtain
  its remaining need; expected result: UNSAFE.
- **General/Custom Case** (3 processes, 2 resources) — a small case for
  quick demonstration.
- **No Deadlock Case** (Deadlock Detection) — all processes can eventually
  complete.
- **Deadlock Present Case** (Deadlock Detection) — a circular wait leaves
  processes permanently blocked.

## 15. Screenshots

_Add screenshots of the Dashboard, Banker's Algorithm results, Step
Simulation, and Resource Allocation Graph here before submission._

## 16. Future Enhancements

- Support for multiple instances of the same resource with richer graph
  cycle-detection visualization.
- Export results (safe sequence, deadlock report) as a PDF.
- Animated, cycle-highlighting Resource Allocation Graph for deadlocked
  states.
- Multi-request simulation (queue of incremental resource requests) rather
  than a single static snapshot.

## 17. Author

Operating Systems Course Project — built as a teaching and demonstration
tool for Banker's Algorithm and Deadlock Detection.
