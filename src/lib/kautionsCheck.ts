export type Situation = 'einzug' | 'auszug' | 'waehrend';

export interface KautionInput {
  situation: Situation;
  kaltmiete: number;
  gezahlte_kaution: number;
  kaution_auf_konto: boolean;
  zinsen_erhalten: boolean;
  auszugsdatum?: Date;
  uebergabeprotokoll: boolean;
  maengel_vorhanden: boolean;
  nk_abrechnung_offen: boolean;
  vermieter_behaelt: number;
  einbehalt_grund: string;
}

export interface Problem {
  typ: string;
  text: string;
  schwere: 'kritisch' | 'mittel' | 'gering';
  rueckforderbar?: number;
}

export interface KautionResult {
  situation: Situation;
  kaltmiete: number;
  gezahlte_kaution: number;
  max_kaution: number;
  kaution_zu_hoch: boolean;
  ueberzahlung: number;
  probleme: Problem[];
  empfehlungen: string[];
  angemessene_frist_monate: number;
  rueckgabe_faellig: string | null;
  vermieter_behaelt: number;
  geschaetzte_zinsen: number;
  rueckforderung_gesamt: number;
  bewertung: 'ok' | 'problematisch';
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function round(value: number, decimals: number): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

export function checkKaution(input: KautionInput): KautionResult {
  const {
    situation, kaltmiete, gezahlte_kaution,
    kaution_auf_konto, zinsen_erhalten,
    auszugsdatum, uebergabeprotokoll, maengel_vorhanden, nk_abrechnung_offen,
    vermieter_behaelt, einbehalt_grund
  } = input;

  const probleme: Problem[] = [];
  const empfehlungen: string[] = [];

  const max_kaution = kaltmiete * 3;
  const kaution_zu_hoch = gezahlte_kaution > max_kaution;
  const ueberzahlung = Math.max(0, gezahlte_kaution - max_kaution);

  if (kaution_zu_hoch) {
    probleme.push({
      typ: 'hoehe',
      text: `Kaution zu hoch! Maximal erlaubt: ${max_kaution.toFixed(2)} €`,
      schwere: 'kritisch',
      rueckforderbar: ueberzahlung
    });
    empfehlungen.push(`Sie können ${ueberzahlung.toFixed(2)} € sofort zurückfordern`);
  }

  if (!kaution_auf_konto) {
    probleme.push({
      typ: 'anlage',
      text: 'Kaution muss auf separatem Konto angelegt werden (§551 Abs. 3 BGB)',
      schwere: 'mittel'
    });
    empfehlungen.push('Fordern Sie einen Nachweis über das Kautionskonto an');
  }

  if (situation === 'auszug' && !zinsen_erhalten) {
    empfehlungen.push('Sie haben Anspruch auf die aufgelaufenen Zinsen');
  }

  if (situation === 'auszug' && !uebergabeprotokoll) {
    empfehlungen.push('Fordern Sie ein Übergabeprotokoll an – wichtig für Streitfälle');
  }

  let rueckgabe_faellig: Date | null = null;
  let angemessene_frist_monate = 3;

  if (situation === 'auszug' && auszugsdatum) {
    if (nk_abrechnung_offen) {
      angemessene_frist_monate = 6;
      empfehlungen.push('Offene NK-Abrechnung kann Rückgabe auf bis zu 6 Monate verzögern');
    }
    if (maengel_vorhanden) {
      empfehlungen.push('Bei Mängeln kann der Vermieter einen Teil einbehalten – nur für nachgewiesene Schäden');
    }
    rueckgabe_faellig = addMonths(auszugsdatum, angemessene_frist_monate);
    
    const heute = new Date();
    if (heute > rueckgabe_faellig) {
      probleme.push({
        typ: 'frist',
        text: `Rückgabefrist überschritten seit ${formatDate(rueckgabe_faellig)}`,
        schwere: 'kritisch'
      });
      empfehlungen.push('Senden Sie dem Vermieter eine schriftliche Mahnung mit Fristsetzung');
    }
  }

  // Geschätzte Zinsen (vereinfacht: 0.5% p.a. für 3 Jahre)
  const geschaetzte_zinsen = situation === 'auszug'
    ? gezahlte_kaution * 0.005 * 3
    : 0;

  const rueckforderung_gesamt = gezahlte_kaution - (vermieter_behaelt || 0) + geschaetzte_zinsen;

  // Einbehalt prüfen
  if (vermieter_behaelt > 0 && !einbehalt_grund) {
    probleme.push({
      typ: 'einbehalt',
      text: 'Einbehalt ohne Begründung ist nicht zulässig',
      schwere: 'mittel'
    });
  }

  return {
    situation,
    kaltmiete,
    gezahlte_kaution,
    max_kaution: round(max_kaution, 2),
    kaution_zu_hoch,
    ueberzahlung: round(ueberzahlung, 2),
    probleme,
    empfehlungen,
    angemessene_frist_monate,
    rueckgabe_faellig: rueckgabe_faellig ? formatDate(rueckgabe_faellig) : null,
    vermieter_behaelt: vermieter_behaelt || 0,
    geschaetzte_zinsen: round(geschaetzte_zinsen, 2),
    rueckforderung_gesamt: round(rueckforderung_gesamt, 2),
    bewertung: probleme.filter(p => p.schwere === 'kritisch').length > 0 ? 'problematisch' : 'ok'
  };
}
