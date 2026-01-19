import Navbar from '../components/Navbar';
import Hero from '../sections/Hero';
import About from '../sections/About';
import Experience from '../sections/Experience';
import Skills from '../sections/Skills';
import Projects from '../sections/Projects';
import Contact from '../sections/Contact';

function Portfolio() {
  return (
    <div className="bg-dark-900 min-h-screen text-slate-100">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <footer className="bg-dark-950 py-8 text-center text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} Youssef Rajeh. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Portfolio;
