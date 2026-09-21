import { MessageSquare, CheckCircle2 } from "lucide-react";
import { Container } from "../common/Container";
import { SectionHeader } from "../common/SectionHeader";
export const Testimonials = () => {
  const testimonials = [
    {
      quote: "Practicing by speaking made my preparation feel much closer to a real interview.",
      author: "Alex Rivers",
      role: "Student Developer",
      tag: "@alexrivers",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
    },
    {
      quote: "The daily skill report showed me exactly which topics I needed to revise.",
      author: "Jordan Lee",
      role: "Placement Candidate",
      tag: "@jordantalks",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces"
    },
    {
      quote: "Instead of just giving me a score, the platform showed me what I was missing.",
      author: "Samantha Chen",
      role: "Software Engineering Student",
      tag: "@samchen_eng",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=faces"
    }
  ];
  return <section id="testimonials" className="py-20 sm:py-28 bg-white border-t border-slate-100">
      <Container>
        {
    /* Section Header */
  }
        <SectionHeader
    badgeIcon={<MessageSquare className="w-3.5 h-3.5" />}
    badgeText="Testimonials"
    title="Built for interview preparation."
    description="Practice consistently, understand your weak areas, and prepare with a clear improvement path."
  />

        {
    /* Testimonials cards grid matching screenshots */
  }
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, index) => <div
    key={index}
    className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 card-subtle-shadow hover:border-slate-300 transition-all flex flex-col justify-between"
  >
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-6 font-normal">
                "{item.quote}"
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100/90">
                <img
    src={item.avatar}
    alt={item.author}
    className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
    loading="lazy"
  />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-slate-900">{item.author}</span>
                    <CheckCircle2 className="w-4 h-4 text-[#00ba66] fill-[#00ba66]/10" />
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{item.role}</p>
                </div>
              </div>
            </div>)}
        </div>
      </Container>
    </section>;
};
