import React from 'react';
import { Hero } from '../../components/landing/Hero';
import { ProcessSection } from '../../components/landing/ProcessSection';
import { EvaluationSection } from '../../components/landing/EvaluationSection';
import { DailyReportSection } from '../../components/landing/DailyReportSection';
import { Testimonials } from '../../components/landing/Testimonials';
import { FinalCTA } from '../../components/landing/FinalCTA';

// Complete landing page assembling all modular visual sections
export const Home: React.FC = () => {
  return (
    <main className="w-full min-h-screen bg-white">
      {/* 1. Hero Section with soft green radial glow */}
      <Hero />

      {/* 2. Simple Process Section (Voice interviews, AI evaluation, skill tracking) */}
      <ProcessSection />

      {/* 3. AI Evaluation Section (Granular score breakdown & missing concepts) */}
      <EvaluationSection />

      {/* 4. Total Interview Report Section (Skill audit & personalized recommendations) */}
      <DailyReportSection />

      {/* 5. Testimonials Section (Clean user quotes & social proof) */}
      <Testimonials />

      {/* 6. Final Call to Action */}
      <FinalCTA />
    </main>
  );
};
