
import { motion } from "framer-motion";
import { experiences, skills, education } from "@/lib/data";

export function CV() {
  return (
    <section id="cv" className="py-24 px-6 md:px-12 bg-white text-black relative" style={{ clipPath: 'polygon(0 0, 3% 16px, 6% 0, 9% 16px, 12% 0, 15% 16px, 18% 0, 21% 16px, 24% 0, 27% 16px, 30% 0, 33% 16px, 36% 0, 39% 16px, 42% 0, 45% 16px, 48% 0, 51% 16px, 54% 0, 57% 16px, 60% 0, 63% 16px, 66% 0, 69% 16px, 72% 0, 75% 16px, 78% 0, 81% 16px, 84% 0, 87% 16px, 90% 0, 93% 16px, 96% 0, 100% 16px, 100% 100%, 0 100%)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-16">
          
          {/* Left Column: Experience */}
          <div className="md:w-2/3">
            <h2 className="font-display text-5xl mb-12 uppercase tracking-tighter transform -rotate-1 inline-block bg-black text-white px-4 py-2">
              Опыт работы
            </h2>

            <div className="space-y-16">
              {experiences.map((exp, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-8 border-l-4 border-black"
                >
                  <div className="absolute -left-[11px] top-0 w-5 h-5 bg-primary rounded-full border-4 border-white" />
                  
                  <h3 style={{ fontFamily: 'Comic Relief, cursive' }} className="text-3xl font-bold leading-none mb-2 whitespace-pre-line">{exp.role}</h3>
                  <div className="font-mono text-sm mb-4 bg-black/5 inline-block px-2 py-1 font-bold">
                    {exp.company} <span className="mx-2">|</span> {exp.period}
                  </div>
                  
                  <ul className="font-mono text-sm space-y-2 text-black/80 list-disc pl-4 marker:text-primary">
                    {exp.description.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column: Skills & Edu */}
          <div className="md:w-1/3 space-y-16">
            
            {/* Education */}
            <div>
              <h2 className="font-display text-4xl mb-8 uppercase tracking-tighter transform rotate-1 inline-block bg-primary text-white px-4 py-1">
                Образование
              </h2>
              <div className="space-y-6">
                {education.map((edu, index) => (
                  <div key={index} className="border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
                    <h3 style={{ fontFamily: 'Comic Relief, cursive' }} className="text-xl font-bold mb-2 leading-tight">{edu.university}</h3>
                    <p className="font-mono text-sm text-black/70 mb-2">{edu.degree}</p>
                    <span className="font-mono text-xs bg-black text-white px-2 py-1">{edu.year}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div>
              <h2 className="font-display text-4xl mb-8 uppercase tracking-tighter inline-block border-b-4 border-primary">
                Навыки
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-mono text-xs font-bold mb-3 uppercase text-primary">Продвинутый</h4>
                  <div className="flex flex-wrap gap-2">
                    {skills.advanced.map(skill => (
                      <span key={skill} className="font-mono text-xs border border-black px-2 py-1 hover:bg-black hover:text-white transition-colors cursor-default">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-mono text-xs font-bold mb-3 uppercase text-primary">Средний</h4>
                  <div className="flex flex-wrap gap-2">
                    {skills.intermediate.map(skill => (
                      <span key={skill} className="font-mono text-xs border border-black px-2 py-1 hover:bg-black hover:text-white transition-colors cursor-default">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Torn Paper Effect Bottom */}
      <div className="absolute bottom-0 left-0 w-full h-12 bg-background" 
           style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 95% 80%, 90% 0, 85% 90%, 80% 10%, 75% 85%, 70% 15%, 65% 80%, 60% 10%, 55% 90%, 50% 0, 45% 85%, 40% 5%, 35% 80%, 30% 15%, 25% 90%, 20% 10%, 15% 85%, 10% 0, 5% 90%, 0 0)' }}>
      </div>
    </section>
  );
}
