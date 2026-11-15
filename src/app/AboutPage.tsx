import { Link } from 'react-router';
import { focusAreas, positioning, profiles } from '../content/profile';

export function AboutPage() {
  return (
    <article className="section site-container about-page" aria-labelledby="about-heading">
      <Link className="small-link" to="/">
        ← Back to home
      </Link>
      <div className="page-intro">
        <p className="mono accent">About / Based in the Netherlands</p>
        <h1 id="about-heading">
          Full-stack foundation.
          <br />
          <em>AI-focused practice.</em>
        </h1>
        <p>
          I’m Luc Joosten, a software engineer connecting application architecture, user experience,
          data systems and AI integration.
        </p>
      </div>
      <div className="about-work">
        <section className="about-approach" aria-labelledby="approach-heading">
          <p className="mono muted">01 / Engineering approach</p>
          <h2 id="approach-heading">
            Practical solutions.
            <br />
            Clear boundaries.
          </h2>
          <p>{positioning.approach}</p>
          <Link className="small-link" to="/projects">
            Explore my projects <span aria-hidden="true">→</span>
          </Link>
        </section>
        <section className="about-current" aria-labelledby="current-heading">
          <p className="mono muted">02 / Current work</p>
          <h2 id="current-heading">{positioning.role}</h2>
          <dl>
            <div>
              <dt>Organisation</dt>
              <dd>{positioning.employer}</dd>
            </div>
            <div>
              <dt>Product</dt>
              <dd>{positioning.product}</dd>
            </div>
            <div>
              <dt>Domain</dt>
              <dd>{positioning.domain}</dd>
            </div>
          </dl>
          <p>{positioning.currentWork}</p>
        </section>
      </div>
      <section className="about-focus" aria-labelledby="focus-heading">
        <div className="section-head">
          <div>
            <p className="mono muted">03 / Technical focus</p>
            <h2 id="focus-heading">
              Across the stack<span className="accent">.</span>
            </h2>
          </div>
        </div>
        <div className="skills-grid">
          {focusAreas.map((area, index) => (
            <div className="skill" key={area.title}>
              <span className="mono accent">0{index + 1}</span>
              <h3>{area.title}</h3>
              <p>{area.description}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="about-connect" aria-labelledby="connect-heading">
        <p className="mono muted">04 / Connect</p>
        <h2 id="connect-heading">
          Let’s talk engineering<span className="accent">.</span>
        </h2>
        <p>Find my work on GitHub or get in touch through LinkedIn.</p>
        <div className="contact-actions">
          <a className="btn blue" href={profiles.linkedin} target="_blank" rel="noreferrer">
            LinkedIn <span aria-hidden="true">↗</span>
          </a>
          <a className="btn secondary" href={profiles.github} target="_blank" rel="noreferrer">
            GitHub <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    </article>
  );
}
