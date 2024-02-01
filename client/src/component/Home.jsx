import React from 'react';
import { Link } from 'react-router-dom';

const Home = ({ isLogged = false }) => {
  return (
    <div className="h-[90vh]">
    Home
      {/* <main className="container mx-auto py-12">
        <section className="text-center">
          <h1 className="text-4xl font-bold text-gray-800">Welcome to Calendly</h1>
          <p className="mt-4 text-gray-600">Simplify your scheduling process with ease.</p>
          <Link to={isLogged ? "/scheduling" : "/login"}> <button className="mt-8 bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-full text-lg">
            Get Started
          </button></Link>
        </section>
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Key Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Easy Scheduling</h3>
              <p className="text-gray-600">
                Schedule meetings effortlessly with our intuitive and user-friendly interface.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Calendar Integration</h3>
              <p className="text-gray-600">
                Sync with popular calendar platforms to keep your schedule up to date.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Automatic Reminders</h3>
              <p className="text-gray-600">
                Send automated reminders to ensure everyone is on track for their appointments.
              </p>
            </div>
          </div>
        </section>
      </main> */}

    </div>
  );
};

export default Home;
