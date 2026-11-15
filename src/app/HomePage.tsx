import { Link } from 'react-router';
import { focusAreas, profiles, positioning } from '../content/profile';
import { Projects } from '../components/Projects';

export function HomePage() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="site-container hero-inner">
          <p className="eyebrow mono">
            <span className="dot" aria-hidden="true" />
            Software engineer · AI & full-stack
          </p>
          <h1 id="hero-title">
            I build software
            <br />
            that <em>holds up.</em>
          </h1>
          <div className="hero-bottom">
            <p className="intro">
              Hi, I’m <strong>Luc Joosten.</strong> I develop AI-powered applications and the
              full-stack systems behind them — from robust APIs and thoughtful interfaces to cloud
              infrastructure. Currently engineering at Crowe Netherlands.
            </p>
            <div className="hero-aside">
              <p className="badge-line">
                Based in the Netherlands
                <br />
                Python · TypeScript · Azure
              </p>
              <a href="#projects" className="btn blue">
                Explore my work <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>
      <div className="tech-strip">
        <div className="site-container tech-line mono">
          {[
            'Python',
            'FastAPI',
            'TypeScript',
            'React',
            'PostgreSQL',
            'Azure',
            'AI Engineering',
          ].map((tech, index) => (
            <span className="tech-item" key={tech}>
              {index > 0 && (
                <span className="sep" aria-hidden="true">
                  ✦
                </span>
              )}
              {tech}
            </span>
          ))}
        </div>
      </div>
      <section id="projects" className="section site-container" aria-labelledby="projects-title">
        <div className="section-head">
          <div>
            <p className="mono muted">01 / Selected work</p>
            <h2 id="projects-title">
              Engineering in
              <br />
              practice<span className="accent">.</span>
            </h2>
          </div>
          <p>
            Projects that explore how software can be more reliable, more understandable, and easier
            to work with.
          </p>
        </div>
        <Projects />
        <Link className="small-link projects-index-link" to="/projects">
          View all projects <span aria-hidden="true">→</span>
        </Link>
      </section>
      <section
        id="experience"
        className="section site-container"
        aria-labelledby="experience-title"
      >
        <div className="section-head">
          <div>
            <p className="mono muted">02 / About & experience</p>
            <h2 id="experience-title">
              From idea to
              <br />
              production<span className="accent">.</span>
            </h2>
          </div>
        </div>
        <div className="work-grid">
          <div>
            <h3>
              {positioning.heading}
              <br />
              <span className="muted">{positioning.emphasis}</span>
            </h3>
            <p>{positioning.approach}</p>
            <a className="small-link" href={profiles.github} target="_blank" rel="noreferrer">
              Explore my GitHub <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div>
            <p className="mono muted">Current engineering work</p>
            <ul className="experience-list">
              <li>
                <strong>{positioning.role}</strong>
                <span>{positioning.employer}</span>
              </li>
              <li>
                <strong>Product focus</strong>
                <span>{positioning.product}</span>
              </li>
              <li>
                <strong>Domain</strong>
                <span>{positioning.domain}</span>
              </li>
            </ul>
            <Link className="small-link" to="/about">
              More about my work <span aria-hidden="true">→</span>
            </Link>
            <p className="experience-copy">{positioning.currentWork}</p>
          </div>
        </div>
      </section>
      <section id="expertise" className="section site-container" aria-labelledby="expertise-title">
        <div className="section-head">
          <div>
            <p className="mono muted">03 / What I work with</p>
            <h2 id="expertise-title">
              Technical focus<span className="accent">.</span>
            </h2>
          </div>
          <p>
            Tools evolve. Engineering principles, clear contracts, and good operational practices
            last longer.
          </p>
        </div>
        <div className="skills-grid">
          {focusAreas.map((area, i) => (
            <div className="skill" key={area.title}>
              <span className="mono accent">0{i + 1}</span>
              <h3>{area.title}</h3>
              <p>{area.description}</p>
            </div>
          ))}
        </div>
      </section>
      <section id="writing" className="section site-container" aria-labelledby="writing-title">
        <div className="section-head">
          <div>
            <p className="mono muted">04 / Engineering notes</p>
            <h2 id="writing-title">
              Work becomes
              <br />
              knowledge<span className="accent">.</span>
            </h2>
          </div>
          <p>Technical findings, architectural decisions, and lessons from building software.</p>
        </div>
        <div className="writing-empty">
          <span className="mono accent">In preparation</span>
          <p>
            Articles and engineering notes will appear here as they’re reviewed and published. Each
            will be grounded in real engineering work.
          </p>
        </div>
      </section>
      <section id="contact" className="contact site-container" aria-labelledby="contact-title">
        <p className="mono muted">05 / Connect</p>
        <h2 id="contact-title">
          Let’s build something
          <br />
          <em>meaningful.</em>
        </h2>
        <div className="contact-bottom">
          <p>
            Interested in software engineering, AI systems, or developer tooling? You can find my
            work on GitHub or get in touch through LinkedIn.
          </p>
          <div className="contact-actions">
            <a className="btn blue" href={profiles.linkedin} target="_blank" rel="noreferrer">
              LinkedIn <span aria-hidden="true">↗</span>
            </a>
            <a className="btn secondary" href={profiles.github} target="_blank" rel="noreferrer">
              GitHub <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
