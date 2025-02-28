import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div
      id="home"
      className="px-16 min-h-screen flex flex-col w-full items-center justify-center py-28 md:px-32"
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <img
          src="me.png"
          alt=""
          className="w-[300px] cursor-pointer rounded-full shadow-xl shadow-indigo-900 transition-all duration-300 hover:-translate-y-5 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-600 md:w-[350px] mb-10"
        />
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex max-w-[600px] flex-col items-center justify-center gap-3 text-center"
      >
        <h1 className="bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent  text-5xl font-light md:text-7xl">
          Ernesto Leonard
        </h1>
        <h3 className="bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent  text-2xl md:text-3xl">
          Web Developer
        </h3>
        <p className="md:text-base text-pretty text-sm text-gray-400">
          I'm a frontend developer skilled in React, Typescript and Tailwind,
          focused on building clean, scalable aplications. From frontend design
          to seamless database integration with PostgreSql, i create eficcent
          solutions for dynamic user experience. Let's build something great
          together!
        </p>
      </motion.div>
    </div>
  );
};

export default Hero;
