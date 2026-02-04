import { useState } from 'react';
import { Home, Euro, Calendar, FileText, AlertTriangle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { KautionInput, Situation } from '@/lib/kautionsCheck';

interface KautionsFormProps {
  onSubmit: (data: KautionInput) => void;
}

export function KautionsForm({ onSubmit }: KautionsFormProps) {
  const [situation, setSituation] = useState<Situation>('auszug');
  const [kaltmiete, setKaltmiete] = useState<string>('');
  const [gezahlteKaution, setGezahlteKaution] = useState<string>('');
  const [kautionAufKonto, setKautionAufKonto] = useState(false);
  const [zinsenErhalten, setZinsenErhalten] = useState(false);
  const [auszugsdatum, setAuszugsdatum] = useState<string>('');
  const [uebergabeprotokoll, setUebergabeprotokoll] = useState(false);
  const [maengelVorhanden, setMaengelVorhanden] = useState(false);
  const [nkAbrechnungOffen, setNkAbrechnungOffen] = useState(false);
  const [vermieterBehaelt, setVermieterBehaelt] = useState<string>('');
  const [einbehaltGrund, setEinbehaltGrund] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data: KautionInput = {
      situation,
      kaltmiete: parseFloat(kaltmiete) || 0,
      gezahlte_kaution: parseFloat(gezahlteKaution) || 0,
      kaution_auf_konto: kautionAufKonto,
      zinsen_erhalten: zinsenErhalten,
      auszugsdatum: auszugsdatum ? new Date(auszugsdatum) : undefined,
      uebergabeprotokoll,
      maengel_vorhanden: maengelVorhanden,
      nk_abrechnung_offen: nkAbrechnungOffen,
      vermieter_behaelt: parseFloat(vermieterBehaelt) || 0,
      einbehalt_grund: einbehaltGrund,
    };

    onSubmit(data);
  };

  const isValid = kaltmiete && gezahlteKaution && parseFloat(kaltmiete) > 0 && parseFloat(gezahlteKaution) > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Gruppe 1: Situation */}
      <div className="form-section animate-fade-in">
        <h3 className="form-section-title">
          <Home className="h-5 w-5 text-primary" />
          Ihre Situation
        </h3>
        <div className="space-y-2">
          <Label htmlFor="situation">Aktuelle Situation</Label>
          <Select value={situation} onValueChange={(v) => setSituation(v as Situation)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="einzug">Einzug (neue Wohnung)</SelectItem>
              <SelectItem value="auszug">Auszug (Kaution zurückfordern)</SelectItem>
              <SelectItem value="waehrend">Während der Mietzeit</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Gruppe 2: Kautions-Details */}
      <div className="form-section animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <h3 className="form-section-title">
          <Euro className="h-5 w-5 text-primary" />
          Kautions-Details
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="kaltmiete">Nettokaltmiete *</Label>
            <div className="relative">
              <Input
                id="kaltmiete"
                type="number"
                placeholder="z.B. 800"
                value={kaltmiete}
                onChange={(e) => setKaltmiete(e.target.value)}
                className="pr-8"
                min="0"
                step="0.01"
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
            </div>
            <p className="text-xs text-muted-foreground">Ohne Nebenkosten</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="gezahlte_kaution">Gezahlte Kaution *</Label>
            <div className="relative">
              <Input
                id="gezahlte_kaution"
                type="number"
                placeholder="z.B. 2400"
                value={gezahlteKaution}
                onChange={(e) => setGezahlteKaution(e.target.value)}
                className="pr-8"
                min="0"
                step="0.01"
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-8 pt-2">
          <div className="flex items-center gap-3">
            <Switch
              id="kaution_auf_konto"
              checked={kautionAufKonto}
              onCheckedChange={setKautionAufKonto}
            />
            <Label htmlFor="kaution_auf_konto" className="cursor-pointer">
              Auf separatem Konto angelegt?
            </Label>
          </div>
          {situation === 'auszug' && (
            <div className="flex items-center gap-3">
              <Switch
                id="zinsen_erhalten"
                checked={zinsenErhalten}
                onCheckedChange={setZinsenErhalten}
              />
              <Label htmlFor="zinsen_erhalten" className="cursor-pointer">
                Zinsen erhalten?
              </Label>
            </div>
          )}
        </div>
      </div>

      {/* Gruppe 3: Bei Auszug */}
      {situation === 'auszug' && (
        <div className="form-section animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h3 className="form-section-title">
            <Calendar className="h-5 w-5 text-primary" />
            Auszug-Details
          </h3>
          <div className="space-y-2">
            <Label htmlFor="auszugsdatum">Auszugsdatum</Label>
            <Input
              id="auszugsdatum"
              type="date"
              value={auszugsdatum}
              onChange={(e) => setAuszugsdatum(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-8 pt-2">
            <div className="flex items-center gap-3">
              <Switch
                id="uebergabeprotokoll"
                checked={uebergabeprotokoll}
                onCheckedChange={setUebergabeprotokoll}
              />
              <Label htmlFor="uebergabeprotokoll" className="cursor-pointer">
                Übergabeprotokoll vorhanden?
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="maengel_vorhanden"
                checked={maengelVorhanden}
                onCheckedChange={setMaengelVorhanden}
              />
              <Label htmlFor="maengel_vorhanden" className="cursor-pointer">
                Mängel festgestellt?
              </Label>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Switch
              id="nk_abrechnung_offen"
              checked={nkAbrechnungOffen}
              onCheckedChange={setNkAbrechnungOffen}
            />
            <Label htmlFor="nk_abrechnung_offen" className="cursor-pointer">
              Nebenkostenabrechnung noch offen?
            </Label>
          </div>
        </div>
      )}

      {/* Gruppe 4: Einbehalt */}
      {situation === 'auszug' && (
        <div className="form-section animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h3 className="form-section-title">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Einbehalt durch Vermieter
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="vermieter_behaelt">Vermieter behält ein</Label>
              <div className="relative">
                <Input
                  id="vermieter_behaelt"
                  type="number"
                  placeholder="0"
                  value={vermieterBehaelt}
                  onChange={(e) => setVermieterBehaelt(e.target.value)}
                  className="pr-8"
                  min="0"
                  step="0.01"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="einbehalt_grund">Begründung</Label>
              <Textarea
                id="einbehalt_grund"
                placeholder="Grund für Einbehalt..."
                value={einbehaltGrund}
                onChange={(e) => setEinbehaltGrund(e.target.value)}
                rows={2}
              />
            </div>
          </div>
        </div>
      )}

      <Button 
        type="submit" 
        size="lg" 
        className="w-full"
        disabled={!isValid}
      >
        <FileText className="mr-2 h-5 w-5" />
        Kaution prüfen
      </Button>
    </form>
  );
}
