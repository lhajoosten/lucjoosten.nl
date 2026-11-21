export const releaseLog = {
  title: 'Release Log',
  subtitle: 'From merged changes to a reviewed release.',
  introduction:
    'A GitHub-first TypeScript CLI for deterministic changelogs and release automation, packaged as a runnable container and used by the project itself.',
  source: {
    url: 'https://github.com/lhajoosten/release-log/blob/033903ca288b623d0014e5e0e23de354b5668ea8/README.md',
    revision: '033903ca288b623d0014e5e0e23de354b5668ea8',
    reviewed: '2026-11-16',
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
      title: 'Capture once, replay offline',
      paragraphs: [
        'The documented approach starts with Git reachability between tags, then associates commits with merged GitHub pull requests. It validates metadata and captures normalized release data before rendering.',
        'Snapshots avoid relying on PR descriptions that can change later. Stable grouping and ordering are intended to produce the same changelog from the same captured data and configuration. Missing associations and invalid metadata must be reported.',
        'For example, once a release proposal has captured the input data, a later edit to a pull request description cannot change a changelog replayed from that snapshot. Reviewers can trace the release text back to the same captured changes.',
      ],
    },
    {
      id: 'release-cycle',
      title: 'A release PR, then an exact version tag',
      paragraphs: [
        'After ordinary pull requests merge, a GitHub App creates or refreshes one release proposal. It includes the complete change range since the previous version tag, the next version, a changelog and captured inputs. Supported root Node and Python manifests are updated together, while earlier changelog sections are preserved.',
        'A human reviews and merges the proposal. The workflow tags that exact merge landing and avoids creating a new proposal for the release itself. Consuming repositories can use the tag to trigger their own packaging or deployment.',
        'Matching-tag retries reuse the existing tag. Conflicting tags and unexpected edits stop for review rather than being overwritten. Consumers pin the workflow and tool to the same reviewed commit and explicitly enable writes after setup.',
      ],
    },
    {
      id: 'capabilities',
      title: 'Documented implementation',
      paragraphs: [
        'Git/PR collection, snapshots, version planning and changelog rendering support online collection and offline replay. The README reports that the project uses its own pinned proposal/tag workflow across multiple releases, with tags at the exact release-PR landings and previous changelog content preserved.',
        'The README also reports synthetic sandbox checks for proposal refresh, a subsequent release cycle and an unchanged retry. These are source-documented results, not evidence of independent consumer adoption. Source-project tests were not executed for this case study.',
      ],
    },
    {
      id: 'availability',
      title: 'Packaged for use',
      paragraphs: [
        'A Linux/amd64 CLI image is published on GitHub Container Registry. The reviewed README reports successful anonymous pulls by version and digest, plus version and help smoke checks. Automation should use a digest reference; the current upstream instructions provide the verified pull and run commands.',
        'At the reviewed revision, there is no latest image alias or arm64 image, and the npm package remains private. A version tag identifies source code; it does not establish that a matching container has finished publishing.',
      ],
    },
    {
      id: 'ai-boundary',
      title: 'Where AI belongs',
      paragraphs: [
        'Git history and explicit metadata determine release membership, classification and breaking changes. AI-written user-facing release notes remain planned and unimplemented; future notes would explain supported impact in a separate artifact without making those release decisions.',
        'A separate optional text-generation API supports explicit provider connections through AI SDK Core. No provider or model is enabled by default. Ordinary changelog generation works without AI credentials or an available provider.',
      ],
    },
    {
      id: 'limitations',
      title: 'Adoption boundaries and remaining validation',
      paragraphs: [
        'New consumers still need their own repository identity, trusted configuration, GitHub App installation and reviewed onboarding. The consumer template keeps writes disabled until setup is approved. Downstream publication and deployment permissions belong to the consuming repository.',
        'Controlled stale or tampered input, concurrency and missing or conflicting tag exercises remain outstanding in the reviewed README. Self-use and synthetic validation do not establish every failure mode or independent adoption.',
        'The newer controller documents opt-in tool self-upgrades and GitHub Release publication. At this revision, the project’s own caller still needs a reviewed bootstrap to activate those capabilities; implemented support and active rollout are separate claims.',
      ],
    },
  ],
} as const;
