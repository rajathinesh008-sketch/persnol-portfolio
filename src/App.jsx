import React, { useState } from "react";
import "./App.css";

function App() {
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "Personal Portfolio Website",
      description: "A responsive portfolio website using React, HTML and CSS.",
      link: "#"
    },
    {
      id: 2,
      title: "Web Development Project",
      description: "A website project created to improve my frontend development skills.",
      link: "#"
    }
  ]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [editId, setEditId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert("Please enter project title and description");
      return;
    }

    if (editId !== null) {
      setProjects(projects.map((project) =>
        project.id === editId
          ? { ...project, title, description, link }
          : project
      ));
      setEditId(null);
    } else {
      setProjects([
        ...projects,
        { id: Date.now(), title, description, link }
      ]);
    }

    setTitle("");
    setDescription("");
    setLink("");
  };

  const handleEdit = (project) => {
    setTitle(project.title);
    setDescription(project.description);
    setLink(project.link);
    setEditId(project.id);
    document.getElementById("project-form").scrollIntoView({
      behavior: "smooth"
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      setProjects(projects.filter((project) => project.id !== id));
    }
  };

  const skills = [
    { name: "HTML", level: 70 },
    { name: "CSS", level: 60 },
    { name: "JavaScript", level: 50 },
    { name: "React", level: 40 },
    { name: "C Programming", level: 50 }
  ];

  return (
    <div className="portfolio">

      {/* Navigation */}
      <nav className="navbar">
        <h2>Dinesh Portfolio</h2>
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#education">Education</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#certifications">Certificates</a>
          <a href="#experience">Experience</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      {/* Home */}
      <section id="home" className="hero">
        <img
          src="/profile.jpg"
          alt="Dinesh Profile"
          className="profile-img"
        />

        <h1>Hello, I'm <span>Dinesh</span></h1>
        <h2>Computer Science Student</h2>
        <p>Creative Thinker | Future Developer | Tech Enthusiast</p>

        <a href="#about" className="btn">Explore More</a>
        <a href="/resume.pdf" download className="btn secondary-btn">
          Download Resume
        </a>
      </section>

      {/* About */}
      <section id="about" className="section">
        <h2>About Me</h2>
        <p>
          I am Dinesh, a Computer Science student interested in
          web development, programming and modern technology.
          I enjoy learning new technologies and creating useful
          digital projects. My career objective is to become a
          professional software developer and contribute to
          innovative projects.
        </p>
      </section>

      {/* Education */}
      <section id="education" className="section">
        <h2>Education</h2>

        <div className="card">
          <h3>Undergraduate Degree</h3>
          <p>Computer Science</p>
          <p>College Name: Add Your College Name</p>
          <p>Year: Add Your Study Period</p>
        </div>

        <div className="card">
          <h3>Higher Secondary Education</h3>
          <p>School Name: Add Your School Name</p>
          <p>Year: Add Your Passing Year</p>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="section">
        <h2>Technical Skills</h2>

        <div className="skills-list">
          {skills.map((skill) => (
            <div className="skill" key={skill.name}>
              <div className="skill-info">
                <span>{skill.name}</span>
                <span>{skill.level}%</span>
              </div>

              <div className="skill-bar">
                <div
                  className="skill-level"
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="section">
        <h2>My Projects</h2>

        <div className="projects-list">
          {projects.map((project) => (
            <div className="project card" key={project.id}>
              <h3>{project.title}</h3>
              <p>{project.description}</p>

              {project.link && project.link !== "#" && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="project-link"
                >
                  View Project
                </a>
              )}

              <div className="project-actions">
                <button onClick={() => handleEdit(project)}>
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(project.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="form-card" id="project-form">
          <h3>{editId !== null ? "Edit Project" : "Add New Project"}</h3>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Project Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <textarea
              placeholder="Project Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <input
              type="url"
              placeholder="Project Link (optional)"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />

            <button type="submit">
              {editId !== null ? "Update Project" : "Add Project"}
            </button>

            {editId !== null && (
              <button
                type="button"
                className="delete-btn"
                onClick={() => {
                  setEditId(null);
                  setTitle("");
                  setDescription("");
                  setLink("");
                }}
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>
      </section>

      {/* Certifications */}
      <section id="certifications" className="section">
        <h2>Certifications & Achievements</h2>

        <div className="card">
          <h3>Web Development Certification</h3>
          <p>Certificate Name: Add Your Certificate Name</p>
          <p>Organization: Add Organization Name</p>
          <p>Year: Add Completion Year</p>
        </div>

        <div className="card">
          <h3>Technical Workshop</h3>
          <p>Add your workshop or achievement details here.</p>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="section">
        <h2>Internships & Experience</h2>

        <div className="card">
          <h3>Internship / Training</h3>
          <p>Organization: Add Company Name</p>
          <p>Duration: Add Internship Duration</p>
          <p>
            Description: Add details about your internship,
            training or practical experience.
          </p>
        </div>
      </section>

      {/* Resume */}
      <section id="resume" className="section">
        <h2>My Resume</h2>
        <p>Download my resume to know more about my qualifications and skills.</p>
        <a href="/resume.pdf" target="_blank" rel="noreferrer" className="btn">
          View Resume
        </a>
        <a href="/resume.pdf" download className="btn secondary-btn">
          Download Resume
        </a>
      </section>

      {/* Contact */}
      <section id="contact" className="section">
        <h2>Contact Me</h2>

        <div className="contact-card">
          <p>
            Email: <a href="mailto:yourmail@gmail.com">
              yourmail@gmail.com
            </a>
          </p>

          <p>
            LinkedIn: <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
              My LinkedIn
            </a>
          </p>

          <p>
            GitHub: <a href="https://github.com/" target="_blank" rel="noreferrer">
              My GitHub
            </a>
          </p>

          <p>Location: Tamil Nadu, India</p>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p>© 2026 Dinesh Portfolio. All Rights Reserved.</p>
      </footer>

    </div>
  );
}

export default App;