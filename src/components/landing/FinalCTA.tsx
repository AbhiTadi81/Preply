import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Container } from '../common/Container';
import { Button } from '../common/Button';

// Final CTA Section styled to match Screenshot 4 with thin structural grid borders
export const FinalCTA: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-white relative">
      <Container>
        {/* Border framing box with subtle guidelines matching Screenshot 4 */}
        <div className="relative border border-dashed border-slate-200 rounded-3xl p-8 sm:p-12 lg:p-16 bg-white overflow-hidden">
          {/* Subtle crosshair decorative markings on corners */}
          <div className="absolute top-0 left-0 -mt-2 -ml-2 text-slate-300 text-xs select-none">+</div>
          <div className="absolute top-0 right-0 -mt-2 -mr-2 text-slate-300 text-xs select-none">+</div>
          <div className="absolute bottom-0 left-0 -mb-2 -ml-2 text-slate-300 text-xs select-none">+</div>
          <div className="absolute bottom-0 right-0 -mb-2 -mr-2 text-slate-300 text-xs select-none">+</div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 leading-snug mb-4">
                Turn interview practice into real improvement.
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed space-y-1">
                <span className="block">Practice today.</span>
                <span className="block">Understand your weaknesses.</span>
                <span className="block font-medium text-slate-800">Improve tomorrow.</span>
              </p>
            </div>

            <div className="shrink-0">
              <Link to="/interview/setup">
                <Button
                  variant="primary"
                  size="lg"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  Start Practicing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
