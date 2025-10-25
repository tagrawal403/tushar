import React from "react";
import { Link } from "react-router-dom";
import { Users, Heart, Target, Sparkles } from "lucide-react";

const AboutUs = () => {
  const founders = [
    {
      name: "Arjun Sharma",
      role: "Co-Founder & Creative Director",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      description: "With a passion for street culture and design, Arjun brings innovative aesthetics to every piece."
    },
    {
      name: "Priya Patel",
      role: "Co-Founder & CEO",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      description: "Priya's vision is to make luxury streetwear accessible while maintaining uncompromising quality."
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion",
      description: "Every piece is crafted with love and attention to detail"
    },
    {
      icon: Target,
      title: "Quality",
      description: "We never compromise on materials or craftsmanship"
    },
    {
      icon: Sparkles,
      title: "Innovation",
      description: "Constantly pushing boundaries in streetwear fashion"
    },
    {
      icon: Users,
      title: "Community",
      description: "Building a tribe of authentic style enthusiasts"
    }
  ];

  return (
    <div className="min-h-screen bg-transparent">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold-200/10 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 luxury-heading">
              About <span className="text-gold-200">Thrynn</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Born from a passion for authentic street culture and luxury aesthetics, 
              Thrynn represents the perfect fusion of urban edge and premium quality.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8 text-center luxury-heading">
            Our Story
          </h2>
          <div className="prose prose-lg prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed mb-6">
              Founded in 2025, Thrynn emerged from a simple belief: streetwear should be 
              both accessible and luxurious. We noticed a gap in the market for premium 
              quality urban fashion that doesn't compromise on style or authenticity.
            </p>
            <p className="text-gray-300 leading-relaxed mb-6">
              What started as a small collection of hoodies and tees has evolved into a 
              full-fledged lifestyle brand. Every design tells a story, every piece speaks 
              to those who dare to stand out while staying true to their roots.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Today, Thrynn is more than just a clothing brand—it's a movement. A community 
              of individuals who appreciate quality craftsmanship, bold designs, and the 
              freedom to express themselves through fashion.
            </p>
          </div>
        </div>
      </section>

      {/* Meet the Founders */}
      <section className="py-16 bg-black/20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-12 text-center luxury-heading">
            Meet the Founders
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {founders.map((founder, index) => (
              <div key={index} className="bg-gray-800/40 rounded-2xl overflow-hidden border border-gold-200/20 hover:border-gold-200/40 transition-all">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={founder.image}
                    alt={founder.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{founder.name}</h3>
                  <p className="text-gold-200 font-medium mb-4">{founder.role}</p>
                  <p className="text-gray-300">{founder.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-white mb-12 text-center luxury-heading">
          Our Values
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-200/10 border-2 border-gold-200 mb-4">
                  <Icon className="text-gold-200" size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                <p className="text-gray-300">{value.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-gold-200/10 to-gold-100/10 rounded-3xl p-12 border border-gold-200/20">
          <h2 className="text-3xl font-bold text-white mb-4 luxury-heading">
            Join the Thrynn Family
          </h2>
          <p className="text-gray-300 mb-8">
            Experience the perfect blend of street culture and luxury fashion
          </p>
          <Link
            to="/products"
            className="btn-primary inline-block"
          >
            Shop Collection
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
