import ProjectCard from "../ProjectCard";
import { Project } from "../../types/types.d";
import ScrollReveal from "../ScrollReveal";

const ProjectData: Project[] = [
  {
    img: "asdf",
    title: "Project1",
    description: "Lorem Ipsum",
    technologies: ["Typescript", "Tailwind"],
  },
  {
    img: "asdf",
    title: "Project2",
    description: "Lorem Ipsum",
    technologies: ["Typescript", "Tailwind"],
  },
  {
    img: "asdf",
    title: "Project3",
    description: "Lorem Ipsum",
    technologies: ["Typescript", "Tailwind"],
  },
];

const Projects = () => {
  return (
    <ScrollReveal>
      <div
        id="projects"
        className="flex min-h-screen w-full flex-col items-center justify-center gap-16 p-4 md:px-14 md:py-24"
      >
        <h1 className="text-4xl font-light text-white md:text-6xl">
          My Projects
        </h1>

        <div className="flex w-full max-w-[1000px] flex-col gap-16 text-white">
          {ProjectData.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
};

export default Projects;
