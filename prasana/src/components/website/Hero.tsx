import React from 'react';

const Hero = () => {
  return (
    <div id="home" className="relative pt-16 pb-32 flex content-center items-center justify-center min-h-screen-75">
      <div className="absolute top-0 w-full h-full bg-center bg-cover" style={{ 
        backgroundImage: "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80')",
      }}>
        <span id="blackOverlay" className="w-full h-full absolute opacity-50 bg-black"></span>
      </div>
      
      <div className="container relative mx-auto max-w-7xl px-4">
        <div className="items-center flex flex-wrap">
          <div className="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
            <div>
              <h1 className="text-white font-semibold text-5xl mb-4">
                Your Digital Success Begins Here
              </h1>
              <p className="mt-4 text-lg text-gray-200">
                We create stunning websites, develop powerful applications, and provide comprehensive digital solutions 
                that help your business thrive in the digital world.
              </p>
              <div className="mt-10 flex justify-center space-x-4">
                <a href="#services" className="bg-indigo-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-300">
                  Our Services
                </a>
                <a href="#contact" className="bg-transparent border-2 border-white text-white font-bold px-6 py-3 rounded-lg hover:bg-white hover:text-indigo-900 transition duration-300">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Animated scroll indicator */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-8 animate-bounce">
        <a href="#about" className="text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </a>
      </div>
    </div>
  );
};

export default Hero; 