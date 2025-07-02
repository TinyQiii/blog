import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Blog.css";

export default function BlogPage() {
    const [activeTab, setActiveTab] = useState('profile');
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // 检查登录状态
    useEffect(() => {
        const userInfoStr = localStorage.getItem('user_info');
        
        if (!userInfoStr) {
            // 没有用户信息，跳转到登录页
            navigate('/');
            return;
        }

        try {
            setUserInfo(JSON.parse(userInfoStr));
        } catch (e) {
            console.error('Failed to parse user info:', e);
            navigate('/');
            return;
        }

        setLoading(false);
    }, [navigate]);

    // 处理登出
    const handleLogout = () => {
        // 清除本地存储的用户信息
        localStorage.removeItem('user_info');
        navigate('/');
    };

    // 如果正在加载，显示加载状态
    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading">Loading...</div>
            </div>
        );
    }

    // Mock personal information data
    const personalInfo = {
        name: "YUQI JIA",
        title: "Full Stack Developer & UI/UX Designer",
        avatar: "https://www.bing.com/images/search?view=detailV2&ccid=RlEWS%2fsv&id=C2311D6ADFF5643AC26386349FD813992176AF99&thid=OIP.RlEWS_svJsr4_snvaqbXqgHaHQ&mediaurl=https%3a%2f%2fc-ssl.duitang.com%2fuploads%2fblog%2f202206%2f28%2f20220628132848_0686b.jpg&exph=1059&expw=1080&q=%e5%8a%a8%e6%bc%ab%e7%94%b7%e5%a4%b4&FORM=IRPRST&ck=C6DAAAE215034B70F4CFC24BED164C8B&selectedIndex=6&itb=0",
        email: "jiayuqi369@gmail.com",
        phone: "02885249892",
        location: "hamilton new zealand",
        website: "https://johnsmith.dev",
        github: "https://github.com/johnsmith",
        linkedin: "https://linkedin.com/in/johnsmith",
        bio: "Passionate full-stack developer with 5+ years of experience in creating innovative web applications. Specialized in React, Spring Boot, and modern web technologies. I love exploring new technologies, solving complex problems, and creating user-friendly interfaces that make a difference. When I'm not coding, you can find me contributing to open-source projects, writing tech blogs, or mentoring junior developers.",
        skills: {
            "Frontend": ["React", "Vue.js", "Angular", "TypeScript", "JavaScript", "HTML5", "CSS3", "Sass", "Tailwind CSS", "Material-UI", "Redux", "Next.js"],
            "Backend": ["Spring Boot", "Node.js", "Express.js", "Java", "Python", "Django", "RESTful APIs", "GraphQL", "Microservices"],
            "Database": ["MySQL", "PostgreSQL", "MongoDB", "Redis", "Elasticsearch", "Firebase"],
            "DevOps": ["Docker", "Kubernetes", "AWS", "Azure", "Git", "CI/CD", "Jenkins", "Nginx"],
            "Tools": ["VS Code", "IntelliJ IDEA", "Postman", "Figma", "Adobe XD", "Jira", "Confluence"]
        },
        experience: [
            {
                company: "TechCorp Inc.",
                position: "Senior Full Stack Developer",
                period: "2022-2024",
                location: "San Francisco, CA",
                description: "Led development of enterprise-level applications serving 1M+ users. Implemented microservices architecture, improved system performance by 40%, and mentored 5 junior developers. Technologies: React, Spring Boot, AWS, Docker.",
                achievements: [
                    "Reduced application load time by 40% through optimization",
                    "Implemented CI/CD pipeline reducing deployment time by 60%",
                    "Led team of 5 developers in agile environment"
                ]
            },
            {
                company: "StartupXYZ",
                position: "Full Stack Developer",
                period: "2020-2022",
                location: "Austin, TX",
                description: "Built and maintained e-commerce platform with 100K+ monthly users. Developed RESTful APIs, implemented payment gateways, and created responsive user interfaces. Technologies: Vue.js, Node.js, MongoDB, Stripe API.",
                achievements: [
                    "Increased conversion rate by 25% through UI/UX improvements",
                    "Integrated multiple payment gateways (Stripe, PayPal)",
                    "Implemented real-time inventory management system"
                ]
            },
            {
                company: "Digital Solutions Ltd.",
                position: "Frontend Developer",
                period: "2018-2020",
                location: "Boston, MA",
                description: "Developed responsive web applications and mobile-first designs. Collaborated with design team to implement pixel-perfect interfaces. Technologies: React, TypeScript, Sass, Webpack.",
                achievements: [
                    "Built 10+ responsive web applications",
                    "Improved accessibility compliance to WCAG 2.1 standards",
                    "Reduced bundle size by 30% through code optimization"
                ]
            }
        ],
        education: [
            {
                school: "Massachusetts Institute of Technology",
                degree: "Master of Computer Science",
                period: "2016-2018",
                gpa: "3.9/4.0",
                description: "Specialized in Software Engineering and Artificial Intelligence. Thesis: 'Machine Learning Applications in Web Development'"
            },
            {
                school: "Stanford University",
                degree: "Bachelor of Computer Science and Technology",
                period: "2012-2016",
                gpa: "3.8/4.0",
                description: "Major in Computer Science with minor in Mathematics. Dean's List for 4 consecutive years."
            }
        ],
        projects: [
            {
                name: "E-Commerce Platform",
                description: "A full-stack e-commerce platform with real-time inventory management, payment processing, and admin dashboard. Features include user authentication, product catalog, shopping cart, order management, and analytics dashboard.",
                tech: ["React", "Spring Boot", "MySQL", "Redis", "AWS", "Docker"],
                link: "https://github.com/johnsmith/ecommerce-platform",
                demo: "https://demo-ecommerce.johnsmith.dev",
                image: "https://via.placeholder.com/300x200/4ecdc4/ffffff?text=E-Commerce"
            },
            {
                name: "Real-time Chat Application",
                description: "A modern chat application supporting group chats, private messaging, file sharing, and video calls. Built with WebSocket for real-time communication and includes features like message encryption, user presence, and message history.",
                tech: ["React", "WebSocket", "Node.js", "MongoDB", "Socket.io", "JWT"],
                link: "https://github.com/johnsmith/chat-app",
                demo: "https://chat.johnsmith.dev",
                image: "https://via.placeholder.com/300x200/ff6b6b/ffffff?text=Chat+App"
            },
            {
                name: "Task Management System",
                description: "A comprehensive project management tool with task tracking, team collaboration, time tracking, and reporting features. Includes Kanban boards, Gantt charts, and real-time notifications.",
                tech: ["Vue.js", "Spring Boot", "PostgreSQL", "Redis", "Docker", "AWS"],
                link: "https://github.com/johnsmith/task-manager",
                demo: "https://tasks.johnsmith.dev",
                image: "https://via.placeholder.com/300x200/95e1d3/ffffff?text=Task+Manager"
            },
            {
                name: "Weather Dashboard",
                description: "A beautiful weather application with location-based forecasts, interactive maps, and weather alerts. Features include 7-day forecast, hourly predictions, and historical weather data visualization.",
                tech: ["React", "TypeScript", "Chart.js", "OpenWeather API", "Geolocation API"],
                link: "https://github.com/johnsmith/weather-app",
                demo: "https://weather.johnsmith.dev",
                image: "https://via.placeholder.com/300x200/f8b500/ffffff?text=Weather+App"
            },
            {
                name: "Portfolio Website",
                description: "A modern, responsive portfolio website with smooth animations, dark/light theme toggle, and contact form. Built with performance and accessibility in mind.",
                tech: ["React", "Framer Motion", "Tailwind CSS", "EmailJS", "Vercel"],
                link: "https://github.com/johnsmith/portfolio",
                demo: "https://johnsmith.dev",
                image: "https://via.placeholder.com/300x200/a8e6cf/ffffff?text=Portfolio"
            },
            {
                name: "Recipe Finder",
                description: "A recipe discovery app with search functionality, ingredient filtering, and meal planning features. Users can save favorite recipes, create shopping lists, and share recipes with friends.",
                tech: ["React Native", "Node.js", "MongoDB", "Spoonacular API", "Firebase"],
                link: "https://github.com/johnsmith/recipe-finder",
                demo: "https://recipes.johnsmith.dev",
                image: "https://via.placeholder.com/300x200/ff8a80/ffffff?text=Recipe+App"
            }
        ],
        certifications: [
            {
                name: "AWS Certified Solutions Architect",
                issuer: "Amazon Web Services",
                date: "2023",
                credential: "AWS-SAA-2023-12345"
            },
            {
                name: "Google Cloud Professional Developer",
                issuer: "Google Cloud",
                date: "2022",
                credential: "GCP-PD-2022-67890"
            },
            {
                name: "Certified Scrum Master (CSM)",
                issuer: "Scrum Alliance",
                date: "2021",
                credential: "CSM-2021-11111"
            },
            {
                name: "MongoDB Certified Developer",
                issuer: "MongoDB University",
                date: "2020",
                credential: "MCD-2020-22222"
            }
        ],
        languages: [
            { name: "English", level: "Native" },
            { name: "Spanish", level: "Fluent" },
            { name: "French", level: "Intermediate" },
            { name: "Mandarin", level: "Basic" }
        ],
        interests: [
            "Open Source Contribution",
            "Machine Learning",
            "Blockchain Technology",
            "UI/UX Design",
            "Photography",
            "Hiking",
            "Reading Tech Blogs",
            "Playing Guitar"
        ]
    };

    const renderProfile = () => (
        <div className="profile-section">
            <div className="profile-header">
                <img src={personalInfo.avatar} alt="Avatar" className="avatar" />
                <div className="profile-info">
                    <h2>{personalInfo.name}</h2>
                    <p className="title">{personalInfo.title}</p>
                    <p className="location">📍 {personalInfo.location}</p>
                    <p className="email">📧 {personalInfo.email}</p>
                    <p className="phone">📞 {personalInfo.phone}</p>
                    <div className="social-links">
                        <a href={personalInfo.website} target="_blank" rel="noopener noreferrer">🌐 Website</a>
                        <a href={personalInfo.github} target="_blank" rel="noopener noreferrer">🐙 GitHub</a>
                        <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">💼 LinkedIn</a>
                    </div>
                </div>
            </div>
            <div className="bio">
                <h3>About Me</h3>
                <p>{personalInfo.bio}</p>
            </div>
        </div>
    );

    const renderSkills = () => (
        <div className="skills-section">
            <h3>Skills & Technologies</h3>
            <div className="skills-grid">
                {Object.entries(personalInfo.skills).map(([category, skills]) => (
                    <div key={category} className="skill-category">
                        <h4>{category}</h4>
                        <div className="skill-tags">
                            {skills.map(skill => (
                                <span key={skill} className="skill-tag">{skill}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderExperience = () => (
        <div className="experience-section">
            <h3>Professional Experience</h3>
            <div className="timeline">
                {personalInfo.experience.map((exp, index) => (
                    <div key={index} className="timeline-item">
                        <div className="timeline-content">
                            <h4>{exp.position}</h4>
                            <h5>{exp.company}</h5>
                            <p className="period">{exp.period} | {exp.location}</p>
                            <p className="description">{exp.description}</p>
                            <ul className="achievements">
                                {exp.achievements.map((achievement, i) => (
                                    <li key={i}>{achievement}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderEducation = () => (
        <div className="education-section">
            <h3>Education</h3>
            <div className="education-grid">
                {personalInfo.education.map((edu, index) => (
                    <div key={index} className="education-item">
                        <h4>{edu.degree}</h4>
                        <h5>{edu.school}</h5>
                        <p className="period">{edu.period} | GPA: {edu.gpa}</p>
                        <p className="description">{edu.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderProjects = () => (
        <div className="projects-section">
            <h3>Projects</h3>
            <div className="projects-grid">
                {personalInfo.projects.map((project, index) => (
                    <div key={index} className="project-card">
                        <img src={project.image} alt={project.name} className="project-image" />
                        <div className="project-content">
                            <h4>{project.name}</h4>
                            <p className="description">{project.description}</p>
                            <div className="tech-stack">
                                {project.tech.map(tech => (
                                    <span key={tech} className="tech-tag">{tech}</span>
                                ))}
                            </div>
                            <div className="project-links">
                                <a href={project.link} target="_blank" rel="noopener noreferrer">GitHub</a>
                                <a href={project.demo} target="_blank" rel="noopener noreferrer">Live Demo</a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderCertifications = () => (
        <div className="certifications-section">
            <h3>Certifications</h3>
            <div className="certifications-grid">
                {personalInfo.certifications.map((cert, index) => (
                    <div key={index} className="certification-item">
                        <h4>{cert.name}</h4>
                        <p className="issuer">{cert.issuer}</p>
                        <p className="date">{cert.date}</p>
                        <p className="credential">Credential: {cert.credential}</p>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderLanguages = () => (
        <div className="languages-section">
            <h3>Languages</h3>
            <div className="languages-grid">
                {personalInfo.languages.map((lang, index) => (
                    <div key={index} className="language-item">
                        <span className="language-name">{lang.name}</span>
                        <span className="language-level">{lang.level}</span>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderInterests = () => (
        <div className="interests-section">
            <h3>Interests & Hobbies</h3>
            <div className="interests-grid">
                {personalInfo.interests.map((interest, index) => (
                    <span key={index} className="interest-tag">{interest}</span>
                ))}
            </div>
        </div>
    );

    return (
        <div className="blog-container">
            <div className="header">
                <h1>Welcome to My Portfolio</h1>
                <div className="user-info">
                    {userInfo && (
                        <span className="welcome-text">
                            Welcome, {userInfo.username}!
                        </span>
                    )}
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </div>

            <div className="navigation">
                <button 
                    className={activeTab === 'profile' ? 'active' : ''} 
                    onClick={() => setActiveTab('profile')}
                >
                    Profile
                </button>
                <button 
                    className={activeTab === 'skills' ? 'active' : ''} 
                    onClick={() => setActiveTab('skills')}
                >
                    Skills
                </button>
                <button 
                    className={activeTab === 'experience' ? 'active' : ''} 
                    onClick={() => setActiveTab('experience')}
                >
                    Experience
                </button>
                <button 
                    className={activeTab === 'education' ? 'active' : ''} 
                    onClick={() => setActiveTab('education')}
                >
                    Education
                </button>
                <button 
                    className={activeTab === 'projects' ? 'active' : ''} 
                    onClick={() => setActiveTab('projects')}
                >
                    Projects
                </button>
                <button 
                    className={activeTab === 'certifications' ? 'active' : ''} 
                    onClick={() => setActiveTab('certifications')}
                >
                    Certifications
                </button>
                <button 
                    className={activeTab === 'languages' ? 'active' : ''} 
                    onClick={() => setActiveTab('languages')}
                >
                    Languages
                </button>
                <button 
                    className={activeTab === 'interests' ? 'active' : ''} 
                    onClick={() => setActiveTab('interests')}
                >
                    Interests
                </button>
            </div>

            <div className="content">
                {activeTab === 'profile' && renderProfile()}
                {activeTab === 'skills' && renderSkills()}
                {activeTab === 'experience' && renderExperience()}
                {activeTab === 'education' && renderEducation()}
                {activeTab === 'projects' && renderProjects()}
                {activeTab === 'certifications' && renderCertifications()}
                {activeTab === 'languages' && renderLanguages()}
                {activeTab === 'interests' && renderInterests()}
            </div>
        </div>
    );
} 