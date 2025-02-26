import { BiLogoTypescript } from "react-icons/bi";

const Tech = () => {
  return (
    <div
      id="tech"
      className="flex min-h-[70vh] justify-center items-center flex-col w-full gap-16 md:gap-32"
    >
      <h1 className="text-4xl font-light text-white md:text-6xl">
        Technologies
      </h1>

      <div className="flex flex-wrap items-center justify-center gap-10 p-5">
        <div>
          <BiLogoTypescript />
        </div>
      </div>
    </div>
  );
};

export default Tech;
