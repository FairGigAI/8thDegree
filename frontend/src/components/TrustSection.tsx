import { motion } from 'framer-motion';
import { Star, ThumbsUp, ThumbsDown, Award, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import Image from 'next/image';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
  upvotes: number;
  downvotes: number;
  badges: string[];
}

export function TrustSection() {
  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Michael Chen',
      role: 'Senior Frontend Developer',
      avatar: '/avatars/michael.jpg',
      content: 'The AI matching system found me the perfect project within hours. The client was exactly what I was looking for!',
      rating: 5,
      upvotes: 124,
      downvotes: 2,
      badges: ['Top Rated', 'On-Time']
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      role: 'UI/UX Designer',
      avatar: '/avatars/sarah.jpg',
      content: 'As someone who values time, the AI-powered matching saved me countless hours of searching. Highly recommended!',
      rating: 5,
      upvotes: 98,
      downvotes: 1,
      badges: ['Rising Talent']
    },
    {
      id: '3',
      name: 'David Park',
      role: 'Project Manager',
      avatar: '/avatars/david.jpg',
      content: 'The quality of freelancers on this platform is outstanding. The AI recommendations have never disappointed.',
      rating: 4.9,
      upvotes: 156,
      downvotes: 3,
      badges: ['Verified Client']
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold mb-6"
          >
            Why Our System Works
            <span className="block text-lg text-gray-600 mt-2 font-normal">
              Powered by real feedback and continuous AI learning
            </span>
          </motion.h2>
        </div>

        {/* Success Metrics */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg text-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">98%</h3>
            <p className="text-gray-600">Freelancers hired within 3 days</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg text-center"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">95%</h3>
            <p className="text-gray-600">Projects completed on time</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-2xl p-6 shadow-lg text-center"
          >
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">4.9/5</h3>
            <p className="text-gray-600">Average client satisfaction</p>
          </motion.div>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * (index + 4) }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <div className="flex items-center gap-4 mb-4">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-600 ml-2">
                  {testimonial.rating.toFixed(1)}
                </span>
              </div>

              <p className="text-gray-700 mb-4">{testimonial.content}</p>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {testimonial.badges.map((badge) => (
                    <span
                      key={badge}
                      className="flex items-center gap-1 text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
                    >
                      <Award className="w-3 h-3" />
                      {badge}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <button className="flex items-center gap-1 hover:text-gray-700">
                    <ThumbsUp className="w-4 h-4" />
                    {testimonial.upvotes}
                  </button>
                  <button className="flex items-center gap-1 hover:text-gray-700">
                    <ThumbsDown className="w-4 h-4" />
                    {testimonial.downvotes}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 