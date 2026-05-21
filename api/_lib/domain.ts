import {
  listingFeeds,
  projectSteps,
  scenarios,
  socialCircles,
  socialHighlights,
  socialStats,
  socialThreads,
  type ProjectMode,
} from "../../src/data/content.js";
import {
  documentWorkspaceData,
  projectStepMeta,
} from "../../src/features/platform/data/workspace.js";

function countByStatus(mode: ProjectMode) {
  const rows = documentWorkspaceData[mode];

  return {
    available: rows.filter((row) => row.status === "Disponible").length,
    pending: rows.filter((row) => row.status !== "Disponible").length,
    ragReady: rows.filter((row) => row.ragStatus !== "missing").length,
  };
}

export function getDocumentsPayload(mode: ProjectMode) {
  return {
    mode,
    summary: countByStatus(mode),
    items: documentWorkspaceData[mode],
  };
}

export function getProjectsPayload(mode: ProjectMode) {
  return {
    mode,
    scenario: {
      projectStatus: scenarios[mode].projectStatus,
      projectNote: scenarios[mode].projectNote,
      checklist: scenarios[mode].checklist,
      projectDocuments: scenarios[mode].projectDocuments,
    },
    steps: projectSteps[mode].map((step, index) => ({
      ...step,
      meta: projectStepMeta[mode][index],
    })),
  };
}

export function getSocialPayload(mode: ProjectMode) {
  return {
    mode,
    highlight: socialHighlights[mode],
    stats: socialStats[mode],
    circles: socialCircles[mode].map((circle) => ({
      ...circle,
      threads: socialThreads[mode].filter((thread) => thread.circleId === circle.id),
    })),
  };
}

export function getListingsSeed(mode: ProjectMode) {
  return {
    mode,
    items: listingFeeds[mode],
  };
}
