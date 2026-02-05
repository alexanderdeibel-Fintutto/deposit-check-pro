import { ExternalLink, Calculator, Scale, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const fintuttoTools = [
  {
    name: 'Kautions-Rechner',
    description: 'Berechne deine Mietkaution',
    icon: Calculator,
    url: 'https://fintutto.de/kautions-rechner'
  },
  {
    name: 'Mieterhöhungs-Check',
    description: 'Prüfe deine Mieterhöhung',
    icon: CheckCircle,
    url: 'https://fintutto.de/mieterhoehungs-check'
  },
  {
    name: 'Kündigungsfrist-Check',
    description: 'Berechne deine Kündigungsfrist',
    icon: Scale,
    url: 'https://fintutto.de/kuendigungsfrist-check'
  }
];

export const CrossSellBanner = () => {
  return (
    <Card className="border-primary/20 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-foreground">Weitere Fintutto Tools</h3>
            <p className="text-sm text-muted-foreground">
              Entdecke unsere kostenlosen Rechner und Checker
            </p>
          </div>

          <div className="grid gap-3">
            {fintuttoTools.map((tool) => (
              <a
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/10 transition-colors"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <tool.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{tool.name}</p>
                  <p className="text-xs text-muted-foreground">{tool.description}</p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </a>
            ))}
          </div>

          <Button variant="outline" size="sm" className="w-full" asChild>
            <a href="https://fintutto.de" target="_blank" rel="noopener noreferrer">
              Alle Tools ansehen
              <ExternalLink className="h-3 w-3 ml-2" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
