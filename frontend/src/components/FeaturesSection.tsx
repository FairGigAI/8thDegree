import { Brain, Target, Shield } from 'lucide-react';

export function FeaturesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Powered by Advanced AI
          </h2>
          <p className="text-lg text-gray-700">
          Experience the future of freelancing
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Smart Matching</h3>
            <p className="text-gray-700">
              Our AI analyzes your skills and preferences to find the perfect matches.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Personalized Feed</h3>
            <p className="text-gray-700">
              Get tailored recommendations based on your work history and interests.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Secure Platform</h3>
            <p className="text-gray-700">
              Advanced AI fraud detection and secure payment processing.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 