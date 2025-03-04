export default function About() {
  return (
    <main className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">About 8thDegree</h1>
          
          <section className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              8thDegree is a platform dedicated to connecting talented freelancers with clients who need their expertise. 
              We believe in creating meaningful professional relationships and delivering exceptional results.
            </p>
          </section>

          <section className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-3">
              <li>A secure and transparent platform for freelancers and clients</li>
              <li>Fair pricing and competitive rates</li>
              <li>Quality assurance and dispute resolution</li>
              <li>Professional growth opportunities</li>
              <li>Global talent pool and diverse project opportunities</li>
            </ul>
          </section>

          <section className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <h3 className="font-semibold mb-2">Trust</h3>
                <p className="text-gray-600">Building reliable connections between professionals</p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold mb-2">Quality</h3>
                <p className="text-gray-600">Ensuring excellence in every project</p>
              </div>
              <div className="text-center">
                <h3 className="font-semibold mb-2">Innovation</h3>
                <p className="text-gray-600">Embracing new ideas and technologies</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
} 