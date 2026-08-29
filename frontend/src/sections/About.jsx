export default function About() {
  return (
    <section id="about" className="bg-white py-12 md:py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">About</p>
          <h2 className="mt-3 font-display text-3xl font-bold text-gray-900 md:text-4xl">Who I am</h2>
        </div>

        <div className="grid gap-8 md:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-4 text-gray-700">
          <p>
            I’m a developer with a strong interest in building polished, user-focused web products and
            solving real-world engineering problems. My work blends design thinking, product sense, and
            strong technical execution.
          </p>
          <p>
            I enjoy creating modern interfaces, exploring backend systems, and learning through practical
            projects and competitive programming. I like building things that are both elegant and useful.
          </p>
        </div>

          <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-5 text-sm">
            <div>
              <p className="text-gray-600">Location</p>
              <p className="mt-1 font-medium text-gray-900">Patna, Bihar</p>
            </div>
            <div>
              <p className="text-gray-600">Education</p>
              <p className="mt-1 font-medium text-gray-900">B.Tech in EE with AIML minor</p>
            </div>
            <div>
              <p className="text-gray-600">Current focus</p>
              <p className="mt-1 font-medium text-gray-900">MERN, DSA, product design</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
