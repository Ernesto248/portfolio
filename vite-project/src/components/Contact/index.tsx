const Contact = () => {
  return (
    <div
      id="#contact"
      className="flex min-h-[70vh] min-w-full items-center justify-center"
    >
      <div className="flex flex-col items-center justify-center gap-3 space-y-6 p-14">
        <h1 className="text-center text-5xl md:w-7xl">
          <span className="bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">
            Get in Touch
          </span>
        </h1>

        <p className="text-center text-lg font-semibold text-gray-500">
          Want to chat? send me an E-mail through this button and I'll respond
          whenever I can
        </p>

        <a href="" className="text-nowrap">
          Contact Me
        </a>
      </div>
    </div>
  );
};

export default Contact;
