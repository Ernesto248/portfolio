import { motion } from "framer-motion";
interface Props {
  children: React.ReactNode;
}

const ScrollReveal = ({ children }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
