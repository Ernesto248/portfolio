import { Project } from "../../types/types";
import ScrollReveal from "../ScrollReveal";

interface Props {
  project: Project;
}

const ProjectCard = ({ project }: Props) => {
  return (
    <ScrollReveal>
      <div className="flex flex-col gap-8 items-center md:flex-row md:gap-24">
        <img
          src={project.img}
          alt=""
          className="w-full cursor-pointer rounded-2xl transition-all duration-300 hover:scale-105 md:w-[300px]"
        />

        <div className="flex flex-col gap-5">
          <div>
            <div className="text-xl font-semibold">{project.title}</div>
            <p className="text-gray-400">{project.description}</p>
          </div>

          <div className="flex flex-wrap gap-5">
            {project.technologies.map((tech, index) => (
              <span key={index} className="rounded-lg bg-black p-3">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

export default ProjectCard;
