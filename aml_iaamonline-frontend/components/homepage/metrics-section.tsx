'use client';

import { Card } from '@/components/ui/card';

interface Metric {
  label: string;
  value: string;
  description: string;
}

const metrics: Metric[] = [
  {
    label: 'Total Articles',
    value: '1,250+',
    description: 'Published since establishment',
  },
  {
    label: 'Impact Factor',
    value: '4.2',
    description: '2024 Journal Citation Reports',
  },
  {
    label: 'Active Authors',
    value: '5,000+',
    description: 'From 50+ countries worldwide',
  },
  {
    label: 'Yearly Downloads',
    value: '250K+',
    description: 'Average annual downloads',
  },
];

export function MetricsSection() {
  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Journal Metrics</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            IAAM Advanced Materials Letters is a leading publication in materials science research
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {metrics.map((metric, idx) => (
            <Card key={idx} className="p-6 text-center hover:shadow-lg transition-all hover:border-primary/40">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-3">
                {metric.value}
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                {metric.label}
              </h3>
              <p className="text-sm text-muted-foreground">
                {metric.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
