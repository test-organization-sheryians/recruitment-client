export const buildProfileTemplate = (profile = {}) => {
    const {
        name = 'Unnamed Candidate',
        title = 'Role not provided',
        contact = {},
        summary = 'No summary provided.',
        skills = [],
        experience = [],
        education = [],
    } = profile;

    const skillsList = Array.isArray(skills)
        ? skills
            .map((skill) => `<li class="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold">${skill}</li>`)
            .join('')
        : '';

    const experienceList = Array.isArray(experience)
        ? experience
            .map((item) => {
                const achievements = Array.isArray(item.achievements)
                    ? item.achievements.map((point) => `<li class="list-disc list-inside text-sm text-slate-700">${point}</li>`).join('')
                    : '';

                return `
            <li class="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="text-sm uppercase tracking-wide text-slate-400">${item.duration || 'Duration N/A'}</p>
                  <p class="text-lg font-semibold text-slate-900">${item.role || 'Role N/A'}</p>
                  <p class="text-sm text-slate-600">${item.company || 'Company N/A'}${item.location ? ` • ${item.location}` : ''}</p>
                </div>
              </div>
              <ul class="space-y-1">${achievements}</ul>
            </li>
          `;
            })
            .join('')
        : '';

    const educationList = Array.isArray(education)
        ? education
            .map(
                (item) => `
            <li class="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <p class="text-base font-semibold text-slate-900">${item.degree || 'Degree N/A'}</p>
              <p class="text-sm text-slate-700">${item.school || 'School N/A'}${item.graduationYear ? ` — ${item.graduationYear}` : ''}</p>
            </li>
          `
            )
            .join('')
        : '';

    return `
    <div class="min-h-screen bg-slate-50 text-slate-900">
      <div class="max-w-3xl mx-auto py-10 px-6 space-y-6">
        <header class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-2">
          <p class="text-xs uppercase tracking-[0.25em] text-indigo-500 font-semibold">Profile Preview</p>
          <h1 class="text-3xl font-bold leading-tight">${name}</h1>
          <p class="text-lg text-slate-600">${title}</p>
          <div class="flex flex-wrap gap-3 text-sm text-slate-600">
            ${contact.email ? `<span class="inline-flex items-center gap-2">📧 ${contact.email}</span>` : ''}
            ${contact.phone ? `<span class="inline-flex items-center gap-2">📞 ${contact.phone}</span>` : ''}
            ${contact.location ? `<span class="inline-flex items-center gap-2">📍 ${contact.location}</span>` : ''}
            ${contact.website ? `<span class="inline-flex items-center gap-2">🔗 ${contact.website}</span>` : ''}
          </div>
        </header>

        <section class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 class="text-xl font-semibold text-slate-900">Summary</h2>
          <p class="text-slate-700 leading-relaxed">${summary}</p>
        </section>

        <section class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-slate-900">Skills</h2>
          </div>
          <ul class="flex flex-wrap gap-2">${skillsList}</ul>
        </section>

        <section class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 class="text-xl font-semibold text-slate-900">Experience</h2>
          <ul class="space-y-3">${experienceList}</ul>
        </section>

        <section class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 class="text-xl font-semibold text-slate-900">Education</h2>
          <ul class="space-y-2">${educationList}</ul>
        </section>
      </div>
    </div>
  `;
};

export default buildProfileTemplate;
