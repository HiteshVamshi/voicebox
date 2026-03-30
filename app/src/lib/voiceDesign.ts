export interface DesignedVoiceTraits {
  honesty: number;
  humor: number;
  warmth: number;
  energy: number;
  emotionalExpressiveness: number;
  confidence: number;
  formality: number;
}

export const DEFAULT_DESIGNED_VOICE_TRAITS: DesignedVoiceTraits = {
  honesty: 70,
  humor: 35,
  warmth: 65,
  energy: 50,
  emotionalExpressiveness: 55,
  confidence: 65,
  formality: 45,
};

export interface DesignedVoicePreset {
  id: string;
  label: string;
  description: string;
  traits: DesignedVoiceTraits;
}

export const DESIGNED_VOICE_PRESETS: DesignedVoicePreset[] = [
  {
    id: 'honest-advisor',
    label: 'Honest Advisor',
    description: 'Direct, grounded, warm, and trustworthy.',
    traits: {
      honesty: 92,
      humor: 20,
      warmth: 72,
      energy: 46,
      emotionalExpressiveness: 50,
      confidence: 80,
      formality: 58,
    },
  },
  {
    id: 'witty-host',
    label: 'Witty Host',
    description: 'Playful, social, energetic, and funny.',
    traits: {
      honesty: 70,
      humor: 88,
      warmth: 78,
      energy: 76,
      emotionalExpressiveness: 72,
      confidence: 74,
      formality: 28,
    },
  },
  {
    id: 'empathetic-coach',
    label: 'Empathetic Coach',
    description: 'Warm, supportive, reassuring, and emotionally aware.',
    traits: {
      honesty: 78,
      humor: 25,
      warmth: 92,
      energy: 52,
      emotionalExpressiveness: 82,
      confidence: 68,
      formality: 36,
    },
  },
  {
    id: 'cinematic-hype',
    label: 'Cinematic Hype',
    description: 'Bold, dramatic, high-energy, and emotionally vivid.',
    traits: {
      honesty: 58,
      humor: 18,
      warmth: 50,
      energy: 94,
      emotionalExpressiveness: 90,
      confidence: 92,
      formality: 60,
    },
  },
  {
    id: 'soft-reflective',
    label: 'Soft Reflective',
    description: 'Quiet, sincere, introspective, and gentle.',
    traits: {
      honesty: 86,
      humor: 14,
      warmth: 80,
      energy: 20,
      emotionalExpressiveness: 70,
      confidence: 42,
      formality: 40,
    },
  },
  {
    id: 'podcast-host',
    label: 'Podcast Host',
    description: 'Conversational, confident, warm, and lightly witty.',
    traits: {
      honesty: 76,
      humor: 52,
      warmth: 74,
      energy: 62,
      emotionalExpressiveness: 58,
      confidence: 78,
      formality: 34,
    },
  },
  {
    id: 'premium-narrator',
    label: 'Premium Narrator',
    description: 'Elegant, controlled, polished, and cinematic.',
    traits: {
      honesty: 74,
      humor: 12,
      warmth: 60,
      energy: 38,
      emotionalExpressiveness: 64,
      confidence: 84,
      formality: 82,
    },
  },
  {
    id: 'friendly-sales',
    label: 'Friendly Sales',
    description: 'Upbeat, persuasive, personable, and energetic.',
    traits: {
      honesty: 68,
      humor: 44,
      warmth: 82,
      energy: 80,
      emotionalExpressiveness: 68,
      confidence: 86,
      formality: 30,
    },
  },
];

function level(value: number, thresholds: [number, string][]): string {
  for (const [min, label] of thresholds) {
    if (value >= min) return label;
  }
  return thresholds[thresholds.length - 1][1];
}

function buildTraitSummary(traits: DesignedVoiceTraits): string {
  return [
    `${level(traits.honesty, [[85, 'very honest'], [65, 'honest'], [40, 'balanced'], [0, 'guarded']])}`,
    `${level(traits.humor, [[80, 'playful and funny'], [55, 'lightly witty'], [30, 'mostly serious'], [0, 'dry and serious']])}`,
    `${level(traits.warmth, [[80, 'deeply warm'], [60, 'warm'], [35, 'neutral'], [0, 'cool and detached']])}`,
    `${level(traits.energy, [[80, 'high-energy'], [60, 'lively'], [35, 'steady'], [0, 'calm and restrained']])}`,
    `${level(traits.emotionalExpressiveness, [[80, 'emotionally vivid'], [60, 'expressive'], [35, 'measured'], [0, 'emotionally restrained']])}`,
    `${level(traits.confidence, [[80, 'highly confident'], [60, 'confident'], [35, 'gentle'], [0, 'soft and tentative']])}`,
    `${level(traits.formality, [[80, 'very formal'], [60, 'polished'], [35, 'conversational'], [0, 'casual']])}`,
  ].join(', ');
}

export function buildDesignedVoicePrompt(
  name: string,
  description: string | undefined,
  traits: DesignedVoiceTraits,
): string {
  const trimmedDescription = description?.trim();
  const summary = buildTraitSummary(traits);
  const traitLine =
    `Trait settings: honesty ${traits.honesty}/100, humor ${traits.humor}/100, ` +
    `warmth ${traits.warmth}/100, energy ${traits.energy}/100, ` +
    `emotional expressiveness ${traits.emotionalExpressiveness}/100, ` +
    `confidence ${traits.confidence}/100, formality ${traits.formality}/100.`;

  return [
    `Design a voice called "${name}" with ${summary}.`,
    trimmedDescription ? `Creative brief: ${trimmedDescription}` : null,
    traitLine,
  ]
    .filter(Boolean)
    .join(' ');
}

export function parseDesignedVoiceTraits(
  designPrompt: string | null | undefined,
): DesignedVoiceTraits {
  if (!designPrompt) return DEFAULT_DESIGNED_VOICE_TRAITS;

  const match = designPrompt.match(
    /Trait settings:\s*honesty\s*(\d+)\/100,\s*humor\s*(\d+)\/100,\s*warmth\s*(\d+)\/100,\s*energy\s*(\d+)\/100,\s*emotional expressiveness\s*(\d+)\/100,\s*confidence\s*(\d+)\/100,\s*formality\s*(\d+)\/100/i,
  );

  if (!match) return DEFAULT_DESIGNED_VOICE_TRAITS;

  return {
    honesty: Number(match[1]),
    humor: Number(match[2]),
    warmth: Number(match[3]),
    energy: Number(match[4]),
    emotionalExpressiveness: Number(match[5]),
    confidence: Number(match[6]),
    formality: Number(match[7]),
  };
}
