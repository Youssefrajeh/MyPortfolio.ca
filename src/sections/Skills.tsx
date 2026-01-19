import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCode, FaGlobe, FaDatabase, FaNetworkWired } from 'react-icons/fa';

const skillsData = {
    programming: [
        { name: "C++", icon: "⚙️", level: 90 },
        { name: "Java", icon: "☕", level: 85 },
        { name: "Python", icon: "🐍", level: 80 },
        { name: "C#", icon: "#️⃣", level: 75 }
    ],
    web: [
        { name: "HTML5", icon: "🌐", level: 95 },
        { name: "CSS3", icon: "🎨", level: 90 },
        { name: "JavaScript", icon: "📜", level: 85 },
        { name: "React", icon: "⚛️", level: 80 },
        { name: "Node.js", icon: "🟢", level: 75 }
    ],
    database: [
        { name: "SQL", icon: "🗄️", level: 85 },
        { name: "MongoDB", icon: "🍃", level: 80 },
        { name: "Oracle", icon: "🔴", level: 75 }
    ],
    networking: [
        { name: "TCP/IP", icon: "🔌", level: 80 },
        { name: "Linux", icon: "🐧", level: 75 },
        { name: "Git", icon: "📦", level: 85 }
    ]
};

const Skills: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<string>('all');

    const categories = [
        { id: 'all', label: 'All Skills' },
        { id: 'programming', label: 'Programming', icon: FaCode },
        { id: 'web', label: 'Web Dev', icon: FaGlobe },
        { id: 'database', label: 'Database', icon: FaDatabase },
        { id: 'networking', label: 'Networking', icon: FaNetworkWired },
    ];

    const getFilteredSkills = () => {
        if (activeCategory === 'all') {
            return Object.values(skillsData).flat();
        }
        return skillsData[activeCategory as keyof typeof skillsData];
    };

    return (
        <section id="skills" className="py-20 bg-dark-950 relative overflow-hidden">
            {/* Background decoration */}
            <div className={`absolute inset-0 bg-[url('${import.meta.env.BASE_URL}grid.svg')] opacity-10`}></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Skills & <span className="text-gradient">Expertise</span></h2>
                    <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
                </motion.div>

                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-6 py-2 rounded-full transition-all duration-300 flex items-center gap-2 ${activeCategory === cat.id
                                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                                }`}
                        >
                            {cat.icon && <cat.icon />}
                            {cat.label}
                        </button>
                    ))}
                </div>

                <motion.div
                    layout
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
                >
                    <AnimatePresence mode='popLayout'>
                        {getFilteredSkills().map((skill) => (
                            <motion.div
                                key={skill.name}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                className="glass p-3 rounded-xl hover:border-primary/50 transition-all duration-300 group cursor-default text-center"
                            >
                                <div className="flex flex-col items-center justify-between mb-2">
                                    <span className="text-2xl mb-1">{skill.icon}</span>
                                    <span className="text-slate-400 font-mono text-xs">{skill.level}%</span>
                                </div>
                                <h3 className="text-sm font-bold text-white mb-2 group-hover:text-primary transition-colors">{skill.name}</h3>
                                <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full transition-all duration-1000 ease-out"
                                        style={{
                                            width: `${skill.level}%`,
                                            background: 'linear-gradient(to right, #60a5fa, #a78bfa)'
                                        }}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
};

export default Skills;
