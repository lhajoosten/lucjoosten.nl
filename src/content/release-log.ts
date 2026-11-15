export const releaseLog = {
  title: 'Release Log',
  subtitle: 'Reproducible release history. Clear boundaries for AI.',
  introduction:
    'A GitHub-first TypeScript CLI that separates deterministic changelogs from optional AI-assisted release notes.',
  source: {
    url: 'https://github.com/lhajoosten/release-log/blob/53eaaf949d242b848108fed106a6809cadf74416/README.md',
    revision: '53eaaf949d242b848108fed106a6809cadf74416',
    reviewed: '2026-11-15',
  },
  sections: [
    {
      id: 'problem',
      title: 'The problem',
      paragraphs: [
        'Release history needs to explain both the changes and their significance. The project combines conventional change metadata with structured context from pull request descriptions.',
        'Its aim is to make changelog generation repeatable while keeping user-facing writing separate from the rules that decide what belongs in a release.',
      ],
    },
    {
      id: 'approach',
      title: 'A captured record, two outputs',
      paragraphs: [
        'The documented approach starts with Git reachability between tags, then associates commits with merged GitHub pull requests. It validates metadata and captures normalized release data before rendering.',
        'Snapshots avoid relying on PR descriptions that can change later. Stable grouping and ordering are intended to produce the same changelog from the same captured data and configuration. Missing associations and invalid metadata must be reported.',
      ],
    },
    {
      id: 'capabilities',
      title: 'Documented implementation',
      paragraphs: [
        'The README reports implemented Git/PR collection, snapshots, version planning and changelog rendering, with tests. The locally packable CLI supports online collection and offline planning/rendering, with dry-run or explicitly enabled manifest writes.',
        'These are source-documented capabilities. Source-project tests were not executed for this case study, and no production outcomes are claimed.',
      ],
    },
    {
      id: 'ai-boundary',
      title: 'Where AI belongs',
      paragraphs: [
        'In the proposed AI layer, Git history and explicit metadata determine release membership, classification and breaking changes. AI would explain supported user impact in a separate artifact; it would not make those decisions.',
        'The provider, model and input/output schemas remain undecided. AI output is not promised to be repeatable, and provider failure must leave deterministic changelog generation available.',
      ],
    },
    {
      id: 'limitations',
      title: 'Rollout remains unfinished',
      paragraphs: [
        'The reusable rolling-release workflow and GitHub App setup are not yet deployed. The README describes an inactive caller template, separate live-setup approval and limitations around trust and rollout.',
        'Downstream image publication and deployment remain the consuming repository’s responsibility. Implemented components do not establish a working production rollout.',
      ],
    },
  ],
} as const;
