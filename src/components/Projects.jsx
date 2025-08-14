import React from 'react'

const Projects = () => {
  const projects = [
    {
      name: 'Quranic Arabic Learning App',
      description: 'A mobile study tool helping users learn 372 high-frequency Quranic words—covering most of the Quran’s vocabulary—through clean visuals, offline access, and structured lessons. The backend streamlines text parsing for clarity and efficient storage',
      technologies: ['Flutter', 'Firebase', 'SQLite', 'Java', "Text Mining"],
      logo: ''
    },
    {
      name: 'SEC Insight Engine',
      description: 'A web-based tool for quickly looking up and reading SEC filings like 10-Ks and 10-Qs, designed for financial research and decision-making. It uses automation and AI to ensure the data is always fresh and easy to navigate',
      technologies: ['Python', 'AWS Lambda', 'Amazon Bedrock', 'APIs'],
      logo: ''
    },
    {
      name: 'Cats Course Ave',
      description: 'An academic planning platform for Northwestern students that displays course requirements, organizes schedules, and guides users with an integrated chatbot. Built for an intuitive browsing experience with clean visuals and quick load times',
      technologies: ['React', 'TailwindCSS', 'Python', 'Firebase Auth', 'Gemini API'],
      logo: ''
    },
    {
      name: 'Medication Tracking App',
      description: 'A connected pill-tracking system combining a web dashboard and physical device to help users stick to their medication schedules. Lights, buzzers, and logs provide clear reminders and progress tracking',
      technologies: ['C++', 'ESP32 Microcontroller', 'React', 'Bluetooth'],
      logo: ''
    }
  ]

  return (
    <section id="projects" className="organizations">
      <div className="container">
        <div className="section-header">
          <h2>Projects</h2>
        </div>
        
        <div className="organizations-grid">
          {projects.map((project, index) => (
            <div key={index} className="organization-card">
              <div className="org-header">
                <div className="org-logo">
                  {typeof project.logo === 'string' && project.logo.startsWith('/') ? (
                    <img 
                      src={project.logo} 
                      alt={`${project.name} logo`}
                      className="logo-emoji"
                    />
                  ) : (
                    <span className="logo-emoji">{project.logo}</span>
                  )}
                </div>
                <div className="org-info">
                  <h3>{project.name}</h3>
                </div>
              </div>
              <p className="org-description">{project.description}</p>
              <div className="technologies">
                {project.technologies.map((tech, techIndex) => (
                  <span key={techIndex} className="tech-tag">{tech}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Projects
