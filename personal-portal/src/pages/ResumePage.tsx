import { profile } from '../content/resume/profile'
import { usePageMeta } from '../hooks/usePageMeta'

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
          <p className="resume-identity__location">{profile.location}</p>
        </div>

        <p className="resume-hero__headline">{profile.headline}</p>
        <p className="resume-hero__summary">{profile.summary}</p>

        <div className="resume-hero__metadata">
          <ul className="resume-focus" aria-label="当前关注方向">
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

      <section className="resume-section" aria-labelledby="resume-experience-title">
        <div className="resume-section__heading">
          <p>02 / EXPERIENCE</p>
          <h2 id="resume-experience-title">实践经历</h2>
        </div>
        <div className="resume-entries">
          {profile.entries.map((entry) => (
            <details key={entry.id} className="resume-entry">
              <summary>
                <span className="resume-entry__period">{entry.period}</span>
                <span className="resume-entry__heading">
                  <span className="resume-entry__role">{entry.role}</span>
                  <span className="resume-entry__organization">
                    {entry.organization}
                  </span>
                </span>
                <span className="resume-entry__summary">{entry.summary}</span>
                <span className="resume-entry__toggle" aria-hidden="true">
                  <span className="resume-entry__expand">展开详情 ＋</span>
                  <span className="resume-entry__collapse">收起详情 −</span>
                </span>
              </summary>

              <div className="resume-entry__details">
                <section>
                  <h3>背景</h3>
                  <p>{entry.background}</p>
                </section>
                <section>
                  <h3>行动</h3>
                  <ul>
                    {entry.actions.map((action) => (
                      <li key={action}>{action}</li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3>挑战</h3>
                  <ul>
                    {entry.challenges.map((challenge) => (
                      <li key={challenge}>{challenge}</li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3>结果</h3>
                  <ul>
                    {entry.results.map((result) => (
                      <li key={result}>{result}</li>
                    ))}
                  </ul>
                </section>
              </div>
            </details>
          ))}
        </div>
      </section>
    </article>
  )
}
