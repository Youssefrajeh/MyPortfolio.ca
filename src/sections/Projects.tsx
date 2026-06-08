import React, { useState } from 'react';
import { FolderIcon } from '../components/RetroIcons';

const projectsData = [
    {
        title: "Breast Cancer Decision Tree",
        description: "Machine learning project using decision trees to analyze breast cancer data, featuring data preprocessing, model training, and accuracy evaluation.",
        tech: ["C++", "Machine Learning", "Data Analysis"],
        image: "images/Breast-cancer-awareness-month-Background-by-ojosujono96-scaled.webp",
        github: "https://github.com/Youssefrajeh/BreastCancerDecisionTree",
        category: "cpp"
    },
    {
        title: "FileUsage Analyzer",
        description: "Command-line utility built in C++ to analyze file system usage, providing detailed statistics and helping optimize storage management.",
        tech: ["C++", "File Systems", "CLI"],
        image: "images/N1-0921-Windows-CMD-Commands-You-Need-to-Know-blog-image-2.webp",
        github: "https://github.com/Youssefrajeh/fileusage",
        category: "cpp"
    },
    {
        title: "Newcomb-Benford Statistics",
        description: "Statistical analysis tool implementing Benford's Law to detect fraud and anomalies in numerical data sets using C++ algorithms.",
        tech: ["images/Benfords_law_frequencies.webp"],
        github: "https://github.com/Youssefrajeh/nbstats",
        category: "cpp"
    },
    {
        title: "Expression Evaluator",
        description: "Mathematical expression parser and evaluator built in C++ using advanced algorithms for handling complex mathematical operations.",
        tech: ["C++", "Algorithms", "Parser"],
        image: "images/0205_Stork_scripting_language_Pt2_Lina_Newsletter___blog.png",
        github: "https://github.com/Youssefrajeh/Expression-Evaluator",
        category: "cpp"
    },
    {
        title: "XO Game",
        description: "Interactive Tic-Tac-Toe game built with HTML, CSS, and JavaScript featuring responsive design and smooth animations.",
        tech: ["HTML", "CSS", "JavaScript"],
        image: "images/xo.png",
        github: "https://github.com/Youssefrajeh/XO",
        category: "web"
    },
    {
        title: "Prayer Times",
        description: "Web application providing accurate prayer times based on location with beautiful UI and real-time updates for Muslims worldwide.",
        tech: ["JavaScript", "API", "Geolocation"],
        image: "images/prayertime.jpg",
        github: "https://github.com/Youssefrajeh/Prayer-Times",
        category: "web"
    },
    {
        title: "Microwave Simulator",
        description: "Java application simulating microwave oven functionality with GUI, timer controls, and realistic cooking operations.",
        tech: ["Java", "Swing", "GUI"],
        image: "images/microwave.jpg",
        github: "https://github.com/Youssefrajeh/Microwave",
        category: "java"
    },
    {
        title: "Android Assignment",
        description: "Native Android application built with Kotlin featuring modern UI components, user interactions, and following Android development best practices.",
        tech: ["Kotlin", "Android", "Mobile"],
        image: "images/android.png",
        github: "https://github.com/Youssefrajeh/AndroidAssignment",
        category: "mobile"
    },
    {
        title: "Grades Tracking System",
        description: "JSON-based grade tracking system with C# console application featuring data validation, course management, evaluation tracking, and automated grade calculations.",
        tech: ["C#", ".NET", "JSON"],
        image: "images/grades_tracking.png",
        github: "https://github.com/Youssefrajeh/Grades-Tracking-System",
        category: "csharp"
    },
    {
        title: "Full Stack Application",
        description: "Complete full-stack web application featuring frontend and backend integration, database management, user authentication, and modern development practices.",
        tech: ["React", "Node.js", "MongoDB"],
        image: "images/fullStack.png",
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

const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'cpp', label: 'C++ Apps' },
    { id: 'web', label: 'Web Apps' },
    { id: 'java', label: 'Java Apps' },
    { id: 'mobile', label: 'Mobile Apps' },
    { id: 'csharp', label: 'C# Apps' },
    { id: 'fullstack', label: 'Full Stack' },
];

const Projects: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedProject, setSelectedProject] = useState<string | null>(null);
    const [showProperties, setShowProperties] = useState<any | null>(null);

    const filteredProjects = selectedCategory === 'all' 
        ? projectsData 
        : projectsData.filter(p => p.category === selectedCategory);

    const handleProjectClick = (title: string) => {
        setSelectedProject(title);
    };

    const handleProjectDoubleClick = (project: any) => {
        setShowProperties(project);
    };

    return (
        <div className="flex flex-col h-full bg-[#c0c0c0] text-black font-sans text-xs select-none" style={{ minHeight: '380px' }}>
            {/* Explorer Toolbar */}
            <div className="win95-raised p-1 border-b-2 border-[#808080] flex items-center justify-between text-black gap-2 select-none">
                <div className="flex items-center gap-1.5">
                    <button 
                        onClick={() => setSelectedCategory('all')}
                        disabled={selectedCategory === 'all'}
                        className="win95-button py-0.5 px-2 font-bold flex items-center gap-1 text-[11px]"
                    >
                        <span>⬆</span> Root
                    </button>
                    <div className="win95-sunken bg-white px-2 py-0.5 border flex items-center min-w-[200px] text-[11px] font-mono truncate select-text">
                        <span className="text-[#808080] mr-1">Address:</span>
                        C:\Projects{selectedCategory !== 'all' ? `\\${categories.find(c => c.id === selectedCategory)?.label}` : ''}
                    </div>
                </div>
            </div>

            {/* Split Explorer Pane */}
            <div className="flex-1 flex overflow-hidden border-2 win95-sunken bg-white min-h-[260px]">
                {/* Left Tree Pane */}
                <div className="w-40 border-r border-[#808080] bg-[#f0f0f0] p-1.5 overflow-y-auto select-none">
                    <div className="font-bold mb-1.5 text-[10px] text-gray-500 uppercase tracking-wider">Directories</div>
                    <div className="space-y-1">
                        {categories.map((cat) => (
                            <div
                                key={cat.id}
                                onClick={() => {
                                    setSelectedCategory(cat.id);
                                    setSelectedProject(null);
                                }}
                                className={`flex items-center gap-1.5 px-1.5 py-1 rounded cursor-pointer ${
                                    selectedCategory === cat.id ? 'bg-[#000080] text-white font-bold' : 'hover:bg-[#dfdfdf]'
                                }`}
                            >
                                <FolderIcon size={14} />
                                <span className="truncate">{cat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Folder Content Grid */}
                <div className="flex-1 p-3 overflow-y-auto bg-white">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {filteredProjects.map((project) => {
                            const isSelected = selectedProject === project.title;
                            return (
                                <div
                                    key={project.title}
                                    onClick={() => handleProjectClick(project.title)}
                                    onDoubleClick={() => handleProjectDoubleClick(project)}
                                    className={`flex flex-col items-center text-center p-2 rounded cursor-pointer transition-colors max-w-[120px] mx-auto ${
                                        isSelected ? 'bg-[#000080] text-white' : 'hover:bg-[#dfdfdf]'
                                    }`}
                                >
                                    {/* Executable icon */}
                                    <div className="w-10 h-10 bg-[#e0e0e0] border border-gray-400 rounded flex items-center justify-center text-2xl shadow-sm mb-1.5 select-none">
                                        ⚙️
                                    </div>
                                    <span className="font-semibold text-xs leading-snug line-clamp-2">{project.title}.exe</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Explorer Status Bar */}
            <div className="win95-sunken-gray py-1.5 px-2.5 flex justify-between items-center text-[10px] text-gray-700 border-2 select-none">
                <span>{filteredProjects.length} object(s)</span>
                <span className="font-semibold text-[#000080] truncate max-w-[280px]">
                    {selectedProject 
                        ? `Selected: ${selectedProject}.exe (Double-click to open properties)` 
                        : 'Select a project to inspect'}
                </span>
            </div>

            {/* Properties Dialog Box Modal */}
            {showProperties && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 pointer-events-auto">
                    <div className="win95-raised p-1 w-[380px] flex flex-col border-2 select-none text-black">
                        {/* Title Bar */}
                        <div className="flex items-center justify-between p-1 bg-gradient-to-r from-[#000080] to-[#1084d0] text-white font-bold text-xs select-none">
                            <span className="flex items-center gap-1.5">⚙️ {showProperties.title} Properties</span>
                            <button 
                                onClick={() => setShowProperties(null)}
                                className="win95-button w-4 h-4 p-0 text-xs font-bold leading-none flex items-center justify-center"
                            >
                                X
                            </button>
                        </div>

                        {/* Dialog Body */}
                        <div className="p-3 bg-[#c0c0c0] flex-1 flex flex-col gap-3">
                            <div className="flex gap-3 items-start">
                                {/* Thumbnail */}
                                <div className="win95-sunken bg-white p-[2px] w-24 h-16 border-2 flex items-center justify-center flex-shrink-0">
                                    <img 
                                        src={showProperties.image} 
                                        alt={showProperties.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            const parent = target.parentElement;
                                            if (parent) {
                                                const fallback = document.createElement('div');
                                                fallback.className = 'text-xs font-bold text-gray-400';
                                                fallback.textContent = 'IMG';
                                                parent.appendChild(fallback);
                                            }
                                        }}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h2 className="font-bold text-sm truncate">{showProperties.title}</h2>
                                    <p className="text-[10px] text-gray-600">Type: Application (.exe)</p>
                                    <p className="text-[10px] text-gray-600">Category: {showProperties.category.toUpperCase()}</p>
                                </div>
                            </div>

                            {/* Divider line */}
                            <div className="h-[1px] bg-[#808080] border-b border-white" />

                            {/* Details sunken tab */}
                            <div className="win95-sunken bg-white p-2.5 border-2 text-[11px] h-32 overflow-y-auto select-text">
                                <div className="font-bold mb-1 border-b border-gray-200 pb-1">Description:</div>
                                <p className="text-gray-800 leading-relaxed mb-2.5">{showProperties.description}</p>
                                
                                <div className="font-bold mb-1 border-b border-gray-200 pb-1">Technologies Used:</div>
                                <div className="flex flex-wrap gap-1.5">
                                    {Array.isArray(showProperties.tech) && showProperties.tech.map((t: string, i: number) => (
                                        <span key={i} className="text-[9px] bg-gray-100 border border-gray-400 px-1 rounded">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-2 mt-1 select-none">
                                <a 
                                    href={showProperties.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="win95-button text-xs font-semibold py-1 px-4 text-black border-2 flex items-center justify-center gap-1.5 hover:no-underline"
                                >
                                    💻 View GitHub Code
                                </a>
                                <button 
                                    onClick={() => setShowProperties(null)}
                                    className="win95-button text-xs font-semibold py-1 px-4 text-black border-2"
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Projects;
