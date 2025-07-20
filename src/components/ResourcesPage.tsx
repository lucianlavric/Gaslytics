import React from 'react';
import { ExternalLink, Book, Users, Phone, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const ResourcesPage = () => {
  const resourceCategories = [
    {
      title: 'Communication Guides',
      icon: Book,
      color: 'sage',
      resources: [
        {
          title: 'Assertive Communication Techniques',
          description: 'Learn to express your needs clearly and respectfully',
          link: '#',
          type: 'Guide'
        },
        {
          title: 'Healthy Boundaries in Relationships',
          description: 'Understanding and setting emotional boundaries',
          link: '#',
          type: 'Article'
        },
        {
          title: 'Recognizing Manipulation Tactics',
          description: 'A comprehensive guide to identifying unhealthy patterns',
          link: '#',
          type: 'PDF'
        }
      ]
    },
    {
      title: 'Professional Support',
      icon: Users,
      color: 'amber',
      resources: [
        {
          title: 'Psychology Today Therapist Directory',
          description: 'Find licensed therapists in your area',
          link: 'https://psychologytoday.com',
          type: 'Directory'
        },
        {
          title: 'BetterHelp Online Therapy',
          description: 'Accessible online counseling services',
          link: 'https://betterhelp.com',
          type: 'Service'
        },
        {
          title: 'Relationship Counseling Resources',
          description: 'Specialized support for couples and families',
          link: '#',
          type: 'Directory'
        }
      ]
    },
    {
      title: 'Crisis Support',
      icon: Phone,
      color: 'rose',
      resources: [
        {
          title: 'National Domestic Violence Hotline',
          description: '1-800-799-7233 • 24/7 confidential support',
          link: 'tel:18007997233',
          type: 'Hotline'
        },
        {
          title: 'Crisis Text Line',
          description: 'Text HOME to 741741 for immediate support',
          link: 'sms:741741',
          type: 'Text'
        },
        {
          title: 'SAMHSA National Helpline',
          description: '1-800-662-4357 • Mental health and substance abuse',
          link: 'tel:18006624357',
          type: 'Hotline'
        }
      ]
    },
    {
      title: 'Self-Care & Healing',
      icon: Heart,
      color: 'emerald',
      resources: [
        {
          title: 'Mindfulness and Meditation Apps',
          description: 'Tools for emotional regulation and stress management',
          link: '#',
          type: 'Apps'
        },
        {
          title: 'Trauma-Informed Self-Care',
          description: 'Gentle practices for emotional healing',
          link: '#',
          type: 'Guide'
        },
        {
          title: 'Support Groups',
          description: 'Connect with others who understand your experience',
          link: '#',
          type: 'Community'
        }
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      sage: 'bg-sage-100 text-sage-700 border-sage-200',
      amber: 'bg-amber-100 text-amber-700 border-amber-200',
      rose: 'bg-rose-100 text-rose-700 border-rose-200',
      emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200'
    };
    return colors[color as keyof typeof colors] || colors.sage;
  };

  const getIconBgColor = (color: string) => {
    const colors = {
      sage: 'bg-sage-500',
      amber: 'bg-amber-500',
      rose: 'bg-rose-500',
      emerald: 'bg-emerald-500'
    };
    return colors[color as keyof typeof colors] || colors.sage;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -24 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">Support Resources</h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Gentle guidance and professional support to help you navigate difficult conversations 
          and build healthier relationships.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {resourceCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className={`w-12 h-12 ${getIconBgColor(category.color)} rounded-2xl flex items-center justify-center`}>
                <category.icon className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">{category.title}</h2>
            </div>

            <div className="space-y-4">
              {category.resources.map((resource, resourceIndex) => (
                <div key={resourceIndex} className={`border-2 rounded-2xl p-4 ${getColorClasses(category.color)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold">{resource.title}</h3>
                        <span className="px-2 py-1 bg-white/70 rounded-full text-xs font-medium">
                          {resource.type}
                        </span>
                      </div>
                      <p className="text-sm opacity-80 mb-3">{resource.description}</p>
                      
                      {resource.link.startsWith('http') ? (
                        <a
                          href={resource.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-sm font-medium hover:underline"
                        >
                          <span>Visit resource</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : resource.link.startsWith('tel:') || resource.link.startsWith('sms:') ? (
                        <a
                          href={resource.link}
                          className="inline-flex items-center space-x-1 text-sm font-medium hover:underline"
                        >
                          <span>Contact now</span>
                          <Phone className="w-3 h-3" />
                        </a>
                      ) : (
                        <button className="inline-flex items-center space-x-1 text-sm font-medium hover:underline">
                          <span>Learn more</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Important Notice */}
      <div className="mt-12 bg-blue-50 border-2 border-blue-200 rounded-3xl p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Important Notice</h3>
        <p className="text-blue-700 text-sm leading-relaxed">
          This analysis tool is designed to provide insights and support, but it is not a substitute 
          for professional mental health care. If you're experiencing ongoing manipulation, emotional 
          abuse, or feel unsafe, please reach out to a qualified professional or crisis support service. 
          Your safety and well-being are the top priority.
        </p>
      </div>

      {/* Emergency Resources */}
      <div className="mt-8 bg-red-50 border-2 border-red-200 rounded-3xl p-6 text-center">
        <h3 className="text-lg font-semibold text-red-800 mb-3">In Crisis? Get Help Now</h3>
        <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
          <a
            href="tel:988"
            className="inline-flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium transition-colors"
          >
            <Phone className="w-4 h-4 mr-2" />
            Call 988 (Suicide & Crisis Lifeline)
          </a>
          <a
            href="tel:911"
            className="inline-flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium transition-colors"
          >
            <Phone className="w-4 h-4 mr-2" />
            Emergency: 911
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default ResourcesPage;