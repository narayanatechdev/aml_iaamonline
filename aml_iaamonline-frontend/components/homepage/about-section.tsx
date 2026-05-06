'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              About Advanced Materials Letters
            </h2>
            <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
              Advanced Materials Letters is an open-access, peer-reviewed academic journal dedicated to publishing
              high-quality research, reviews, and short communications in the field of materials science,
              nanotechnology, and advanced functional materials.
            </p>
            <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
              Founded in 2010, our journal has become one of the most respected platforms for researchers to
              share their discoveries and innovations. We maintain rigorous editorial standards while providing
              rapid publication timelines.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our mission is to advance the field of materials science by fostering global collaboration among
              researchers, engineers, and industry professionals.
            </p>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Scope</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">•</span>
                    <span>Nanomaterials and nanostructures</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">•</span>
                    <span>Polymer science and engineering</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">•</span>
                    <span>Composite materials</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">•</span>
                    <span>Functional materials</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">•</span>
                    <span>Materials characterization</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Publication Models</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">•</span>
                    <span>Research Articles</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">•</span>
                    <span>Review Articles</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">•</span>
                    <span>Short Communications</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">•</span>
                    <span>Letters</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
