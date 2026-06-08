import React, { useState } from 'react';

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
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [fontFamily, setFontFamily] = useState('Times New Roman');
    const [fontSize, setFontSize] = useState('12');
    const [align, setAlign] = useState<'left' | 'center' | 'right'>('left');

    const pageStyle: React.CSSProperties = {
        fontFamily: fontFamily === 'MS Sans Serif' ? '"R95 Sans Serif 8pt", "MS Sans Serif", Tahoma, sans-serif' : fontFamily,
        fontSize: `${fontSize}px`,
        fontWeight: isBold ? 'bold' : 'normal',
        fontStyle: isItalic ? 'italic' : 'normal',
        textDecoration: isUnderline ? 'underline' : 'none',
        textAlign: align,
        color: '#000000',
    };

    return (
        <div className="flex flex-col h-full bg-[#c0c0c0] text-black text-xs select-text" style={{ minHeight: '350px' }}>
            {/* WordPad Toolbar */}
            <div className="win95-raised p-1 border-b-2 border-[#808080] flex flex-wrap items-center gap-1.5 select-none mb-2 text-black">
                {/* Font Selector */}
                <select 
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="win95-sunken bg-white text-black text-xs px-1 py-0.5 border"
                >
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="MS Sans Serif">MS Sans Serif</option>
                    <option value="Arial">Arial</option>
                    <option value="Courier New">Courier New</option>
                </select>

                {/* Font Size Selector */}
                <select 
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                    className="win95-sunken bg-white text-black text-xs px-1 py-0.5 border w-12"
                >
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="14">14</option>
                    <option value="16">16</option>
                    <option value="18">18</option>
                </select>

                {/* Separator vertical */}
                <div className="w-[1px] h-[16px] bg-[#808080] border-r border-white mx-0.5" />

                {/* B, I, U buttons */}
                <button 
                    onClick={() => setIsBold(!isBold)}
                    className={`win95-button w-6 h-6 flex items-center justify-center p-0 font-bold border-2 ${isBold ? 'win95-button-pressed font-black' : ''}`}
                    title="Bold"
                >
                    B
                </button>
                <button 
                    onClick={() => setIsItalic(!isItalic)}
                    className={`win95-button w-6 h-6 flex items-center justify-center p-0 italic border-2 ${isItalic ? 'win95-button-pressed' : ''}`}
                    title="Italic"
                >
                    I
                </button>
                <button 
                    onClick={() => setIsUnderline(!isUnderline)}
                    className={`win95-button w-6 h-6 flex items-center justify-center p-0 underline border-2 ${isUnderline ? 'win95-button-pressed' : ''}`}
                    title="Underline"
                >
                    U
                </button>

                {/* Separator vertical */}
                <div className="w-[1px] h-[16px] bg-[#808080] border-r border-white mx-0.5" />

                {/* Alignments */}
                <button 
                    onClick={() => setAlign('left')}
                    className={`win95-button w-6 h-6 flex items-center justify-center p-0 border-2 ${align === 'left' ? 'win95-button-pressed' : ''}`}
                    title="Align Left"
                >
                    ▤
                </button>
                <button 
                    onClick={() => setAlign('center')}
                    className={`win95-button w-6 h-6 flex items-center justify-center p-0 border-2 ${align === 'center' ? 'win95-button-pressed' : ''}`}
                    title="Align Center"
                >
                    ▥
                </button>
                <button 
                    onClick={() => setAlign('right')}
                    className={`win95-button w-6 h-6 flex items-center justify-center p-0 border-2 ${align === 'right' ? 'win95-button-pressed' : ''}`}
                    title="Align Right"
                >
                    ▥
                </button>
            </div>

            {/* WordPad Paper Sheet Page Container */}
            <div className="flex-1 overflow-auto bg-[#808080] p-4 flex justify-center">
                <div 
                    style={pageStyle} 
                    className="w-full max-w-[800px] bg-white p-8 shadow-md border border-black min-h-[500px] select-text"
                >
                    <h1 className="text-2xl font-bold border-b border-black pb-2 mb-6">RESUME - WORK EXPERIENCE</h1>
                    
                    <div className="space-y-6">
                        {experiences.map((exp, index) => (
                            <div key={index} className="border-b border-[#dfdfdf] pb-4 last:border-0 last:pb-0">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                                    <div>
                                        <h2 className="text-base font-bold text-black">{exp.title}</h2>
                                        <h3 className="text-xs text-[#000080] font-semibold">{exp.company}</h3>
                                    </div>
                                    <span className="text-[11px] text-gray-600 bg-gray-100 border border-gray-300 px-2 py-0.5 rounded font-mono mt-1 sm:mt-0">
                                        {exp.period}
                                    </span>
                                </div>
                                
                                <ul className="list-disc pl-5 space-y-1 mt-2 text-xs leading-relaxed text-gray-800">
                                    {exp.description.map((item, i) => (
                                        <li key={i} className="pl-1">
                                            {item}
                                        </li>
                                    ))}
                                </ul>

                                <div className="flex flex-wrap gap-1.5 mt-3 select-none">
                                    <span className="font-bold text-[10px] text-gray-700 mr-1 self-center">Skills used:</span>
                                    {exp.tech.map((tech, i) => (
                                        <span key={i} className="text-[10px] bg-[#dfdfdf] border border-[#808080] px-1.5 py-0.5 text-black">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Experience;
