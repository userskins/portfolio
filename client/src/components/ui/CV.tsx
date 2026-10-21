
import { motion } from "framer-motion";
import { experiences, skills, education } from "@/lib/data";

export function CV() {
  return (
    <section id="cv" className="py-24 px-6 md:px-12 bg-[#eeeae3] text-[#15161a] relative" >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-16">
          
          {/* Left Column: Experience */}
          <div className="md:w-2/3">
            <h2 className="font-display text-4xl md:text-5xl mb-12 font-semibold tracking-[-.07em] inline-block">
              Experience
            </h2>

            <div className="space-y-16">
              {experiences.map((exp, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-8 border-l border-black/30"
                >
                  <div className="absolute -left-[5px] top-0 w-2 h-2 bg-primary rounded-full" />
                  
                  <h3  className="font-display text-xl md:text-2xl font-semibold tracking-[-.04em] mb-2 whitespace-pre-line">{exp.role}</h3>
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
              <h2 className="font-display text-3xl mb-8 font-semibold tracking-[-.06em] inline-block">
                Education
              </h2>
              <div className="space-y-6">
                {education.map((edu, index) => (
                  <div key={index} className="border border-black/15 rounded-2xl p-6 bg-white/70">
                    <h3  className="text-xl font-bold mb-2 leading-tight">{edu.university}</h3>
                    <p className="font-mono text-sm text-black/70 mb-2">{edu.degree}</p>
                    <span className="font-mono text-xs bg-black text-white px-2 py-1">{edu.year}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div>
              <h2 className="font-display text-3xl mb-8 font-semibold tracking-[-.06em] inline-block border-b border-primary">
                Skills
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-mono text-xs font-bold mb-3 uppercase text-primary">Advanced</h4>
                  <div className="flex flex-wrap gap-2">
                    {skills.advanced.map(skill => (
                      <span key={skill} className="font-mono text-xs border border-black px-2 py-1 hover:bg-black hover:text-white transition-colors cursor-default">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-mono text-xs font-bold mb-3 uppercase text-primary">Intermediate</h4>
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

    </section>
  );
}
