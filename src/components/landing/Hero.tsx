import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Star } from 'lucide-react';
import { Container } from '../common/Container';
import { Button } from '../common/Button';

// Hero component precisely matching Screenshot 1 visual hierarchy and colors
export const Hero: React.FC = () => {
  return (
    <section className="relative pt-16 sm:pt-24 pb-20 sm:pb-32 overflow-hidden">
      {/* Soft green ambient radial background glow matching reference */}
      <div className="absolute inset-0 pointer-events-none hero-glow" />

      <Container className="relative z-10 text-center">
        {/* Social / Trust badge above headline */}
        <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200/80 shadow-xs mb-8 transition-all hover:border-slate-300">
          {/* Avatar stack */}
          <div className="flex -space-x-2 overflow-hidden">
            <img
              className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=faces"
              alt="User"
              loading="lazy"
            />
            <img
              className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=faces"
              alt="User"
              loading="lazy"
            />
            <img
              className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=faces"
              alt="User"
              loading="lazy"
            />
            <img
              className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=faces"
              alt="User"
              loading="lazy"
            />
          </div>

          {/* Star rating & user trust copy */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <div className="flex items-center text-[#00ba66]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-[#00ba66]" />
              ))}
            </div>
            <span className="text-slate-600 font-medium ml-1">
              AI-powered interview practice
            </span>
          </div>
        </div>

        {/* Main headline: Massive bold typography with line 1 and line 2 on single lines across all screen sizes */}
        <h1 className="text-[clamp(1.2rem,5.2vw,4.25rem)] font-extrabold tracking-tight text-slate-900 leading-[1.18] mb-6 max-w-5xl mx-auto">
          <span className="block whitespace-nowrap">Ace your next interview with</span>
          <span className="block whitespace-nowrap mt-1 sm:mt-2">
            <span className="text-[#00ba66]">AI-powered</span>{' '}
            <span className="text-slate-900">practice.</span>
          </span>
        </h1>

        {/* Subtitle with spacious line height and max-width */}
        <p className="text-base sm:text-lg md:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto mb-10">
          Practice real interview questions by speaking naturally. Get instant AI feedback,
          track your skills, and discover exactly what you need to improve.
        </p>

        {/* Call to action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4">
          <Link to="/interview/setup" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Start Practicing
            </Button>
          </Link>
          <a href="#how-it-works" className="w-full sm:w-auto">
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
              icon={<Play className="w-3.5 h-3.5 text-slate-500 fill-slate-500" />}
            >
              See How It Works
            </Button>
          </a>
        </div>
      </Container>
    </section>
  );
};
