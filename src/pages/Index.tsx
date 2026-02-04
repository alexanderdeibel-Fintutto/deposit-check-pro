import { useState } from 'react';
import { Shield, Scale, Lock } from 'lucide-react';
import { KautionsForm } from '@/components/KautionsForm';
import { KautionsResult } from '@/components/KautionsResult';
import { checkKaution, KautionInput, KautionResult } from '@/lib/kautionsCheck';

const Index = () => {
  const [result, setResult] = useState<KautionResult | null>(null);

  const handleSubmit = (data: KautionInput) => {
    const checkResult = checkKaution(data);
    setResult(checkResult);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container max-w-3xl py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Kautions-Check</h1>
              <p className="text-sm text-muted-foreground">Prüfen Sie Ihre Mietkaution</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-3xl py-8 px-4">
        {!result ? (
          <>
            {/* Info Banner */}
            <div className="mb-8 rounded-xl bg-primary/5 border border-primary/10 p-6">
              <h2 className="font-semibold text-lg mb-3">Was wird geprüft?</h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-primary" />
                  Ist die Kaution zu hoch? (max. 3 Nettokaltmieten)
                </li>
                <li className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  Wurde die Kaution korrekt angelegt?
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Wann muss der Vermieter zurückzahlen?
                </li>
              </ul>
            </div>

            <KautionsForm onSubmit={handleSubmit} />
          </>
        ) : (
          <KautionsResult result={result} onReset={handleReset} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-auto">
        <div className="container max-w-3xl py-6 text-center text-sm text-muted-foreground">
          <p>Basierend auf deutschem Mietrecht (§551 BGB)</p>
          <p className="mt-1">Diese Prüfung ersetzt keine Rechtsberatung.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
