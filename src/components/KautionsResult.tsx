import { CheckCircle2, AlertTriangle, XCircle, Info, ArrowRight, Calculator } from 'lucide-react';
import { KautionResult } from '@/lib/kautionsCheck';
import { Button } from '@/components/ui/button';

interface KautionsResultProps {
  result: KautionResult;
  onReset: () => void;
}

export function KautionsResult({ result, onReset }: KautionsResultProps) {
  const isOk = result.bewertung === 'ok';
  const hasKritisch = result.probleme.some(p => p.schwere === 'kritisch');

  const situationLabels = {
    einzug: 'Einzug',
    auszug: 'Auszug',
    waehrend: 'Während Mietzeit'
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Primary Result */}
      <div className={`result-card ${isOk ? 'result-card-success' : 'result-card-error'}`}>
        <div className="flex items-start gap-4">
          {isOk ? (
            <CheckCircle2 className="h-10 w-10 text-success flex-shrink-0" />
          ) : (
            <XCircle className="h-10 w-10 text-destructive flex-shrink-0" />
          )}
          <div>
            <h2 className="text-xl font-bold">
              {result.kaution_zu_hoch && (
                <>Kaution {result.ueberzahlung.toFixed(2)} € zu hoch!</>
              )}
              {!result.kaution_zu_hoch && isOk && (
                <>Kaution korrekt</>
              )}
              {!result.kaution_zu_hoch && hasKritisch && (
                <>Probleme festgestellt</>
              )}
            </h2>
            <p className="text-muted-foreground mt-1">
              Situation: {situationLabels[result.situation]}
            </p>
          </div>
        </div>
      </div>

      {/* Rückforderungs-Box bei Auszug */}
      {result.situation === 'auszug' && (
        <div className="result-card bg-primary/5 border-primary/20 animate-scale-in">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Ihre Rückforderung
          </h3>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gezahlte Kaution:</span>
              <span className="font-semibold">{result.gezahlte_kaution.toFixed(2)} €</span>
            </div>
            {result.vermieter_behaelt > 0 && (
              <div className="flex justify-between text-destructive">
                <span>− Einbehalt:</span>
                <span>{result.vermieter_behaelt.toFixed(2)} €</span>
              </div>
            )}
            {result.geschaetzte_zinsen > 0 && (
              <div className="flex justify-between text-success">
                <span>+ Zinsen (geschätzt):</span>
                <span>{result.geschaetzte_zinsen.toFixed(2)} €</span>
              </div>
            )}
            <div className="border-t border-border pt-2 mt-2">
              <div className="flex justify-between text-lg font-bold">
                <span>= Zu erstatten:</span>
                <span className="text-primary">{result.rueckforderung_gesamt.toFixed(2)} €</span>
              </div>
            </div>
          </div>
          {result.rueckgabe_faellig && (
            <p className="text-sm text-muted-foreground mt-4">
              Rückgabe fällig bis: <strong>{result.rueckgabe_faellig}</strong> 
              <span className="ml-1">({result.angemessene_frist_monate} Monate Frist)</span>
            </p>
          )}
        </div>
      )}

      {/* Secondary Results Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="result-card text-center">
          <p className="stat-value">{result.gezahlte_kaution.toFixed(2)} €</p>
          <p className="stat-label">Gezahlt</p>
        </div>
        <div className="result-card text-center">
          <p className="stat-value">{result.max_kaution.toFixed(2)} €</p>
          <p className="stat-label">Maximum (3× Miete)</p>
        </div>
        {result.situation === 'auszug' && (
          <>
            <div className="result-card text-center">
              <p className="stat-value">{result.vermieter_behaelt.toFixed(2)} €</p>
              <p className="stat-label">Einbehalten</p>
            </div>
            <div className="result-card text-center">
              <p className="stat-value">{result.geschaetzte_zinsen.toFixed(2)} €</p>
              <p className="stat-label">Zinsen (ca.)</p>
            </div>
          </>
        )}
      </div>

      {/* Probleme */}
      {result.probleme.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Festgestellte Probleme
          </h3>
          {result.probleme.map((problem, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                problem.schwere === 'kritisch'
                  ? 'bg-destructive/5 border-destructive/20'
                  : 'bg-warning/5 border-warning/20'
              }`}
            >
              <div className="flex items-start gap-3">
                {problem.schwere === 'kritisch' ? (
                  <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-medium">{problem.text}</p>
                  {problem.rueckforderbar && (
                    <p className="text-sm text-success mt-1">
                      Rückforderbar: {problem.rueckforderbar.toFixed(2)} €
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empfehlungen */}
      {result.empfehlungen.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            Empfehlungen
          </h3>
          <ul className="space-y-2">
            {result.empfehlungen.map((empfehlung, index) => (
              <li key={index} className="flex items-start gap-2 text-muted-foreground">
                <ArrowRight className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                <span>{empfehlung}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Cross-Sell */}
      <div className="result-card bg-secondary/50 border-secondary">
        <p className="text-sm text-muted-foreground">
          💡 <strong>Tipp:</strong> Berechnen Sie die korrekte Kaution mit dem Kautions-Rechner
        </p>
      </div>

      <Button variant="outline" onClick={onReset} className="w-full">
        Neue Prüfung starten
      </Button>
    </div>
  );
}
