import React from 'react';
import { motion } from 'framer-motion';

const experiences = [
    {
        title: "Computer Programming Student & Developer",
        company: "Fanshawe College - Advanced Diploma (CO-OP)",
        period: "September 2023 - Present",
        description: [
            "Maintaining exceptional GPA of 3.9 while mastering multiple programming languages",
            "Developed comprehensive C++ applications demonstrating advanced data structures and algorithms",
            "Built full-stack web applications using HTML, CSS, JavaScript, and modern frameworks",
            "Gained expertise in SQL and database management for both relational and non-relational systems",
            "Applied analytical thinking skills from chemistry background to optimize code performance"
        ],
        tech: ["Java", "C++", "JavaScript", "HTML/CSS", "SQL"]
    },
    {
        title: "Plastic Blowing HDPE & PP Section Supervisor",
        company: "Hoka Industry - Douala, Cameroon",
        period: "May 2020 - September 2022",
        description: [
            "Led cross-functional teams in plastic manufacturing operations, ensuring production targets were met",
            "Provided guidance and support to team members, creating positive and productive work atmosphere",
            "Maintained accurate performance records and implemented training programs for employee development",
            "Identified process improvement opportunities and developed actionable strategies to enhance team performance",
            "Applied analytical thinking and problem-solving skills to optimize manufacturing processes"
        ],
        tech: ["Team Leadership", "Process Optimization", "Quality Management", "Performance Analysis"]
    },
    {
        title: "Quality Control Inspector & Production Manager",
        company: "Atlas Negoce - Douala, Cameroon",
        period: "June 2015 - May 2020",
        description: [
            "Created comprehensive quality control plans ensuring production standards aligned with project requirements",
            "Managed research and development initiatives to drive innovation and enhance manufacturing processes",
            "Led operational audits and monitored operations to ensure cost efficiency, quality, and timely delivery",
            "Conducted performance evaluations and provided constructive feedback to support employee growth",
            "Implemented systematic improvements that increased productivity and product quality metrics"
        ],
        tech: ["Quality Control", "R&D Management", "Process Improvement", "Operations Management"]
    },
    {
        title: "Laboratory Technician",
        company: "Madar Group & SICCO - Damascus, Syria",
        period: "November 2006 - September 2014",
        description: [
            "Performed complex sample analysis using advanced spectrophotometry and chromatography techniques",
            "Managed multiple analytical projects simultaneously while consistently meeting strict deadlines",
            "Prepared detailed analysis reports and effectively communicated findings to internal teams and external clients",
            "Collaborated with production and R&D teams to optimize processes based on analytical results",
            "Maintained meticulous records and ensured compliance with laboratory safety standards"
        ],
        tech: ["Analytical Chemistry", "Spectrophotometry", "Chromatography", "Data Analysis"]
    }
];

const Experience: React.FC = () => {
    return (
        <section id="experience" className="py-20 bg-dark-900 relative">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">My <span className="text-gradient">Experience</span></h2>
                    <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
                </motion.div>

                <div className="space-y-12">
                    {experiences.map((exp, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="glass p-8 rounded-2xl hover:border-primary/50 transition-colors duration-300"
                        >
                            <div className="flex flex-col md:flex-row justify-between items-center md:items-center mb-6">
                                <div className="text-center md:text-left">
                                    <h3 className="text-2xl font-bold text-white mb-2">{exp.title}</h3>
                                    <p className="text-primary font-medium text-lg">{exp.company}</p>
                                </div>
                                <span className="inline-block bg-slate-800 text-slate-300 px-4 py-1 rounded-full text-sm font-medium mt-2 md:mt-0 border border-slate-700">
                                    {exp.period}
                                </span>
                            </div>

                            <ul className="space-y-3 mb-6">
                                {exp.description.map((item, i) => (
                                    <li key={i} className="flex items-start text-slate-300 text-center md:text-left">
                                        <span className="mr-3 text-primary mt-1.5 hidden md:inline">•</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                {exp.tech.map((tech, i) => (
                                    <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm border border-primary/20">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Experience;
