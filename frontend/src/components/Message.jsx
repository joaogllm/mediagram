import { motion, AnimatePresence } from "framer-motion";
import "./Message.css";

const Message = ({ msg, type }) => {
  return (
    <AnimatePresence>
      {msg && (
        <motion.div
          key={msg}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`message ${type}`}
        >
          <p>{msg}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Message;
