import React from 'react'
import mntrmeLogo from '../assets/mntrme.png'
import northwesternLogo from '../assets/northwestern.png'
import mltLogo from '../assets/mlt.jpg'
import emcoLogo from '../assets/emco.jpeg'
import mcsaLogo from '../assets/mcsa.png'

const Experience = () => {
  const experiences = [
    {
      title: 'Mntrme',
      company: 'Software Engineering Intern',
      period: 'Jun 2025 - Aug 2025',
      description: 'Worked on app’s infrastructure by documenting deployments, building test suites, adding AI moderation, and refining the UI',
      technologies: ['Flutter', 'Dart', 'Firebase', 'Postman', 'APIs'],
      type: 'experience',
      logo: mntrmeLogo
    },
    {
      title: 'Northwestern University',
      company: 'Frontend Developer',
      period: 'Jan 2025 - Mar 2025',
      description: 'Worked on KrisBot interface, a Python Streamlit app that refines corpuses with AI',
      technologies: ['Python', 'Streamlit', 'UI/UX', 'State Management'],
      type: 'experience',
      logo: northwesternLogo
    },
    {
      title: 'Northwestern University',
      company: 'Computer Support Technician',
      period: 'Jan 2024 - Jan 2025',
      description: 'Providing IT services, solutions, and strategies to the many departments and staff of Northwestern University Student Affairs',
      technologies: ['Information Technology', 'Problem Solving', 'Technical Support'],
      type: 'experience',
      logo: northwesternLogo
    }
  ]

  const organizations = [
    {
      name: 'Management Leadership for Tomorrow',
      role: 'Career Prep Fellow',
      period: 'Jan 2025 - Present',
      description: 'Selected for a competitive 18-month program combining leadership growth, technical training, and top industry networking',
      technologies: ['Leadership', 'Networking', 'Career Development'],
      type: 'organization',
      logo: mltLogo
    },
    {
      name: 'Emerging Coders',
      role: 'Treasurer',
      period: 'Oct 2024 - Present',
      description: 'Leading fundraising efforts to host technical workshops, networking events, and provide resources to help low-income students thrive in tech-related careers',
      technologies: ['Fundraising', 'Mentorship', 'Event Planning', 'Community Building'],
      type: 'organization',
      logo: emcoLogo
    },
    {
      name: 'Northwestern University',
      role: 'Undergraduate Teaching Assistant',
      period: 'Mar 2024 - Dec 2024',
      description: 'Dedicated 6 hours a week for in-class help and office hours to aid 100+ students in Fundamentals of Computer Programming',
      technologies: ['Communication', 'Lesson Planning'],
      type: 'organization',
      logo: northwesternLogo
    },
    /*
    {
      name: 'Muslim-cultural Students Association',
      role: 'Admin Vice President',
      period: 'Mar 2024 - Mar 2025',
      description: 'Co-led events for 200+ members, coordinated with an executive board, and helped raise $5000+ for humanitarian aid initiatives.',
      technologies: ['Event Coordination', 'Fundraising', 'Communication', 'Collaboration'],
      type: 'organization',
      logo: mcsaLogo
    }
    */
  ]

  // Create pairs of experiences and organizations
  const maxLength = Math.max(experiences.length, organizations.length)
  const timelineItems = []

  for (let i = 0; i < maxLength; i++) {
    timelineItems.push({
      experience: experiences[i] || null,
      organization: organizations[i] || null
    })
  }

  return (
    <section id="experience" className="experience-projects">
      <div className="container">
        <div className="section-header">
          <h2>Experience</h2>
        </div>
        
        <div className="timeline">
          {timelineItems.map((item, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-marker"></div>
              
              {/* Left side - Experience */}
              <div className="timeline-content">
                {item.experience ? (
                  <div className="experience-card">
                    {item.experience.logo && (
                      <div className="card-logo">
                        <img 
                          src={item.experience.logo} 
                          alt={`${item.experience.company} logo`}
                          className="logo-icon"
                        />
                      </div>
                    )}
                    <div className="experience-header">
                      <h3>{item.experience.title}</h3>
                      <div className="experience-meta">
                        <span className="company">{item.experience.company}</span>
                        <span className="period">{item.experience.period}</span>
                      </div>
                    </div>
                    <p className="experience-description">{item.experience.description}</p>
                    <div className="technologies">
                      {item.experience.technologies.map((tech, techIndex) => (
                        <span key={techIndex} className="tech-tag">{tech}</span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="timeline-content-placeholder"></div>
                )}
              </div>

              {/* Right side - Organization */}
              <div className="timeline-content">
                {item.organization ? (
                  <div className="project-card">
                    <div className="card-logo">
                      <img 
                        src={item.organization.logo} 
                        alt={`${item.organization.name} logo`}
                        className="logo-icon"
                      />
                    </div>
                    <div className="project-header">
                      <h3>{item.organization.name}</h3>
                      <div className="project-meta">
                        <span className="project-type">{item.organization.role}</span>
                        <span className="period">{item.organization.period}</span>
                      </div>
                    </div>
                    <p className="project-description">{item.organization.description}</p>
                    <div className="technologies">
                      {item.organization.technologies.map((tech, techIndex) => (
                        <span key={techIndex} className="tech-tag">{tech}</span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="timeline-content-placeholder"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Experience

