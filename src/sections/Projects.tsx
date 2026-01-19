import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaCode, FaGlobe, FaMobile, FaDatabase } from 'react-icons/fa';

const projects = [
    {
        title: "Breast Cancer Decision Tree",
        description: "Machine learning project using decision trees to analyze breast cancer data, featuring data preprocessing, model training, and accuracy evaluation.",
        tech: ["C++", "Machine Learning", "Data Analysis"],
        image: `${import.meta.env.BASE_URL}images/Breast-cancer-awareness-month-Background-by-ojosujono96-scaled.webp`,
        github: "https://github.com/Youssefrajeh/BreastCancerDecisionTree",
        category: "cpp"
    },
    {
        title: "FileUsage Analyzer",
        description: "Command-line utility built in C++ to analyze file system usage, providing detailed statistics and helping optimize storage management.",
        tech: ["C++", "File Systems", "CLI"],
        image: `${import.meta.env.BASE_URL}images/N1-0921-Windows-CMD-Commands-You-Need-to-Know-blog-image-2.webp`,
        github: "https://github.com/Youssefrajeh/fileusage",
        category: "cpp"
    },
    {
        title: "Newcomb-Benford Statistics",
        description: "Statistical analysis tool implementing Benford's Law to detect fraud and anomalies in numerical data sets using C++ algorithms.",
        tech: ["C++", "Statistics", "Fraud Detection"],
        image: `${import.meta.env.BASE_URL}images/Benfords_law_frequencies.webp`,
        github: "https://github.com/Youssefrajeh/nbstats",
        category: "cpp"
    },
    {
        title: "Expression Evaluator",
        description: "Mathematical expression parser and evaluator built in C++ using advanced algorithms for handling complex mathematical operations.",
        tech: ["C++", "Algorithms", "Parser"],
        image: `${import.meta.env.BASE_URL}images/0205_Stork_scripting_language_Pt2_Lina_Newsletter___blog.png`,
        github: "https://github.com/Youssefrajeh/Expression-Evaluator",
        category: "cpp"
    },
    {
        title: "XO Game",
        description: "Interactive Tic-Tac-Toe game built with HTML, CSS, and JavaScript featuring responsive design and smooth animations.",
        tech: ["HTML", "CSS", "JavaScript"],
        image: `${import.meta.env.BASE_URL}images/xo.png`,
        github: "https://github.com/Youssefrajeh/XO",
        category: "web"
    },
    {
        title: "Prayer Times",
        description: "Web application providing accurate prayer times based on location with beautiful UI and real-time updates for Muslims worldwide.",
        tech: ["JavaScript", "API", "Geolocation"],
        image: `${import.meta.env.BASE_URL}images/prayertime.jpg`,
        github: "https://github.com/Youssefrajeh/Prayer-Times",
        category: "web"
    },
    {
        title: "Microwave Simulator",
        description: "Java application simulating microwave oven functionality with GUI, timer controls, and realistic cooking operations.",
        tech: ["Java", "Swing", "GUI"],
        image: `${import.meta.env.BASE_URL}images/microwave.jpg`,
        github: "https://github.com/Youssefrajeh/Microwave",
        category: "java"
    },
    {
        title: "Android Assignment",
        description: "Native Android application built with Kotlin featuring modern UI components, user interactions, and following Android development best practices.",
        tech: ["Kotlin", "Android", "Mobile"],
        image: `${import.meta.env.BASE_URL}images/android.png`,
        github: "https://github.com/Youssefrajeh/AndroidAssignment",
        category: "mobile"
    },
    {
        title: "Grades Tracking System",
        description: "JSON-based grade tracking system with C# console application featuring data validation, course management, evaluation tracking, and automated grade calculations.",
        tech: ["C#", ".NET", "JSON"],
        image: `${import.meta.env.BASE_URL}images/grades_tracking.png`,
        github: "https://github.com/Youssefrajeh/Grades-Tracking-System",
        category: "csharp"
    },
    {
        title: "Full Stack Application",
        description: "Complete full-stack web application featuring frontend and backend integration, database management, user authentication, and modern development practices.",
        tech: ["React", "Node.js", "MongoDB"],
        image: `${import.meta.env.BASE_URL}images/fullStack.png`,
        github: "https://github.com/Youssefrajeh/Full_Satck",
        category: "fullstack"
    },
    {
        title: "Student Loan Calculator",
        description: "Java application for managing student loans, calculating monthly payments, and handling invalid input with custom exceptions.",
        tech: ["Java", "OOP", "Exception Handling"],
        image: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
        github: "https://github.com/Youssefrajeh/Student-Loan-Calculator",
        category: "java"
    },
];

const Projects: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<string>('all');

    const categories = [
        { id: 'all', label: 'All Projects' },
        { id: 'cpp', label: 'C++', icon: FaCode },
        { id: 'web', label: 'Web', icon: FaGlobe },
        { id: 'java', label: 'Java', icon: FaCode },
        { id: 'mobile', label: 'Mobile', icon: FaMobile },
        { id: 'csharp', label: 'C#', icon: FaCode },
        { id: 'fullstack', label: 'Full Stack', icon: FaDatabase },
    ];

    const getFilteredProjects = () => {
        if (activeCategory === 'all') {
            return projects;
        }
        return projects.filter(project => project.category === activeCategory);
    };

    return (
        <section id="projects" className="py-20 bg-dark-900 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured <span className="text-gradient">Projects</span></h2>
                    <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
                </motion.div>

                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2 text-sm ${activeCategory === cat.id
                                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                                }`}
                        >
                            {cat.icon && <cat.icon />}
                            {cat.label}
                        </button>
                    ))}
                </div>

                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <AnimatePresence mode='popLayout'>
                        {getFilteredProjects().map((project) => (
                            <motion.div
                                key={project.title}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                className="glass rounded-xl overflow-hidden group hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300"
                            >
                                <div className="relative h-32 overflow-hidden bg-slate-800">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            const parent = target.parentElement;
                                            if (parent) {
                                                const fallback = document.createElement('div');
                                                fallback.className = 'absolute inset-0 flex items-center justify-center text-slate-600 text-2xl font-bold opacity-20';
                                                fallback.textContent = project.title[0];
                                                parent.appendChild(fallback);
                                            }
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent opacity-60"></div>
                                </div>

                                <div className="p-3 text-center md:text-left">
                                    <h3 className="text-base font-bold text-white mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                                    <p className="text-slate-400 mb-2 line-clamp-2 text-xs">{project.description}</p>

                                    <div className="flex flex-wrap gap-1 mb-3 justify-center md:justify-start">
                                        {project.tech.map((t, i) => (
                                            <span key={i} className="text-xs px-2 py-0.5 bg-slate-800 text-primary rounded border border-slate-700">
                                                {t}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex gap-4 justify-center md:justify-start">
                                        <a href={project.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-300 hover:text-primary transition-colors text-sm">
                                            <FaGithub /> View Code
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
};

export default Projects;
