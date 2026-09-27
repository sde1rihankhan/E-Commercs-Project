import { Button } from "@base-ui/react";
import React from "react";
import img from '../assets/133335-photos-12-apple-iphone-free-download-png-hq.png'

const Hero = () => {
  return (
    <section className="bg-linear-to-r from-cyan-500 to-blue-500 text-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Latest Electronics at Best Prices
            </h1>
            <p className="text-xl mb-6 text-blue-100">
              Discover cutting-edge technology with unbeatable deals on
              smartphones, laptop and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 p-2 rounded-2xl">
                Shop Now
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-500 bg-transparent rounded-2xl p-2"
              >
                View Deals
              </Button>
            </div>
          </div>
          <div className="relative m-auto">
            <img className="rounded-lg shadow-2xl" src={img} width={300} height={400}/>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
