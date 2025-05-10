import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import PricingCard from "@/components/pricing-card";
import Footer from "@/components/footer";
import { createClient } from "../../supabase/server";
import { ArrowUpRight, CheckCircle2, Zap, Shield, Users, Check } from "lucide-react";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: plans, error } = await supabase.functions.invoke(
    "supabase-functions-get-plans",
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <Hero />

      {/* Stats Section */}
      {/*
      <section className="py-20 bg-green-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-green-100">Products Scanned</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5,000+</div>
              <div className="text-green-100">
                Harmful Ingredients Identified
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-green-100">User Satisfaction</div>
            </div>
          </div>
        </div>
      </section>
      */}

      {/* Pricing Section */}
      {/*
      <section className="py-24 bg-white" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan for your needs. No hidden fees.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans?.map((item: any) => (
              <PricingCard key={item.id} item={item} user={user} />
            ))}
          </div>
        </div>
      </section>
      */}

      {/* CTA Section */}
      {/*
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust us with their
            business.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started Now
            <ArrowUpRight className="ml-2 w-4 h-4" />
          </a>
        </div>
      </section>
      */}

      {/* About Me Section */}
      <section className="py-12 bg-white border-t border-gray-100 mt-12">
        <div className="container mx-auto px-4 text-center flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-2">About Me</h2>
          <p className="text-gray-700 max-w-xl mb-2">I'm Norbert Grzenkowicz, the developer of this app. I'm a so-called software engineer and I care about my health. Crazy. I know. </p>
          <p className="text-gray-700 max-w-xl mb-6">Socials:</p>
          <div className="flex gap-6 justify-center">
            <a href="https://www.linkedin.com/in/norbertgrzenkowicz" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-700 hover:text-blue-900 font-medium transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8a6 6 0 016 6v5a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4a2 2 0 00-4 0v4a1 1 0 01-1 1H7a1 1 0 01-1-1v-5a6 6 0 016-6z" /><circle cx="4" cy="4" r="2" /><rect x="2" y="8" width="4" height="12" rx="1" /></svg>
              LinkedIn
            </a>
            <a href="https://github.com/norbertgrzenkowicz" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-800 hover:text-black font-medium transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.167 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.461-1.11-1.461-.908-.62.069-.608.069-.608 1.004.07 1.532 1.031 1.532 1.031.892 1.528 2.341 1.087 2.91.832.092-.646.35-1.087.636-1.338-2.221-.253-4.555-1.111-4.555-4.945 0-1.091.39-1.984 1.029-2.683-.103-.254-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.338 1.909-1.295 2.748-1.025 2.748-1.025.545 1.378.202 2.396.1 2.65.64.699 1.028 1.592 1.028 2.683 0 3.842-2.337 4.688-4.565 4.937.359.309.678.919.678 1.852 0 1.336-.012 2.416-.012 2.744 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" /></svg>
              GitHub
            </a>
          </div>
        </div>
      </section>
      {/* <Footer /> */}
    </div>
  );
}
