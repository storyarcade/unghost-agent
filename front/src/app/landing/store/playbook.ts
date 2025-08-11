// Copyright (c) 2025 Peter Liu
// SPDX-License-Identifier: MIT

export const playbook = {
  steps: [
    {
      description:
        "The Coordinator greets you and understands your cold outreach requirements, including target prospect details and outreach objectives.",
      activeNodes: ["Start", "Coordinator"],
      activeEdges: ["Start->Coordinator"],
      tooltipPosition: "right",
    },
    {
      description:
        "The Coordinator hands over your outreach request to the Planner for strategic research planning.",
      activeNodes: ["Coordinator", "Planner"],
      activeEdges: ["Coordinator->Planner"],
      tooltipPosition: "left",
    },
    {
      description: "The Planner creates a comprehensive research strategy and awaits your feedback for approval.",
      activeNodes: ["Planner", "HumanFeedback"],
      activeEdges: ["Planner->HumanFeedback"],
      tooltipPosition: "left",
    },
    {
      description: "Your feedback is incorporated to refine the outreach research plan.",
      activeNodes: ["HumanFeedback", "Planner"],
      activeEdges: ["HumanFeedback->Planner"],
      tooltipPosition: "left",
    },
    {
      description:
        "The Research Team coordinates prospect intelligence gathering using multiple specialized agents.",
      activeNodes: ["Planner", "HumanFeedback", "ResearchTeam"],
      activeEdges: [
        "Planner->HumanFeedback",
        "HumanFeedback->ResearchTeam",
        "ResearchTeam->HumanFeedback",
      ],
      tooltipPosition: "left",
    },
    {
      description:
        "The Researcher conducts deep prospect intelligence using LinkedIn analysis, company research, and social media insights.",
      activeNodes: ["ResearchTeam", "Researcher"],
      activeEdges: ["ResearchTeam->Researcher", "Researcher->ResearchTeam"],
      tooltipPosition: "left",
    },
    {
      description:
        "The Strategizer analyzes prospect data to formulate personalized outreach strategies and optimal messaging approaches.",
      tooltipPosition: "right",
      activeNodes: ["ResearchTeam", "Strategizer"],
      activeEdges: ["ResearchTeam->Strategizer", "Strategizer->ResearchTeam"],
    },
    {
      description:
        "The Coder processes prospect data and performs analysis to enhance personalization insights.",
      tooltipPosition: "right",
      activeNodes: ["ResearchTeam", "Coder"],
      activeEdges: ["ResearchTeam->Coder", "Coder->ResearchTeam"],
    },
    {
      description:
        "Once prospect research is complete, the Research Team returns findings to the Planner for final assessment.",
      activeNodes: ["ResearchTeam", "Planner"],
      activeEdges: ["ResearchTeam->Planner"],
      tooltipPosition: "left",
    },
    {
      description:
        "The Planner verifies research completeness and hands off to the Reporter for final outreach package creation.",
      activeNodes: ["Reporter", "Planner"],
      activeEdges: ["Planner->Reporter"],
      tooltipPosition: "right",
    },
    {
      description:
        "The Reporter generates your complete personalized outreach package with prospect profile, strategy, and ready-to-send message.",
      activeNodes: ["End", "Reporter"],
      activeEdges: ["Reporter->End"],
      tooltipPosition: "bottom",
    },
  ],
};
