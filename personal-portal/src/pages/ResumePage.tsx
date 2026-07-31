import { profile } from '../content/resume/profile'
import { usePageMeta } from '../hooks/usePageMeta'

/** @name 履历页 */
export default function ResumePage() {
  usePageMeta({
    title: `${profile.displayName} · ${profile.role}｜履历`,
    description: profile.summary,
  })

  return (
    <article className="paper-page resume-page">
      <header className="resume-hero">
        <div className="resume-hero__topline">
          <p>PROFILE / RESUME</p>
          <button
            className="resume-print-button print-hidden"
            type="button"
            onClick={() => window.print()}
          >
            打印 / 导出 PDF
          </button>
        </div>

        <div className="resume-identity">
          <div>
            <h1>{profile.displayName}</h1>
            <p className="resume-identity__role">{profile.role}</p>
          </div>
        </div>

        <p className="resume-hero__headline">{profile.headline}</p>
        <p className="resume-hero__summary">{profile.summary}</p>
        <p className="resume-source-note">{profile.sourceNote}</p>

        <div className="resume-hero__metadata">
          <ul className="resume-focus" aria-label="技术方向">
            {profile.focus.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <nav className="resume-links" aria-label="个人链接">
            {profile.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
              >
                {link.label}
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </nav>
        </div>
      </header>

      <section className="resume-section" aria-labelledby="resume-skills-title">
        <div className="resume-section__heading">
          <p>01 / CAPABILITIES</p>
          <h2 id="resume-skills-title">技能与方向</h2>
        </div>
        <div className="resume-skills">
          {profile.skillGroups.map((group) => (
            <section key={group.title} className="resume-skill-group">
              <h3>{group.title}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>

      <section className="resume-section" aria-labelledby="resume-work-title">
        <div className="resume-section__heading">
          <p>02 / EXPERIENCE</p>
          <h2 id="resume-work-title">工作经历</h2>
        </div>
        <ol className="resume-work-list">
          {profile.workExperience.map((entry) => (
            <li key={entry.id} className="resume-work-item">
              <span className="resume-work-item__period">{entry.period}</span>
              <div className="resume-work-item__body">
                <div className="resume-work-item__heading">
                  <h3>{entry.role}</h3>
                  <p>{entry.organization}</p>
                </div>
                <p className="resume-work-item__summary">{entry.summary}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="resume-section" aria-labelledby="resume-projects-title">
        <div className="resume-section__heading">
          <p>03 / SELECTED WORK</p>
          <h2 id="resume-projects-title">代表技术项目</h2>
        </div>
        <div className="resume-projects">
          {profile.projects.map((project) => (
            <details key={project.id} className="resume-project">
              <summary>
                <span className="resume-project__domain">{project.domain}</span>
                <span className="resume-project__title">{project.title}</span>
                <span className="resume-project__summary">{project.summary}</span>
                <span className="resume-project__toggle" aria-hidden="true">
                  <span className="resume-project__expand">展开详情 ＋</span>
                  <span className="resume-project__collapse">收起详情 −</span>
                </span>
              </summary>

              <div className="resume-project__details">
                <section>
                  <h3>背景</h3>
                  <p>{project.background}</p>
                </section>
                <section>
                  <h3>我的参与</h3>
                  <ul>
                    {project.contributions.map((contribution) => (
                      <li key={contribution}>{contribution}</li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3>工程挑战</h3>
                  <ul>
                    {project.challenges.map((challenge) => (
                      <li key={challenge}>{challenge}</li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3>完成范围</h3>
                  <ul>
                    {project.completedScope.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="resume-section" aria-labelledby="resume-education-title">
        <div className="resume-section__heading">
          <p>04 / EDUCATION</p>
          <h2 id="resume-education-title">教育经历</h2>
        </div>
        <ol className="resume-education">
          {profile.education.map((entry) => (
            <li key={entry.id} className="resume-education__item">
              <span>{entry.period}</span>
              <div>
                <h3>{entry.organization}</h3>
                <p>{entry.field}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </article>
  )
}
