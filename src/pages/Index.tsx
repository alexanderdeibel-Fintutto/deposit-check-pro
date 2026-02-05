import { useState } from 'react';
import { Shield, Scale, Lock } from 'lucide-react';
import { Header } from '@/components/Header';
import { AuthModal } from '@/components/AuthModal';
import { KautionsForm } from '@/components/KautionsForm';
import { KautionsResult } from '@/components/KautionsResult';
import { CrossSellBanner } from '@/components/CrossSellBanner';
import { checkKaution, KautionInput, KautionResult } from '@/lib/kautionsCheck';

const Index = () => {
  const [result, setResult] = useState<KautionResult | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

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
      <Header onLoginClick={() => setShowAuthModal(true)} />

      {/* Hero Section */}
      <div className="gradient-primary text-white py-8 px-4">
        <div className="container max-w-3xl">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8" />
            <h1 className="text-3xl md:text-4xl font-bold">Kautions-Check</h1>
          </div>
          <p className="text-white/80 text-lg">
            Prüfen Sie Ihre Mietkaution – ist sie rechtlich korrekt?
          </p>
        </div>
      </div>

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

            {/* Cross-Sell Banner */}
            <div className="mt-8">
              <CrossSellBanner />
            </div>
          </>
        ) : (
          <>
            <KautionsResult result={result} onReset={handleReset} />

            {/* Cross-Sell Banner */}
            <div className="mt-8">
              <CrossSellBanner />
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-auto">
        <div className="container max-w-3xl py-6 text-center text-sm text-muted-foreground">
          <p>Basierend auf deutschem Mietrecht (§551 BGB)</p>
          <p className="mt-1">Diese Prüfung ersetzt keine Rechtsberatung.</p>
        </div>
      </footer>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default Index;
