export interface KautionInputs {
  kaltmiete: number;
  warmmiete: number | null;
  vereinbarte_kaution: number;
  mietbeginn: Date;
  kautions_art: KautionsArt;
}

export type KautionsArt = 'sparkonto' | 'buergschaft' | 'sparbuch' | 'barzahlung';

export interface KautionsArtOption {
  value: KautionsArt;
  label: string;
  zinssatz?: number;
  kosten_prozent?: number;
  description: string;
}

export interface Rate {
  monat: number;
  betrag: number;
  faellig: Date;
}

export interface KautionResults {
  kaltmiete: number;
  warmmiete: number | null;
  max_kaution_betrag: number;
  kaution_betrag: number;
  kaution_monate: number;
  kaution_zu_hoch: boolean;
  ueberzahlung: number;
  raten: Rate[];
  erste_rate: number;
  kautions_art: KautionsArt;
  kautions_art_label: string;
  jaehrliche_zinsen: number;
  jaehrliche_kosten: number;
  zinsen_5_jahre: number;
  kosten_5_jahre: number;
  empfehlung: string;
  endwert_5_jahre: number;
}
